import {
    isSomeoneTypingInChannel,
    removeAllIndicators,
    forceUpdateChannels,
    removeTypingIndicator,
    addTypingIndicator
} from "./utils";

const {
    flux: { awaitStore },
    util: { getFiber, reactFiberWalker },
    plugin: { scoped }
} = shelter;

export const channelElementQuery = `a[data-list-item-id^="channels___"]:not([class^="mainContent"])`;
let isPatched = false;

async function handleTypingDispatch({ type, userId, channelId }) {
    const userStore = await awaitStore("UserStore");
    if (userId === userStore.getCurrentUser().id) return;

    switch (type) {
        case "TYPING_START":
            return addTypingIndicator(channelId);
        case "TYPING_STOP":
        case "MESSAGE_CREATE":
            if (!(await isSomeoneTypingInChannel(channelId))) {
                removeTypingIndicator(channelId);
            }
    }
}

function patchRender(channelEl) {
    const fiber = getFiber(channelEl);
    const component = reactFiberWalker(fiber, (f) => !!f?.type?.render, true);
    if (!component) return;

    scoped.patcher.after("render", component.type, (args) => {
        const itemId = args[0]["data-list-item-id"];
        if (!itemId) return;

        const channelId = itemId.split("___")[1];

        queueMicrotask(async () => {
            if (await isSomeoneTypingInChannel(channelId)) {
                addTypingIndicator(channelId);
            } else {
                removeTypingIndicator(channelId);
            }
        });
    });

    isPatched = true;
    forceUpdateChannels();
}

async function waitForChannelElementAndPatch() {
    // when loading the plugin there might already be a channel element rendered
    // that we can use to patch it's render method
    const channel = document.querySelector(channelElementQuery);
    if (channel) {
        patchRender(channel);
        if (isPatched) return;
    }

    // otherwise wait until one gets added to dom
    const unobserve = scoped.observeDom(channelElementQuery, (el) => {
        // unobserve takes effect only after this batch of dom changes
        // so we still need to make sure we don't patch it multiple times
        if (isPatched) return;
        patchRender(el);
        if (!isPatched) return;
        unobserve();
    });
}

// MESSAGE_CREATE: in case the user sends their message (doesn't trigger TYPING_STOP)
const triggers = ["TYPING_START", "TYPING_STOP", "MESSAGE_CREATE"];

export function onLoad() {
    waitForChannelElementAndPatch();
    triggers.forEach((t) => scoped.flux.subscribe(t, handleTypingDispatch));
}

export function onUnload() {
    isPatched = false;
    removeAllIndicators();
}
