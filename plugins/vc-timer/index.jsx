const {
    flux: { dispatcher },
    ui: { ReactiveRoot },
    observeDom
} = shelter;

import Timer from "./components/timer";

function addTimer() {
    const unobserve = observeDom(
        `[class^="rtcConnectionStatus"] + a > div[class*="subtext"]`,
        (subtext) => {
            if (subtext.dataset.ioj4_vc_timer) return;
            unobserve();
            subtext.prepend(
                <ReactiveRoot>
                    <Timer />
                </ReactiveRoot>
            );
            subtext.dataset.ioj4_vc_timer = true;
        }
    );
    setTimeout(unobserve, 2_000);
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
