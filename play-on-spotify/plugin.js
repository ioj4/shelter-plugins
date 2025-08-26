(function(exports) {

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion

//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region plugins/play-on-spotify/styles.jsx.scss
shelter.plugin.scoped.ui.injectCss(`.AWnvzW_container {
  vertical-align: bottom;
  background-color: var(--background-surface-higher, #28282d);
  border-radius: var(--radius-sm, 8px);
  gap: 4px;
  margin: 0 .5rem 0 .25rem;
  padding: 4px;
  display: inline-flex;
}

.AWnvzW_container > button {
  height: 16px;
  color: var(--interactive-normal, #aaaab1);
  background-color: #0000;
  padding: 0;
  transition: color .2s;
}

.AWnvzW_container > button:hover {
  color: var(--interactive-hover, #fbfbfb);
}

.AWnvzW_container:empty {
  display: none;
}
`);
var styles_jsx_default = { "container": "AWnvzW_container" };

//#endregion
//#region plugins/play-on-spotify/components/control-buttons.jsx
var import_web$4 = __toESM(require_web(), 1);
var import_web$5 = __toESM(require_web(), 1);
var import_web$6 = __toESM(require_web(), 1);
var import_web$7 = __toESM(require_web(), 1);
var import_web$8 = __toESM(require_web(), 1);
var import_web$9 = __toESM(require_web(), 1);
var import_web$10 = __toESM(require_web(), 1);
var import_web$11 = __toESM(require_web(), 1);
var import_web$12 = __toESM(require_web(), 1);
const _tmpl$$1 = /*#__PURE__*/ (0, import_web$4.template)(`<button></button>`, 2), _tmpl$2$1 = /*#__PURE__*/ (0, import_web$4.template)(`<div></div>`, 2);
const { plugin: { store: store$2 }, ui: { tooltip, showToast, ToastColors }, solid: { Show }, util: { log } } = shelter;
function control_buttons_default({ item }) {
	const rows = [];
	for (const button of BUTTONS) rows.push((0, import_web$10.createComponent)(Show, {
		get when() {
			return (0, import_web$12.memo)(() => !!store$2[button.storeKey])() && (!button.allowedTypes || button.allowedTypes.includes(item.type));
		},
		get children() {
			const _el$ = (0, import_web$7.getNextElement)(_tmpl$$1);
			_el$.$$click = (e) => {
				const el = e.currentTarget;
				el.style.color = "var(--interactive-active, #fbfbfb)";
				button.action(item).then(() => {
					el.style.color = "#1bc357";
					setTimeout(() => el.style.color = "", 800);
				}, (err) => {
					el.style.color = "#da3e44";
					setTimeout(() => el.style.color = "", 800);
					log(`[play-on-spotify] ${err.message}`, "error");
					showToast({
						title: "Couldn't perform action",
						content: err.message,
						duration: 8e3,
						class: ToastColors.CRITICAL
					});
				});
			};
			(0, import_web$11.use)(tooltip, _el$, () => button.tooltip);
			(0, import_web$9.insert)(_el$, (0, import_web$10.createComponent)(button.icon, {}));
			(0, import_web$8.runHydrationEvents)();
			return _el$;
		}
	}));
	return (() => {
		const _el$2 = (0, import_web$7.getNextElement)(_tmpl$2$1);
		(0, import_web$9.insert)(_el$2, rows);
		(0, import_web$6.effect)(() => _el$2.className = `ioj4-pos-buttons ${styles_jsx_default.container}`);
		return _el$2;
	})();
}
(0, import_web$5.delegateEvents)(["click"]);

//#endregion
//#region plugins/play-on-spotify/components/icons.jsx
var import_web$2 = __toESM(require_web(), 1);
var import_web$3 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web$2.template)(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.6438 2.15465C11.4612 2.19322 11.2874 2.28356 11.1453 2.42565L7.59106 5.97985C7.4563 6.36608 7.54272 6.81285 7.85181 7.12194C8.17065 7.44078 8.63647 7.52281 9.03101 7.36803L10.8528 5.54674V13.0223C10.8528 13.5746 11.3 14.0223 11.8528 14.0223C12.405 14.0223 12.8528 13.5746 12.8528 13.0223V5.54674L14.6746 7.36901C15.0691 7.52281 15.5344 7.44078 15.8528 7.12194C16.1624 6.81285 16.2488 6.36559 16.113 5.97887L12.5598 2.42565C12.3113 2.17711 11.9641 2.08678 11.6438 2.15465Z" fill="currentColor"></path><path d="M4.18774 8.0775C3.6355 8.0775 3.18774 8.52526 3.18774 9.0775V20.8671C3.18774 21.4193 3.6355 21.8671 4.18774 21.8671H19.8123C20.3645 21.8671 20.8123 21.4193 20.8123 20.8671V9.0775C20.8123 8.52526 20.3645 8.0775 19.8123 8.0775H16.8743V10.0775H18.8123V19.8671H5.18774V10.0775H6.83032V8.0775H4.18774Z" fill="currentColor"></path></svg>`, 6), _tmpl$2 = /*#__PURE__*/ (0, import_web$2.template)(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.02637 1.04321H6.02637V4.04321H9.02637V6.04321H6.02637V9.04321H4.02637V6.04321H1.02637V4.04321H4.02637V1.04321Z" fill="currentColor"></path><path d="M12.0776 5.53198C12.0493 5.76099 12.0103 5.98657 11.9604 6.20825H19.1411C19.7939 6.20825 20.3237 6.73804 20.3237 7.39087C20.3237 8.0437 19.7939 8.57349 19.1411 8.57349H10.9424C10.48 9.26099 9.89844 9.86206 9.22754 10.3474C8.92041 10.5696 8.59473 10.7673 8.25293 10.9382H19.4263C21.3853 10.9382 22.9736 9.34985 22.9736 7.39087C22.9736 5.43188 21.3853 3.84351 19.4263 3.84351H12.0815C12.1133 4.11499 12.1299 4.39136 12.1299 4.67163C12.1299 4.96265 12.1123 5.24976 12.0776 5.53198Z" fill="currentColor"></path><path d="M22.0928 14.8972H4.05469V17.262H22.0928V14.8972Z" fill="currentColor"></path><path d="M4.05469 20.592H22.0928V22.9568H4.05469V20.592Z" fill="currentColor"></path></svg>`, 10), _tmpl$3 = /*#__PURE__*/ (0, import_web$2.template)(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM9.04596 8.19684V15.8123C9.04596 16.1973 9.4628 16.4378 9.79614 16.2452L16.3167 12.477C16.6481 12.2855 16.6502 11.8079 16.3206 11.6134L9.80004 7.76621C9.46673 7.56955 9.04596 7.80984 9.04596 8.19684Z" fill="currentColor"></path></svg>`, 4);
const Open = () => (0, import_web$3.getNextElement)(_tmpl$);
const Queue = () => (0, import_web$3.getNextElement)(_tmpl$2);
const Play = () => (0, import_web$3.getNextElement)(_tmpl$3);

//#endregion
//#region plugins/play-on-spotify/spotify.js
const { flux: { stores: { SpotifyStore } }, util: { awaitDispatch } } = shelter;
const URL_REGEX = /^https:\/\/open\.spotify\.com\/(?:[a-z\-]+\/)?(track|album|playlist|episode|show|artist|user)(?:\/)([a-z0-9]+).*$/i;
function getDeviceAndSocket() {
	if (!SpotifyStore.hasConnectedAccount()) throw new Error("No account found. Have you connected your Spotify account yet?");
	const deviceAndSocket = SpotifyStore.getActiveSocketAndDevice();
	if (!deviceAndSocket) throw new Error("No device found. Start Spotify and try again..");
	return deviceAndSocket;
}
async function refreshAccessToken() {
	getDeviceAndSocket().socket.handleDeviceStateChange();
	return Promise.race([awaitDispatch("SPOTIFY_SET_DEVICES"), new Promise((_, reject) => setTimeout(() => reject(new Error("Couldn't refresh Access Token!")), 3e3))]);
}
async function spotifyRequest(method, path, searchParams, body, isRetry = false) {
	return new Promise((resolve, reject) => {
		const { device, socket } = getDeviceAndSocket();
		const token = socket.accessToken;
		const url = new URL(`https://api.spotify.com/v1/me/player/${path}`);
		url.search = new URLSearchParams({
			device_id: device.id,
			...searchParams
		});
		const options = {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(body)
		};
		fetch(url, options).then(async (res) => {
			if (res.ok) return resolve();
			if (res.status === 401 && !isRetry) {
				refreshAccessToken().then(() => spotifyRequest(...arguments, true)).then(resolve, reject);
				return;
			}
			reject(new Error(`Spotify API request failed with ${res.status}!`));
		});
	});
}
function extractTypeAndId(url) {
	const match = URL_REGEX.exec(url);
	if (!match) return;
	return match.slice(1);
}
async function open({ url: urlString }) {
	const url = new URL(urlString);
	url.searchParams.delete("si");
	window.open("spotify:/" + url.pathname + url.search);
}
async function play({ type, id }) {
	const body = type === "track" ? { uris: [`spotify:${type}:${id}`] } : { context_uri: `spotify:${type}:${id}` };
	body.position_ms = 0;
	return spotifyRequest("PUT", "play", {}, body);
}
async function queue({ type, id }) {
	return spotifyRequest("POST", "queue", { uri: `spotify:${type}:${id}` });
}

//#endregion
//#region plugins/play-on-spotify/settings.jsx
var import_web$1 = __toESM(require_web(), 1);
const { plugin: { store: store$1 }, ui: { SwitchItem } } = shelter;
var settings_default = () => {
	const rows = [];
	for (const button of BUTTONS) rows.push((0, import_web$1.createComponent)(SwitchItem, {
		get value() {
			return store$1[button.storeKey];
		},
		onChange: (value) => {
			store$1[button.storeKey] = value;
		},
		get children() {
			return button.settingsDescription;
		}
	}));
	return rows;
};

//#endregion
//#region plugins/play-on-spotify/index.jsx
var import_web = __toESM(require_web(), 1);
const { plugin: { store, scoped }, solidWeb: { render } } = shelter;
const ANCHOR_QUERY = `a[href^="https://open.spotify.com/"]:not([data-ioj4_pos])`;
const PATCHED_ANCHOR_QUERY = `a[href^="https://open.spotify.com/"][data-ioj4_pos]`;
const BUTTONS = [
	{
		storeKey: "showOpen",
		settingsDescription: "Show open in Spotify button",
		tooltip: "Open in Spotify",
		icon: Open,
		action: open
	},
	{
		storeKey: "showQueue",
		settingsDescription: "Show queue button",
		tooltip: "Add to queue",
		icon: Queue,
		action: queue,
		allowedTypes: ["track", "episode"]
	},
	{
		storeKey: "showPlay",
		settingsDescription: "Show play button",
		tooltip: "Play in Spotify",
		icon: Play,
		action: play,
		allowedTypes: [
			"track",
			"playlist",
			"album",
			"artist"
		]
	}
];
function blockAnchorClick(e) {
	if (e.target.closest(`.${styles_jsx_default.container}`)) e.preventDefault();
}
function patchAnchor(anchor) {
	if (anchor.dataset.ioj4_pos) return;
	anchor.dataset.ioj4_pos = true;
	const parsedURL = extractTypeAndId(anchor.href);
	anchor.addEventListener("click", blockAnchorClick);
	const item = {
		url: anchor.href,
		type: parsedURL?.[0]?.toLowerCase(),
		id: parsedURL?.[1]
	};
	render(() => (0, import_web.createComponent)(control_buttons_default, { item }), anchor);
}
function startObservingDom() {
	scoped.observeDom(ANCHOR_QUERY, (anchor) => {
		patchAnchor(anchor);
	});
}
function onLoad() {
	BUTTONS.forEach((b) => store[b.storeKey] ??= true);
	document.querySelectorAll(ANCHOR_QUERY).forEach(patchAnchor);
	startObservingDom();
}
function onUnload() {
	document.querySelectorAll(PATCHED_ANCHOR_QUERY).forEach((anchor) => {
		anchor.querySelector(`.${styles_jsx_default.container}`)?.remove();
		anchor.removeEventListener("click", blockAnchorClick);
		delete anchor.dataset.ioj4_pos;
	});
}

//#endregion
exports.BUTTONS = BUTTONS
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings_default
return exports;
})({});