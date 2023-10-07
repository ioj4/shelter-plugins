import { css } from "./styles.jsx.scss";
import {
    isSomeoneTypingInChannel,
    removeAllIndicators,
    forceUpdateChannels,
    removeTypingIndicator,
    addTypingIndicator
} from "./utils";

const {
    ui: { injectCss },
    flux: { dispatcher, awaitStore },
    util: { getFiber, reactFiberWalker },
    patcher,
    observeDom
} = shelter;

export const channelElementQuery = `[data-list-item-id^="channels___"]:not([class^="mainContent"])`;
let isPatched = false;
let unpatch;

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

function patchFiber(channel) {
    const fiber = getFiber(channel);
    const component = reactFiberWalker(
        fiber,
        (f) => !!f?.type?.render,
        true,
        true
    );
    if (!component) return;

    unpatch = patcher.after("render", component.type, (args) => {
        const itemId = args[0]["data-list-item-id"];
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

async function handleChanneListDispatch() {
    const unObserve = observeDom(channelElementQuery, (channel) => {
        // prevent patching multiple times
        if (!isPatched) {
            patchFiber(channel);
            unObserve();
            dispatcher.unsubscribe(
                "UPDATE_CHANNEL_LIST_DIMENSIONS",
                handleChanneListDispatch
            );
        }
    });

    setTimeout(unObserve, 1_000);
}

function attemptPatch() {
    const channel = document.querySelector(channelElementQuery);
    if (!channel) return;
    patchFiber(channel);
}

let uninject;

// MESSAGE_CREATE: in case the user sends their message (doesn't trigger TYPING_STOP)
const triggers = ["TYPING_START", "TYPING_STOP", "MESSAGE_CREATE"];

export function onLoad() {
    uninject = injectCss(css);
    // when loading the plugin there might already be a channel element rendered
    attemptPatch();
    triggers.forEach((t) => dispatcher.subscribe(t, handleTypingDispatch));
    // if attemptPatch didn't succeed
    !isPatched &&
        dispatcher.subscribe(
            "UPDATE_CHANNEL_LIST_DIMENSIONS",
            handleChanneListDispatch
        );
}

export function onUnload() {
    triggers.forEach((t) => dispatcher.unsubscribe(t, handleTypingDispatch));
    dispatcher.unsubscribe(
        "UPDATE_CHANNEL_LIST_DIMENSIONS",
        handleChanneListDispatch
    );
    uninject?.();
    unpatch?.();
    isPatched = false;
    removeAllIndicators();
}
