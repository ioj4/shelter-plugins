const {
    flux: { awaitStore },
    plugin: { scoped }
} = shelter;

const testUrl = /https?:\/\/api.spotify.com\/v\d+\/me\/player\/pause/;

export async function onLoad() {
    const spotifyStore = await awaitStore("SpotifyStore");
    // prevent notice from showing
    scoped.patcher.instead("wasAutoPaused", spotifyStore, () => false);

    // prevent access to the pause endpoint
    scoped.patcher.instead(
        "send",
        XMLHttpRequest.prototype,
        function (args, orig) {
            if (!testUrl.test(this.__sentry_xhr_v2__?.url)) {
                return orig.apply(this, args);
            }
        }
    );
}
