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
        }
        case "TYPING_STOP": {
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

export function onLoad() {
    dispatcher.subscribe("TYPING_START", handleTypingDispatch);
    dispatcher.subscribe("TYPING_STOP", handleTypingDispatch);
    uninject = injectCss(css);
}

export function onUnload() {
    dispatcher.unsubscribe("TYPING_START", handleTypingDispatch);
    dispatcher.unsubscribe("TYPING_STOP", handleTypingDispatch);
    uninject && uninject();
}
