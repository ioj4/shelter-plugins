const {
	flux: { dispatcher },
    observeDom
} = shelter;

function addClickEvent(userComponent) {
    const banner = userComponent.querySelector(`[class*="BannerPremium-"]`);
    if (banner) {
        banner.addEventListener("click", e => openImage(e?.target?.style?.backgroundImage?.slice(5, -2)));
        banner.style.cursor = "pointer";
    }

    const avatar = userComponent.querySelector(`div[class*="wrapper-"][class*="avatar"]`);
    if (avatar) {
        avatar.addEventListener("click", e => openImage(e?.target?.querySelector(`img[class*="avatar"]`)?.src));
        avatar.style.cursor = "pointer";
    }
}

function openImage(urlString) {
    if (!urlString) return;
    const url = new URL(urlString);
    // get the highest image resolution
    url.search = "?size=4096";
    open(url);
}

const USER_COMPONENT_QUERY = `[class*="userProfileModalInner"],[class*="userPopoutInner"]`;

function onTrack(e) {
    if (e.event === "open_popout" || e.event === "open_modal") {
        // wait for the component to be loaded
        const unObserve = observeDom(USER_COMPONENT_QUERY, userComponent => {
            unObserve();
            queueMicrotask(addClickEvent.bind(null, userComponent));
        });
        setTimeout(unObserve, 500);
    }
}

export function onLoad() {
    dispatcher.subscribe("TRACK", onTrack);
}

export function onUnload() {
    dispatcher.unsubscribe("TRACK", onTrack);
}
