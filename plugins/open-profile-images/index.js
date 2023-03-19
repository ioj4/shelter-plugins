const {
	flux: { dispatcher }
} = shelter;


function injectAvatar() {
    document.querySelectorAll(`[class*="userProfileModalInner-"]`).forEach(el => {
        const avatarWrapper = el.querySelector(`div[class*="wrapper-"][class*="avatar"]`);
        avatarWrapper.addEventListener("click", (e) => openImage(e.target.querySelector(`img[class*="avatar"]`).src));
        avatarWrapper.style.cursor = "pointer";
    });
}

function injectBanner() {
    document.querySelectorAll(`[class*="BannerPremium-"]`).forEach(el => {
        el.addEventListener("click", ({ target: el}) => {
            openImage(el?.style?.backgroundImage?.slice(5, -2));
        });
        el.style.cursor = "pointer";
    });
}

function openImage(urlString) {
    if (!urlString) return;
    const url = new URL(urlString);
    url.search = "?size=4096";
    open(url);
}

function onTrack(e) {
    if (e.event === "open_popout") {
        injectBanner();
    }
    else if (e.event === "open_modal") {
        injectBanner();
        injectAvatar();
    }
}

export function onLoad() {
    dispatcher.subscribe("TRACK", onTrack);
}

export function onUnload() {
    dispatcher.unsubscribe("TRACK", onTrack);
}
