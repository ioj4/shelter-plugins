import TypingIndicator from "./components/typing-indicator";
import { classes } from "./styles.jsx.scss";
import { channelElementQuery } from ".";

const {
    flux: { awaitStore },
    solidWeb: { render },
    util: { getFiber, reactFiberWalker }
} = shelter;

export function forceUpdateChannels() {
    const channels = document.querySelectorAll(channelElementQuery);
    channels.forEach((channel) => {
        const fiber = getFiber(channel);
        const filter = ({ stateNode }) =>
            stateNode && !(stateNode instanceof Element);
        const ownerInstance = reactFiberWalker(fiber, filter, true)?.stateNode;

        ownerInstance?.forceUpdate();
    });
}

function getChannelIconContainer(channelId) {
    const channelElement = document.querySelector(
        `[data-list-item-id="channels___${channelId}"]`
    )?.parentElement;

    return channelElement?.querySelector(`div[class^="children-"]`);
}

export async function removeTypingIndicator(channelId) {
    const iconContainer = getChannelIconContainer(channelId);
    const typingIndicator = iconContainer?.querySelector(
        `.${classes.indicator}`
    );

    typingIndicator?.remove();
}

export function addTypingIndicator(channelId) {
    const iconContainer = getChannelIconContainer(channelId);

    if (
        iconContainer &&
        !iconContainer.querySelector(`.${classes.indicator}`)
    ) {
        const typingIndicatorWrapper = document.createElement("div");
        typingIndicatorWrapper.classList.add(classes.indicator);
        iconContainer.prepend(typingIndicatorWrapper);

        render(() => <TypingIndicator />, typingIndicatorWrapper);
    }
}

export async function isSomeoneTypingInChannel(channelId) {
    const typingStore = await awaitStore("TypingStore");
    const userStore = await awaitStore("UserStore");

    const currentUserId = userStore.getCurrentUser().id;
    const typingUsers = Object.keys(
        typingStore.getTypingUsers(channelId)
    ).filter((id) => id !== currentUserId);
    return typingUsers.length !== 0;
}

export function removeAllIndicators() {
    document
        .querySelectorAll(`.${classes.indicator}`)
        .forEach((e) => e.remove());
}
