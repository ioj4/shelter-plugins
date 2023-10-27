const {
    flux: { dispatcher },
    ui: { ReactiveRoot }
} = shelter;

import Timer from "./components/timer";

function addTimer() {
    document
        .querySelector(
            `[class*="connection"] > div[class*="inner"] > div > a > div[class*="subtext"]`
        )
        .prepend(
            <ReactiveRoot>
                <Timer />
            </ReactiveRoot>
        );
}

function onDispatch(e) {
    if (e.event === "join_voice_channel") {
        addTimer();
    }
}

export function onLoad() {
    dispatcher.subscribe("TRACK", onDispatch);
}

export function onUnload() {
    dispatcher.unsubscribe("TRACK", onDispatch);
}
