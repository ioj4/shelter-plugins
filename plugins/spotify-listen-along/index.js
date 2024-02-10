const { awaitStore } = shelter.flux;
const scoped = shelter.plugin.scoped;

export async function onLoad() {
    const spotifyStore = await awaitStore("SpotifyStore");
    scoped.patcher.after("getActiveSocketAndDevice", spotifyStore, (_, res) => {
        if (res?.socket) {
            res.socket.isPremium = true;
        }
    });
}
