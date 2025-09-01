const {
    plugin: { store, scoped }
} = shelter;

export const apps = {
    Spotify: {
        hostnames: ["open.spotify.com", "spotify.link"],
        protocolName: "spotify",
        applyProtocol: (url) => `spotify:/${url.pathname}`,
        default: true
    },
    Steam: {
        hostnames: [
            "store.steampowered.com",
            "steamcommunity.com",
            "help.steampowered.com"
        ],
        protocolName: "steam",
        applyProtocol: (url) => `steam://openurl/${url}`,
        default: true
    },
    SoundCloud: {
        hostnames: ["soundcloud.com", "on.soundcloud.com"],
        protocolName: "soundpout",
        applyProtocol: (url) => `soundpout:/${url.pathname}`,
        default: false
    }
};

function getEnabledApp(url) {
    if (!/https?:\/\//.test(url.toString())) return;
    const { hostname } = new URL(url);
    return Object.entries(apps).find(
        ([appName, app]) => app.hostnames.includes(hostname) && store[appName]
    );
}

async function unshortenLink(url) {
    const re = /<meta property="og:url" content="(.+?)"/;
    const body = await (
        await fetch(`https://shcors.uwu.network/${url}`)
    ).text();
    return re.exec(body)?.[1];
}

async function openInApp(url) {
    try {
        url = new URL(url);

        if (["spotify.link", "on.soundcloud.com"].includes(url.hostname)) {
            url = new URL(await unshortenLink(url));
        }

        // remove /intl-xx/ from spotify urls
        if (url.hostname === "open.spotify.com") {
            url.pathname = url.pathname.replace(/\/intl-.+?(\/.+)/i, "$1");
        }

        const [appName, app] = getEnabledApp(url);
        const replacedUrl = app.applyProtocol(url);

        window.open(replacedUrl, "_blank")?.close();
    } catch (e) {
        console.error("[open-in-app] Error opening in App", e);
    }
}

// for non direct links like modal buttons
function patchWindowOpen() {
    scoped.patcher.instead("open", window, (args, orig) => {
        const [url] = args;
        if (!getEnabledApp(url)) return orig(...args);
        openInApp(url);
    });
}

async function patchVirtualClick() {
    scoped.patcher.instead(
        "click",
        HTMLAnchorElement.prototype,
        function (args, orig) {
            const { href } = this;
            if (!getEnabledApp(href)) return orig(...args);

            openInApp(url);
        }
    );
}

async function onClick(e) {
    // most times the click target is a child of the actual anchor
    // so find the closest anchor element
    const anchor = e?.target?.closest("a");
    if (!anchor?.href || !getEnabledApp(anchor.href)) return;
    const playOnSpotifyButton = e?.target?.closest(".ioj4-pos-buttons");
    if (playOnSpotifyButton) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    openInApp(anchor.href);
}

const appMount = document.querySelector("#app-mount");

export function onLoad() {
    Object.entries(apps).forEach(([appName, app]) => {
        store[appName] ??= app.default;
    });

    patchWindowOpen();
    patchVirtualClick();
    appMount.addEventListener("click", onClick);
}

export function onUnload() {
    appMount.removeEventListener("click", onClick);
}

export { settings } from "./settings";
