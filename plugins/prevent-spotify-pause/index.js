const {
    flux: { awaitStore },
    plugin: { scoped }
} = shelter;

const spotifyRe = /https?:\/\/api.spotify.com\/v\d+\/me\/player\/pause/;

const getSentryProperty = (obj) =>
    obj[Object.keys(obj).find((k) => k.startsWith("__sentry_xhr"))];

export async function onLoad() {
    const spotifyStore = await awaitStore("SpotifyStore");
    // prevent notice from showing
    scoped.patcher.instead("wasAutoPaused", spotifyStore, () => false);

    // prevent access to the pause endpoint
    scoped.patcher.instead(
        "send",
        XMLHttpRequest.prototype,
        function (args, orig) {
            if (!spotifyRe.test(getSentryProperty(this)?.url)) {
                return orig.apply(this, args);
            }
        }
    );
}
