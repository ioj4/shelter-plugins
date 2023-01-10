// Credits to https://overimagine1.github.io/old-discord-font for the CSS
const styleElement = document.createElement("style");
styleElement.innerHTML = "@import url(https://cdn.jsdelivr.net/gh/Overimagine1/old-discord-font/source.min.css);";

export function onLoad() {
    document.head.appendChild(styleElement);
}

export function onUnload() {
    document.head.removeChild(styleElement);
}
