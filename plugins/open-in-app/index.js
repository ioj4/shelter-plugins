const {
    plugin: { store }
} = shelter;

export const apps = [
    {
        name: "Spotify",
        hostnames: ["open.spotify.com"],
        protocol: "spotify:"
    },
    {
        name: "Steam",
        hostnames: [
            "store.steampowered.com",
            "steamcommunity.com",
            "help.steampowered.com"
        ],
        protocol: "steam://openurl/"
    }
];

function onClickHandler({ target }) {
    if (target.tagName !== "A") return;

    const originalUrl = new URL(target.getAttribute("href"));
    for (const app of apps) {
        if (!store.enabledApps[app.name]) continue;
        if (!app.hostnames.includes(originalUrl.hostname)) continue;
        target.setAttribute("href", app.protocol + originalUrl);

        // change it back afterwards
        setTimeout(() => {
            target.setAttribute("href", originalUrl.toString());
        });
        return;
    }
}

export function onLoad() {
    store.enabledApps ??= {};
    apps.forEach((app) => {
        store.enabledApps[app.name] ??= true;
    });
    document.addEventListener("click", onClickHandler);
}

export function onUnload() {
    document.removeEventListener("click", onClickHandler);
}

export { settings } from "./settings";
