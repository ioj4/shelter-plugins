const {
    flux: {
        stores: { SpotifyStore }
    },
    util: { awaitDispatch }
} = shelter;

export const URL_REGEX =
    /^https:\/\/open\.spotify\.com\/(track|album|playlist|episode|show|artist|user)(?:\/)([a-z0-9]+).*$/i;

function getDeviceAndSocket() {
    if (!SpotifyStore.hasConnectedAccount()) {
        throw new Error(
            "No account found. Have you connected your Spotify account yet?"
        );
    }

    const deviceAndSocket = SpotifyStore.getActiveSocketAndDevice();
    if (!deviceAndSocket) {
        throw new Error("No device found. Start Spotify and try again..");
    }

    return deviceAndSocket;
}

async function refreshAccessToken() {
    getDeviceAndSocket().socket.handleDeviceStateChange();
    return Promise.race([
        awaitDispatch("SPOTIFY_SET_DEVICES"),
        new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error("Couldn't refresh Access Token!")),
                3_000
            )
        )
    ]);
}

async function spotifyRequest(
    method,
    path,
    searchParams,
    body,
    isRetry = false
) {
    return new Promise((resolve, reject) => {
        const { device, socket } = getDeviceAndSocket();

        const token = socket.accessToken;

        const url = new URL(`https://api.spotify.com/v1/me/player/${path}`);

        url.search = new URLSearchParams({
            device_id: device.id,
            ...searchParams
        });

        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        };
        fetch(url, options).then(async (res) => {
            if (res.ok) return resolve();
            if (res.status === 401 && !isRetry) {
                refreshAccessToken()
                    .then(() => spotifyRequest(...arguments, true))
                    .then(resolve, reject);
                return;
            }
            reject(new Error(`Spotify API request failed with ${res.status}!`));
        });
    });
}

export function extractTypeAndId(url) {
    const match = URL_REGEX.exec(url);
    if (!match) return;
    return match.slice(1);
}

export async function open({ url: urlString }) {
    const url = new URL(urlString);
    url.searchParams.delete("si"); // remove tracking parameter
    window.open("spotify:/" + url.pathname + url.search);
}

export async function play({ type, id }) {
    const body =
        type === "track"
            ? { uris: [`spotify:${type}:${id}`] }
            : { context_uri: `spotify:${type}:${id}` }; // playlist, album, artist

    body.position_ms = 0;
    return spotifyRequest("PUT", "play", {}, body);
}

export async function queue({ type, id }) {
    return spotifyRequest("POST", "queue", {
        uri: `spotify:${type}:${id}`
    });
}
