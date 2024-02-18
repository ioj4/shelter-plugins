const {
    plugin: { store },
    flux: { dispatcher, awaitStore },
    observeDom
} = shelter;

import ControlButtons from "./components/control-buttons";
import classes from "./styles.jsx.scss";

const ANCHOR_QUERY = `a:is([href^="https://open.spotify.com/"], [href^="https://spotify.link/"]):not([data-ioj4_pos])`;

function patchAnchor(anchor) {
    if (anchor.dataset.ioj4_pos) return;
    const parent = anchor.parentElement;
    const wrapper = document.createElement("div");
    wrapper.classList.add(classes.wrapper);

    parent.replaceChild(wrapper, anchor);
    wrapper.appendChild(anchor);

    anchor.dataset.ioj4_pos = true;

    shelter.solidWeb.render(
        () => <ControlButtons url={anchor.href} />,
        wrapper
    );
}

function observeMessages() {
    const unObserve = observeDom(ANCHOR_QUERY, (anchor) => {
        queueMicrotask(() => patchAnchor(anchor));
        unObserve();
    });

    setTimeout(unObserve, 500);
}

async function onMessage({ channel_id }) {
    const selectedChannelStore = await awaitStore("SelectedChannelStore");
    if (channel_id === selectedChannelStore.getCurrentlySelectedChannelId()) {
        observeMessages();
    }
}

function unpatchAll() {
    document.querySelectorAll(`div.${classes.wrapper}`).forEach((el) => {
        const anchor = el.querySelector("a");
        el.replaceChildren();
        el.replaceWith(anchor);
    });
}

// UPDATE_CHANNEL_DIMENSIONS: new message or scrolling up/down
const MESSAGE_TRIGGERS = ["MESSAGE_CREATE", "MESSAGE_UPDATE"];
const TRIGGERS = [
    "CHANNEL_SELECT",
    "UPDATE_CHANNEL_DIMENSIONS",
    "SEARCH_FINISH"
];

export function onLoad() {
    store.showOpen ??= true;
    store.showQueue ??= true;
    store.showPlay ??= true;

    TRIGGERS.forEach((t) => dispatcher.subscribe(t, observeMessages));
    MESSAGE_TRIGGERS.forEach((t) => dispatcher.subscribe(t, onMessage));
}

export function onUnload() {
    TRIGGERS.forEach((t) => dispatcher.unsubscribe(t, observeMessages));
    MESSAGE_TRIGGERS.forEach((t) => dispatcher.unsubscribe(t, onMessage));
}
