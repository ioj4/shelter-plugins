const {
    flux: { awaitStore },
    ui: { ReactiveRoot },
    plugin: { scoped, store }
} = shelter;

import Timer from "./components/timer";

const SUBTEXT_QUERY = `div[class^="rtcConnectionStatus"] a div[class^="lineClamp"]:not(:has(.ioj4-vct))`;

let insertLock = false;

export async function insertTimer() {
    if (insertLock || !store.isInVC) return;
    insertLock = true;

    const subtext =
        document.querySelector(SUBTEXT_QUERY) ??
        (await new Promise((res) => {
            const unobserve = scoped.observeDom(SUBTEXT_QUERY, res);
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

let lastLeave = 0;

function initializeTimer() {
    // if we're already in a voice channel, don't do anything
    if (!store.isInVC) {
        store.isInVC = true;
        // no reset if persistTime and user was connected to a voice channel in the last 10 secs
        if (!store.persistTime || lastLeave < Date.now() - 10_000) {
            store.joinTime = Date.now();
        }
    }
    insertTimer();
}

function onTrack(e) {
    if (e.event === "join_voice_channel") {
        initializeTimer();
    } else if (e.event === "leave_voice_channel") {
        store.isInVC = false;
        lastLeave = Date.now();
    }
}

function onLogout() {
    store.isInVC = false;
}

export async function onLoad() {
    const vcStore = await awaitStore("VoiceStateStore");
    if (vcStore.isCurrentClientInVoiceChannel()) initializeTimer();
    scoped.flux.subscribe("TRACK", onTrack);
    scoped.flux.subscribe("LOGOUT", onLogout);
}

export function onUnload() {
    store.isInVC = false;
    document.querySelectorAll(`.ioj4-vct`).forEach((e) => e.remove());
}

export { settings } from "./settings";
