const {
    plugin: { store },
    flux: {
        dispatcher,
        stores: { SelectedChannelStore }
    },
    ui: { injectCss },
    observeDom
} = shelter;

import ControlButtons from "./components/control-buttons";
import { classes, css } from "./styles.jsx.scss";

const LINK_QUERY = `main[class^="chatContent"] a[href^="https://open.spotify.com"], main[class^="chatContent"] a[href^="https://spotify.link/"]`;
const LINK_REGEX =
    /(?:https?:\/\/open.spotify.com\/)(track|album|playlist)(?:\/)([a-z0-9]*)/i;

function addButtons() {
    const links = document.querySelectorAll(LINK_QUERY);
    links.forEach((link) => {
        if (link?.dataset?.ioj4_pos) return;
        const matches = link.href.match(LINK_REGEX) ?? [];
        if (matches.length < 3) return;
        const [, type, id] = matches;

        const parent = link.parentNode;
        const wrapper = document.createElement("div");
        wrapper.classList.add(classes.wrapper);

        parent.replaceChild(wrapper, link);
        wrapper.appendChild(link);

        link.dataset.ioj4_pos = true;

        shelter.solidWeb.render(
            () => <ControlButtons type={type} id={id} />,
            wrapper
        );
    });
}

function observeMessages() {
    const unObserve = observeDom(LINK_QUERY, () => {
        unObserve();
        queueMicrotask(addButtons);
    });

    setTimeout(unObserve, 500);
}

function onMessage(e) {
    if (
        e.message.channel_id !==
        SelectedChannelStore.getCurrentlySelectedChannelId()
    )
        return;
    observeMessages();
}

// MESSAGE_CREATE: a new message is sent (any channel)
// MESSAGE_CREATE: a message was updated (any channel)
// CHANNEL_SELECT: the user switches servers or channels
// UPDATE_CHANNEL_DIMENSIONS: new message or scrolling up/down
const MESSAGE_TRIGGERS = ["MESSAGE_CREATE", "MESSAGE_UPDATE"];
const TRIGGERS = ["CHANNEL_SELECT", "UPDATE_CHANNEL_DIMENSIONS"];

let uninjectCss;

export function onLoad() {
    store.showOpen ??= true;
    store.showQueue ??= true;
    store.showPlay ??= true;

    uninjectCss = injectCss(css);
    TRIGGERS.forEach((t) => dispatcher.subscribe(t, observeMessages));
    MESSAGE_TRIGGERS.forEach((t) => dispatcher.subscribe(t, onMessage));
}

export function onUnload() {
    uninjectCss();
    TRIGGERS.forEach((t) => dispatcher.unsubscribe(t, observeMessages));
    MESSAGE_TRIGGERS.forEach((t) => dispatcher.unsubscribe(t, onMessage));
}
