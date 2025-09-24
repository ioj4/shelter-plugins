const {
    plugin: { store, scoped },
    solidWeb: { render }
} = shelter;

import ControlButtons from "./components/control-buttons";
import * as icons from "./components/icons";
import * as spotify from "./spotify";

import classes from "./styles.jsx.scss";

const ANCHOR_QUERY = `a[href^="https://open.spotify.com/"]:not([data-ioj4_pos])`;
const PATCHED_ANCHOR_QUERY = `a[href^="https://open.spotify.com/"][data-ioj4_pos]`;

export const BUTTONS = [
    {
        storeKey: "showOpen",
        settingsDescription: "Show open in Spotify button",
        tooltip: "Open in Spotify",
        icon: icons.Open,
        action: spotify.open
    },
    {
        storeKey: "showQueue",
        settingsDescription: "Show queue button",
        tooltip: "Add to queue",
        icon: icons.Queue,
        action: spotify.queue,
        allowedTypes: ["track", "episode"]
    },
    {
        storeKey: "showPlay",
        settingsDescription: "Show play button",
        tooltip: "Play in Spotify",
        icon: icons.Play,
        action: spotify.play,
        allowedTypes: ["track", "playlist", "album", "artist"]
    }
];

function blockAnchorClick(e) {
    if (e.target.closest(`.${classes.container}`)) {
        e.preventDefault();
    }
}

function patchAnchor(anchor) {
    if (anchor.dataset.ioj4_pos) return;
    anchor.dataset.ioj4_pos = true;

    const parsedURL = spotify.extractTypeAndId(anchor.href);

    anchor.addEventListener("click", blockAnchorClick);

    // Fix styling for Spotify Connection in User Profile
    anchor.style.display = "inline-flex";
    anchor.style.flexDirection = "row";

    const item = {
        url: anchor.href,
        type: parsedURL?.[0]?.toLowerCase(),
        id: parsedURL?.[1]
    };
    render(() => <ControlButtons item={item} />, anchor);
}

function startObservingDom() {
    scoped.observeDom(ANCHOR_QUERY, (anchor) => {
        patchAnchor(anchor);
    });
}

export function onLoad() {
    BUTTONS.forEach((b) => (store[b.storeKey] ??= true));
    document.querySelectorAll(ANCHOR_QUERY).forEach(patchAnchor);
    startObservingDom();
}

export function onUnload() {
    document.querySelectorAll(PATCHED_ANCHOR_QUERY).forEach((anchor) => {
        anchor.querySelector(`.${classes.container}`)?.remove();
        anchor.removeEventListener("click", blockAnchorClick);
        delete anchor.dataset.ioj4_pos;
    });
}

export { default as settings } from "./settings";
