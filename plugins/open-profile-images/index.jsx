const {
    plugin: { store },
    flux: { dispatcher, intercept },
    ui: { openModal, injectCss },
    observeDom
} = shelter;

import { css } from "./components/image-modal.jsx.scss";
import ImageModal from "./components/image-modal";

function addClickEvent(userComponent) {
    const banner = userComponent.querySelector(`div[class*="bannerPremium_"]`);
    if (banner) {
        banner.addEventListener("click", (e) =>
            openImage(e?.target?.style?.backgroundImage?.slice(5, -2))
        );
        banner.style.cursor = "pointer";
    }

    userComponent
        .querySelectorAll(`div[class*="wrapper_"]`)
        .forEach((avatar) => {
            // skip clickable element that opens the profile-modal (this is horrible)
            avatarWrapper = avatar.parentElement.parentElement;
            if (
                avatarWrapper.className.includes("clickable_") &&
                avatarWrapper.onclick
            )
                return;

            avatar.addEventListener("click", (e) =>
                openImage(e?.target?.querySelector(`img[class*="avatar"]`)?.src)
            );
            avatar.style.cursor = "pointer";
        });
}

function openImage(urlString) {
    if (!urlString) return;
    openModal(() => <ImageModal url={new URL(urlString)} />);
}

const USER_COMPONENT_QUERY = `[class*="userProfileModalInner"],[class*="userPopoutInner"]`;

function observeComponents() {
    // wait for the component to be loaded
    const unObserve = observeDom(USER_COMPONENT_QUERY, (userComponent) => {
        unObserve();
        queueMicrotask(addClickEvent.bind(null, userComponent));
    });
    setTimeout(unObserve, 1_000);
}

function onTrack(e) {
    if (e.event === "open_popout" || e.event === "open_modal") {
        observeComponents();
    }
}

let uninject;
let unintercept;

export function onLoad() {
    uninject = injectCss(css);
    // prevent discord's context-menu from opening for the image
    // using it is not possible as it's in a layer behind the modal
    unintercept = intercept((dispatch) => {
        if (
            dispatch?.type === "CONTEXT_MENU_OPEN" &&
            dispatch?.contextMenu?.target?.hasAttribute("ioj4-opi")
        ) {
            return false;
        }
    });
    store.fullResolution ??= false;
    dispatcher.subscribe("TRACK", onTrack);
    // for webhook userpopouts (they always fail)
    dispatcher.subscribe("USER_PROFILE_FETCH_FAILURE", observeComponents);
}

export function onUnload() {
    dispatcher.unsubscribe("TRACK", onTrack);
    dispatcher.unsubscribe("USER_PROFILE_FETCH_FAILURE", observeComponents);
    uninject();
    unintercept();
}

export { default as settings } from "./components/settings";
