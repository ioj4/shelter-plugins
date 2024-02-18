const {
    flux: {
        stores: { SpotifyStore }
    }
} = shelter;

function getDeviceAndSocket() {
    console.log(SpotifyStore);
    if (!SpotifyStore.hasConnectedAccount()) {
        throw new Error(
            "No account found. Have you connected your Spotify account yet?"
        );
    }

    const deviceAndSocket = SpotifyStore.getPlayableComputerDevices()[0];
    if (!deviceAndSocket || deviceAndSocket.length === 0) {
        throw new Error("No device found. Start Spotify and try again");
    }

    return deviceAndSocket;
}

const reauth = async () => {
    getDeviceAndSocket().socket.handleDeviceStateChange();
    return new Promise((resolve) => setTimeout(resolve, 2_000));
};

async function spotifyRequest(
    method,
    path,
    searchParams,
    body,
    isRetry = false
) {
    const { device, socket } = getDeviceAndSocket();

    const token = socket.accessToken;

    const url = new URL(`https://api.spotify.com/v1/me/player/${path}`);

    url.search = new URLSearchParams({
        device_id: device.id,
        ...searchParams
    }).toString();

    return new Promise((resolve, reject) => {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        };
        fetch(url.toString(), options).then(async (res) => {
            if (res.ok) {
                return resolve();
            } else if (res.status === 401 && !isRetry) {
                console.log("Trying reauth");
                shelter.ui.showToast({ title: "Reauth" });
                await reauth();
                spotifyRequest(...arguments, true);
            }
            reject(`Error during request: ${res.status}`);
        });
    });
}

async function unshortenSpotifyURL(url) {
    const re = /<meta property="og:url" content="(.+?)"\/>/;
    const body = await (
        await fetch(`https://shcors.uwu.network/${url}`)
    ).text();
    console.log(re.exec(body));
    return re.exec(body)?.[1];
}

async function replaceURL(url) {
    try {
        url = new URL(url);

        if (url.hostname === "spotify.link") {
            url = new URL(await unshortenSpotifyURL(url));
        }

        for (const [appName, app] of Object.entries(apps)) {
            if (
                app.hostnames.includes(url.hostname) &&
                store.enabledApps[appName]
            ) {
                return app.protocol + url.toString();
            }
        }
    } catch (e) {}
    console.log("repalced", url);
    return url.toString();
}

export async function open(url) {
    window.open(await replaceURL(url));
}

async function extractTypeAndID(url) {
    const { pathname } = new URL((await replaceURL(url)).toLowerCase());
    const re = /(track|album|playlist|episode|show|artist)(?:\/)([a-z0-9]+)/i;
    return re.exec(pathname).slice(1);
}

export async function play(url) {
    const [type, id] = await extractTypeAndID(url);
    console.log(type, id);
    const body =
        type === "track"
            ? { uris: [`spotify:${type}:${id}`] }
            : { context: `spotify:${type}:${id}` };

    body.position_ms = 0;
    spotifyRequest("PUT", "play", {}, body).then(console.log, console.error);
}

export async function queue(url) {
    const [type, id] = await extractTypeAndID(url);

    console.log(type);
    if (!["episode", "track"].includes(type)) {
        shelter.ui.showToast({ title: "This item can not be queued!" });
    }

    spotifyRequest("POST", "queue", {
        uri: `spotify:${type}:${id}`
    }).then(
        () => shelter.ui.showToast({ title: "success" }),
        (err) => {
            shelter.ui.showToast({ title: "no success" });
            console.warn(err);
        }
    );
}
