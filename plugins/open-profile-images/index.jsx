import ImageModal from "./components/image-modal";
import classes from "./styles.jsx.scss";

const {
    ui: { openModal },
    plugin: { scoped }
} = shelter;

function onClick(e) {
    const src =
        e.target?.querySelector(`img[class*="avatar"]`)?.src ??
        e.target?.style?.backgroundImage?.slice(5, -2); // for banners, the slice removes the "url()" part
    if (!src) return;
    openModal(() => <ImageModal url={new URL(src)} />);
    e.stopImmediatePropagation();
}

// this is fine 🔥
// it really is, i tested perf 🪄
const subSelectors = [
    // pfp in member list
    `[class*="memberInner"] [class*="avatar"] [class*="wrapper"]`,
    // pfp in popout of webhooks
    `[class*="avatarWrapperNonUserBot"]`,
    // pfp in profile modal
    `[class*="headerInner"] [class*="avatar"]:not([class*="clickable"]) [class*="wrapper"]`,
    // pfp in topbar in DMs, friends list, add to DM popover and own pfp in bottom left
    `[class*="wrapper"][class*="avatar"]`,
    // banner in profile modal
    `[class*="bannerPremium"]:not([class*="settingsBanner"])`
];

export function onLoad() {
    scoped.observeDom(
        `:is(${subSelectors.join(",")}):not(.${classes.ioj4Opi})`,
        (el) => {
            el.classList.add(classes.ioj4Opi);
            el.addEventListener("click", onClick);
        }
    );
}

export function onUnload() {
    document.querySelectorAll(`.${classes.ioj4Opi}`).forEach((el) => {
        el.removeEventListener("click", onClick);
        el.classList.remove(classes.ioj4Opi);
    });
}
