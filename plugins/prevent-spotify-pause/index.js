const {
    flux: { awaitStore },
    patcher
} = shelter;

const testUrl = /https?:\/\/api.spotify.com.+\/me\/player\/pause/;
let unpatchStore, unpatchXHR;

export async function onLoad() {
    const spotifyStore = await awaitStore("SpotifyStore");
    // prevent notice from showing
    unpatchStore = patcher.instead("wasAutoPaused", spotifyStore, () => false);

    // prevent access to the pause endpoint
    unpatchXHR = patcher.instead(
        "send",
        XMLHttpRequest.prototype,
        function (args, orig) {
            if (!testUrl.test(this.__sentry_xhr_v2__?.url)) {
                return orig.apply(this, args);
            }
        }
    );
}

export function onUnload() {
    unpatchStore?.();
    unpatchXHR?.();
}
