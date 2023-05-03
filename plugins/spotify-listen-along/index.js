const {
    flux: {
        dispatcher,
        stores: { SpotifyStore }
    },
    patcher
} = shelter;

let uninject;

function storeInjectHandler() {
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
    dispatcher.subscribe("SPOTIFY_PLAYER_STATE", storeInjectHandler);
}

export function onUnload() {
    dispatcher.unsubscribe("SPOTIFY_PLAYER_STATE", storeInjectHandler);
    uninject && uninject();
}
