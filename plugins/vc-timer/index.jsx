const {
    flux: { dispatcher },
    ui: { injectCss }
} = shelter;

import Timer from "./components/timer";
import { css } from "./components/timer.jsx.scss";

function addTimer() {
    document
        .querySelector(
            `[class*="connection"] > div[class*="inner"] > div > a > div[class*="subtext"]`
        )
        .prepend(<Timer />);
}

function onDispatch(e) {
    if (e.event === "join_voice_channel") {
        addTimer();
    }
}

let uninject;

export function onLoad() {
    uninject = injectCss(css);
    dispatcher.subscribe("TRACK", onDispatch);
}

export function onUnload() {
    dispatcher.unsubscribe("TRACK", onDispatch);
    uninject();
}
