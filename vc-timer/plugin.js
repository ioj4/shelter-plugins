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
//#region plugins/vc-timer/components/timer.jsx
var import_web$2 = __toESM(require_web(), 1);
var import_web$3 = __toESM(require_web(), 1);
var import_web$4 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web$2.template)(`<p></p>`, 2);
const { solid: { createSignal, onCleanup }, plugin: { store: store$2 } } = shelter;
function toTimeString(secs) {
	const h = Math.floor(secs / 3600);
	const m = Math.floor(secs / 60) - h * 60;
	const s = Math.floor(secs - h * 3600 - m * 60);
	return (h ? h.toString() + ":" : "") + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
}
var timer_default = () => {
	const getDuration = () => (Date.now() - store$2.joinTime) / 1e3;
	const [time, setTime] = createSignal(toTimeString(getDuration()));
	const timer = setInterval(() => setTime(toTimeString(getDuration())), 1e3);
	onCleanup(() => {
		clearInterval(timer);
		insertTimer();
	});
	return (() => {
		const _el$ = (0, import_web$3.getNextElement)(_tmpl$);
		_el$.style.setProperty("display", "inline");
		_el$.style.setProperty("font-family", "monospace");
		(0, import_web$4.insert)(_el$, () => time() + " • ");
		return _el$;
	})();
};

//#endregion
//#region plugins/vc-timer/settings.jsx
var import_web$1 = __toESM(require_web(), 1);
const { plugin: { store: store$1 }, ui: { SwitchItem } } = shelter;
const settings = () => (0, import_web$1.createComponent)(SwitchItem, {
	get value() {
		return store$1.persistTime;
	},
	onChange: (v) => store$1.persistTime = v,
	note: "Time resets after 10 seconds of not being in a voice channel",
	children: "Persist time across channel moves"
});

//#endregion
//#region plugins/vc-timer/index.jsx
var import_web = __toESM(require_web(), 1);
const { flux: { awaitStore }, ui: { ReactiveRoot }, plugin: { scoped, store } } = shelter;
const SUBTEXT_QUERY = `div[class^="rtcConnectionStatus"] a div[class^="lineClamp"]:not(:has(.ioj4-vct))`;
let insertLock = false;
async function insertTimer() {
	if (insertLock || !store.isInVC) return;
	insertLock = true;
	const subtext = document.querySelector(SUBTEXT_QUERY) ?? await new Promise((res) => {
		const unobserve = scoped.observeDom(SUBTEXT_QUERY, res);
		setTimeout(() => {
			unobserve();
			res();
		}, 2e3);
	});
	if (!subtext) {
		insertLock = false;
		return;
	}
	const timer = (0, import_web.createComponent)(ReactiveRoot, { get children() {
		return (0, import_web.createComponent)(timer_default, {});
	} });
	timer.className = "ioj4-vct";
	subtext.prepend(timer);
	insertLock = false;
}
let lastLeave = 0;
function initializeTimer() {
	if (!store.isInVC) {
		store.isInVC = true;
		if (!store.persistTime || lastLeave < Date.now() - 1e4) store.joinTime = Date.now();
	}
	insertTimer();
}
function onTrack(e) {
	if (e.event === "join_voice_channel") initializeTimer();
else if (e.event === "leave_voice_channel") {
		store.isInVC = false;
		lastLeave = Date.now();
	}
}
function onLogout() {
	store.isInVC = false;
}
async function onLoad() {
	const vcStore = await awaitStore("VoiceStateStore");
	if (vcStore.isCurrentClientInVoiceChannel()) initializeTimer();
	scoped.flux.subscribe("TRACK", onTrack);
	scoped.flux.subscribe("LOGOUT", onLogout);
}
function onUnload() {
	store.isInVC = false;
	document.querySelectorAll(`.ioj4-vct`).forEach((e) => e.remove());
}

//#endregion
exports.insertTimer = insertTimer
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({});