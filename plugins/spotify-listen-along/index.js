const {
    flux: { dispatcher, awaitStore },
    patcher
} = shelter;

let uninject;

async function injectStore() {
    const spotifyStore = await awaitStore("SpotifyStore");
    if (uninject) return;
    uninject = patcher.after(
        "getActiveSocketAndDevice",
        spotifyStore,
        (_, response) => {
            if (response?.socket) response.socket.isPremium = true;
            return response;
        }
    );
}

export function onLoad() {
    dispatcher.subscribe("SPOTIFY_PLAYER_STATE", injectStore);
}

export function onUnload() {
    dispatcher.unsubscribe("SPOTIFY_PLAYER_STATE", injectStore);
    uninject?.();
}
