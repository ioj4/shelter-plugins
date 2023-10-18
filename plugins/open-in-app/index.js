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
    let anchorEl = e.target;
    try {
        // most click targets are nested span elements so find the closest non-span element and check if it's an anchor
        if (anchorEl.tagName !== "A") {
            anchorEl = anchorEl?.closest(`:not(${anchorEl.tagName})`);
            if (anchorEl.tagName !== "A") return;
        }

        const urlString = anchorEl?.href;
        if (!urlString) return;

        const url = new URL(urlString);
        const isApp = Object.values(apps).find((a) =>
            a.hostnames.includes(url.hostname)
        );
        if (!isApp) return;

        e.preventDefault();
        e.stopImmediatePropagation();
        window.open(await replaceURL(url));
    } catch (e) {}
}

const appMount = document.querySelector("#app-mount");

export function onLoad() {
    patchWindowOpen();
    appMount.addEventListener("click", patchOnClick);

    store.enabledApps ??= {};
    Object.keys(apps).forEach((app) => {
        store.enabledApps[app] ??= true;
    });
}

export function onUnload() {
    unpatchWindow?.();
    appMount.removeEventListener("click", patchOnClick);
}

export { settings } from "./settings";
