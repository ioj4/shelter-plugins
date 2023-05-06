const {
    flux: { awaitStore },
    patcher
} = shelter;

const testUrl = /https?:\/\/api.spotify.com.+\/me\/player\/pause/;
let unpatch;

export async function onLoad() {
    // dismiss notice in advance
    const noticeStore = await awaitStore("NoticeStore");
    noticeStore.__getLocalVars().temporaryDismisses[
        "SPOTIFY_AUTO_PAUSED"
    ] = true;

    // prevent access to the pause endpoint
    unpatch = patcher.instead(
        "send",
        XMLHttpRequest.prototype,
        function (args, orig) {
            if (!testUrl.test(this.__sentry_xhr__?.url)) {
                return orig.apply(this, args);
            }
        }
    );
}

export function onUnload() {
    unpatch?.();
}
