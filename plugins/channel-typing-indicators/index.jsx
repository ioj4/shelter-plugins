const {
    ui: { injectCss },
    flux: {
        stores: { UserStore, TypingStore },
        dispatcher
    },
    solidWeb: { render }
} = shelter;

import { css, classes } from "./styles.jsx.scss";
import TypingIndicator from "./components/typing-indicator";

function handleTypingDispatch(payload) {
    // ignore when the current user is typing
    if (payload?.userId === UserStore?.getCurrentUser()?.id) return;

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
            if (
                typingIndicator &&
                Object.keys(TypingStore.getTypingUsers(payload?.channelId))
                    .length === 0
            ) {
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
