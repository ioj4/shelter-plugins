const {
    flux: {
        stores: { NoticeStore, VoiceStateStore },
        dispatcher
    },
    patcher
} = shelter;

// accessing the NoticeStore too early throws an error sometimes
// so wait until the latest possible moment (when a vc is joined)
function awaitVoiceChannel() {
    return new Promise((resolve) => {
        if (VoiceStateStore.isCurrentClientInVoiceChannel()) {
            resolve();
            return;
        }
        const onDispatch = (payload) => {
            if (payload?.event === "join_voice_channel") {
                resolve();
                dispatcher.unsubscribe("TRACK", onDispatch);
            }
        };
        dispatcher.subscribe("TRACK", onDispatch);
    });
}

// dismiss popup in advance
awaitVoiceChannel().then(() => {
    NoticeStore.__getLocalVars().temporaryDismisses[
        "SPOTIFY_AUTO_PAUSED"
    ] = true;
});

const testUrl = /https?:\/\/api.spotify.com.+\/me\/player\/pause/;

// prevent access to the pause endpoint
export const onUnload = patcher.instead(
    "send",
    XMLHttpRequest.prototype,
    function (args, orig) {
        if (!testUrl.test(this.__sentry_xhr__?.url)) {
            return orig.apply(this, args);
        }
    }
);
