const {
    flux: awaitStore,
    plugin: { scoped }
} = shelter;

export async function onLoad() {
    const spotifyStore = await awaitStore("SpotifyStore");
    scoped.patcher.after("getActiveSocketAndDevice", spotifyStore, (_, res) => {
        if (res?.socket) {
            res.socket.isPremium = true;
        }
    });
}
