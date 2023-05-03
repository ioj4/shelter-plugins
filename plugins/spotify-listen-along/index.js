const {
    flux: {
        dispatcher,
        stores: { SpotifyStore }
    },
    patcher
} = shelter;

let uninject;

function injectStore() {
    if (uninject) return;
    uninject = patcher.after(
        "getActiveSocketAndDevice",
        SpotifyStore,
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
    uninject && uninject();
}
