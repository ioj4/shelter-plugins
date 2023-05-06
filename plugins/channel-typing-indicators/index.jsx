const {
    ui: { injectCss },
    flux: { dispatcher, awaitStore },
    solidWeb: { render }
} = shelter;

import { css, classes } from "./styles.jsx.scss";
import TypingIndicator from "./components/typing-indicator";

async function handleTypingDispatch(payload) {
    // ignore when the current user is typing
    const userStore = await awaitStore("UserStore");
    if (payload?.userId === userStore?.getCurrentUser()?.id) return;

    const channelElement = document.querySelector(
        `[data-list-item-id="channels___${payload?.channelId}"]`
    )?.parentElement;
    if (!channelElement) return;

    const iconContainer = channelElement.querySelector(
        `div[class^="children-"]`
    );
    if (!iconContainer) return;

    switch (payload?.type) {
        case "TYPING_START": {
            if (!iconContainer.querySelector(`.${classes.indicator}`)) {
                const typingIndicatorWrapper = document.createElement("div");
                iconContainer.prepend(typingIndicatorWrapper);
                render(() => <TypingIndicator />, typingIndicatorWrapper);
            }
            return;
        }
        case "TYPING_STOP":
        case "MESSAGE_CREATE": {
            const typingIndicator = iconContainer.querySelector(
                `.${classes.indicator}`
            );
            if (!typingIndicator) return;
            const typingStore = await awaitStore("TypingStore");
            const typingUsers = typingStore?.getTypingUsers(payload?.channelId);
            if (!typingUsers || Object.keys(typingUsers).length === 0) {
                typingIndicator.remove();
            }
        }
    }
}

let uninject;

// TYPING_STOP is not called when the user sends their message
// that's why MESSAGE_CREATE is used as well
const triggers = ["TYPING_START", "TYPING_STOP", "MESSAGE_CREATE"];

export function onLoad() {
    triggers.forEach((t) => dispatcher.subscribe(t, handleTypingDispatch));
    uninject = injectCss(css);
}

export function onUnload() {
    triggers.forEach((t) => dispatcher.unsubscribe(t, handleTypingDispatch));
    uninject && uninject();
}
