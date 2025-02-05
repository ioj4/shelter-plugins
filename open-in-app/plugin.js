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
//#region plugins/open-in-app/settings.jsx
var import_web = __toESM(require_web(), 1);
const { plugin: { store: store$1 }, ui: { SwitchItem } } = shelter;
const settings = () => {
	const rows = [];
	for (const [appName, app] of Object.entries(apps)) rows.push((0, import_web.createComponent)(SwitchItem, {
		get value() {
			return store$1[appName];
		},
		onChange: (value) => {
			store$1[appName] = value;
		},
		get note() {
			return app.protocol;
		},
		children: appName
	}));
	return rows;
};

//#endregion
//#region plugins/open-in-app/index.js
const { plugin: { store, scoped } } = shelter;
const apps = {
	Spotify: {
		hostnames: ["open.spotify.com", "spotify.link"],
		protocol: "spotify://",
		default: true
	},
	Steam: {
		hostnames: [
			"store.steampowered.com",
			"steamcommunity.com",
			"help.steampowered.com"
		],
		protocol: "steam://openurl/",
		default: true
	},
	SoundCloud: {
		hostnames: ["soundcloud.com", "on.soundcloud.com"],
		protocol: "soundpout://",
		default: false
	}
};
function getEnabledApp(url$1) {
	if (!/https?:\/\//.test(url$1.toString())) return;
	const { hostname } = new URL(url$1);
	return Object.entries(apps).find(([appName, app]) => app.hostnames.includes(hostname) && store[appName]);
}
async function unshortenLink(url$1) {
	const re = /<meta property="og:url" content="(.+?)"/;
	const body = await (await fetch(`https://shcors.uwu.network/${url$1}`)).text();
	return re.exec(body)?.[1];
}
async function openInApp(url$1) {
	try {
		url$1 = new URL(url$1);
		if (["spotify.link", "on.soundcloud.com"].includes(url$1.hostname)) url$1 = new URL(await unshortenLink(url$1));
		if (url$1.hostname === "open.spotify.com") url$1.pathname = url$1.pathname.replace(/\/intl-.+?(\/.+)/i, "$1");
		const [appName, app] = getEnabledApp(url$1);
		const replacedUrl = app.protocol + url$1;
		window.open(replacedUrl, "_blank")?.close();
	} catch (e) {
		console.error("[open-in-app] Error opening in App", e);
	}
}
function patchWindowOpen() {
	scoped.patcher.instead("open", window, (args, orig) => {
		const [url$1] = args;
		if (!getEnabledApp(url$1)) return orig(...args);
		openInApp(url$1);
	});
}
async function patchVirtualClick() {
	scoped.patcher.instead("click", HTMLAnchorElement.prototype, function(args, orig) {
		const { href } = this;
		if (!getEnabledApp(href)) return orig(...args);
		openInApp(url);
	});
}
async function onClick(e) {
	const anchor = e?.target?.closest("a");
	if (!anchor?.href || !getEnabledApp(anchor.href)) return;
	e.preventDefault();
	e.stopImmediatePropagation();
	openInApp(anchor.href);
}
const appMount = document.querySelector("#app-mount");
function onLoad() {
	Object.entries(apps).forEach(([appName, app]) => {
		store[appName] ??= app.default;
	});
	patchWindowOpen();
	patchVirtualClick();
	appMount.addEventListener("click", onClick);
}
function onUnload() {
	appMount.removeEventListener("click", onClick);
}

//#endregion
exports.apps = apps
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({});