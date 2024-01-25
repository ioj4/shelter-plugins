const {
    flux: { dispatcher, awaitStore },
    ui: { ReactiveRoot },
    plugin: { store },
    observeDom
} = shelter;

import Timer from "./components/timer";

const SUBTEXT_QUERY = `[class^="rtcConnectionStatus"] + a > div[class*="subtext"]:not(:has(.ioj4-vct))`;

let insertLock = false;

export async function insertTimer() {
    if (insertLock || !store.isInVC) return;
    insertLock = true;

    const subtext =
        document.querySelector(SUBTEXT_QUERY) ??
        (await new Promise((res) => {
            const unobserve = observeDom(SUBTEXT_QUERY, res);
            setTimeout(() => {
                unobserve();
                res();
            }, 2_000);
        }));

    if (!subtext) {
        insertLock = false;
        return;
    }

    const timer = (
        <ReactiveRoot>
            <Timer />
        </ReactiveRoot>
    );
    timer.className = "ioj4-vct";

    subtext.prepend(timer);
    insertLock = false;
}

function initializeTimer() {
    if (!store.isInVC) {
        store.isInVC = true;
        store.joinTime = Date.now() / 1_000;
    }
    insertTimer();
}

function onDispatch(e) {
    if (e.event === "join_voice_channel") {
        initializeTimer();
    } else if (e.event === "leave_voice_channel") {
        store.isInVC = false;
    }
}

export async function onLoad() {
    const vcStore = await awaitStore("VoiceStateStore");
    if (vcStore.isCurrentClientInVoiceChannel()) initializeTimer();

    dispatcher.subscribe("TRACK", onDispatch);
}

export function onUnload() {
    store.isInVC = false;
    dispatcher.unsubscribe("TRACK", onDispatch);
    document.querySelectorAll(`.ioj4-vct`).forEach((e) => e.remove());
}
