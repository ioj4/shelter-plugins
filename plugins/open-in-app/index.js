const {
    plugin: { store },
    patcher: { before }
} = shelter;

export const apps = {
    Spotify: {
        hostnames: ["open.spotify.com", "spotify.link"],
        protocol: "spotify:"
    },
    Steam: {
        hostnames: [
            "store.steampowered.com",
            "steamcommunity.com",
            "help.steampowered.com"
        ],
        protocol: "steam://openurl/"
    }
};

async function unshortenSpotifyURL(url) {
    const re = /<meta property="og:url" content="(.+?)"\/>/;
    const body = await (
        await fetch(`https://shcors.uwu.network/${url}`)
    ).text();
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
    return url.toString();
}

// for non direct links like modal buttons
let unpatchWindow;
function patchWindowOpen() {
    unpatchWindow = before("open", window, async ([urlString]) => {
        return [await replaceURL(urlString)];
    });
}

async function patchOnClick(e) {
    try {
        const urlString = e.target.parentElement.href ?? e.target.href;
        if (!urlString) return;

        const url = new URL(urlString);
        const isApp = Object.values(apps).find((a) =>
            a.hostnames.includes(url.hostname)
        );
        if (!isApp) return;

        e.preventDefault();
        e.stopImmediatePropagation();
        window.open(await replaceURL(url));
    } catch (e) {
        console.error(e);
    }
}

export function onLoad() {
    patchWindowOpen();
    document.addEventListener("click", patchOnClick);

    store.enabledApps ??= {};
    Object.keys(apps).forEach((app) => {
        store.enabledApps[app] ??= true;
    });
}

export function onUnload() {
    unpatchWindow?.();
    document.removeEventListener("click", patchOnClick);
}

export { settings } from "./settings";
