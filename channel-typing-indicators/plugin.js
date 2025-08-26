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
//#region plugins/channel-typing-indicators/components/typing-indicator.jsx
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web$1.template)(`<div><span></span><span></span><span></span></div>`, 8);
var typing_indicator_default = () => (0, import_web$2.getNextElement)(_tmpl$);

//#endregion
//#region plugins/channel-typing-indicators/styles.jsx.scss
shelter.plugin.scoped.ui.injectCss(`.Q3HVta_indicator {
  margin-left: 4px;
}

.Q3HVta_indicator span {
  float: left;
  background-color: var(--text-default);
  opacity: .3;
  border-radius: 50%;
  width: 6px;
  height: 6px;
  margin: 0 1px;
  display: block;
}

.Q3HVta_indicator span:first-child {
  animation: 1s ease-in .2s infinite Q3HVta_typingAnimation;
}

.Q3HVta_indicator span:nth-child(2) {
  animation: 1s ease-in .4s infinite Q3HVta_typingAnimation;
}

.Q3HVta_indicator span:nth-child(3) {
  animation: 1s ease-in .6s infinite Q3HVta_typingAnimation;
}

@keyframes Q3HVta_typingAnimation {
  33.3% {
    opacity: 1;
    transform: scale(1.2);
  }
}
`);
var styles_jsx_default = {
	"indicator": "Q3HVta_indicator",
	"typingAnimation": "Q3HVta_typingAnimation"
};

//#endregion
//#region plugins/channel-typing-indicators/utils.jsx
var import_web = __toESM(require_web(), 1);
const { flux: { awaitStore: awaitStore$1 }, solidWeb: { render }, util: { getFiber: getFiber$1, reactFiberWalker: reactFiberWalker$1 } } = shelter;
function forceUpdateChannels() {
	const channels = document.querySelectorAll(channelElementQuery);
	channels.forEach((channel) => {
		const fiber = getFiber$1(channel);
		const filter = ({ stateNode }) => stateNode && !(stateNode instanceof Element);
		const ownerInstance = reactFiberWalker$1(fiber, filter, true)?.stateNode;
		ownerInstance?.forceUpdate();
	});
}
function getChannelIconContainer(channelId) {
	const channelElement = document.querySelector(`[data-list-item-id="channels___${channelId}"]`)?.parentElement;
	return channelElement?.querySelector(`div[class^="children_"]`);
}
async function removeTypingIndicator(channelId) {
	const iconContainer = getChannelIconContainer(channelId);
	const typingIndicator = iconContainer?.querySelector(`.${styles_jsx_default.indicator}`);
	typingIndicator?.remove();
}
function addTypingIndicator(channelId) {
	const iconContainer = getChannelIconContainer(channelId);
	if (iconContainer && !iconContainer.querySelector(`.${styles_jsx_default.indicator}`)) {
		const typingIndicatorWrapper = document.createElement("div");
		typingIndicatorWrapper.classList.add(styles_jsx_default.indicator);
		iconContainer.prepend(typingIndicatorWrapper);
		render(() => (0, import_web.createComponent)(typing_indicator_default, {}), typingIndicatorWrapper);
	}
}
async function isSomeoneTypingInChannel(channelId) {
	const typingStore = await awaitStore$1("TypingStore");
	const userStore = await awaitStore$1("UserStore");
	const currentUserId = userStore.getCurrentUser().id;
	const typingUsers = Object.keys(typingStore.getTypingUsers(channelId)).filter((id) => id !== currentUserId);
	return typingUsers.length !== 0;
}
function removeAllIndicators() {
	document.querySelectorAll(`.${styles_jsx_default.indicator}`).forEach((e) => e.remove());
}

//#endregion
//#region plugins/channel-typing-indicators/index.jsx
const { flux: { awaitStore }, util: { getFiber, reactFiberWalker }, plugin: { scoped } } = shelter;
const channelElementQuery = `a[data-list-item-id^="channels___"]:not([class^="mainContent"])`;
let isPatched = false;
async function handleTypingDispatch({ type, userId, channelId }) {
	const userStore = await awaitStore("UserStore");
	if (userId === userStore.getCurrentUser().id) return;
	switch (type) {
		case "TYPING_START": return addTypingIndicator(channelId);
		case "TYPING_STOP":
		case "MESSAGE_CREATE": if (!await isSomeoneTypingInChannel(channelId)) removeTypingIndicator(channelId);
	}
}
function patchRender(channelEl) {
	const fiber = getFiber(channelEl);
	const component = reactFiberWalker(fiber, (f) => !!f?.type?.render, true);
	if (!component) return;
	scoped.patcher.after("render", component.type, (args) => {
		const itemId = args[0]["data-list-item-id"];
		if (!itemId) return;
		const channelId = itemId.split("___")[1];
		queueMicrotask(async () => {
			if (await isSomeoneTypingInChannel(channelId)) addTypingIndicator(channelId);
else removeTypingIndicator(channelId);
		});
	});
	isPatched = true;
	forceUpdateChannels();
}
async function waitForChannelElementAndPatch() {
	const channel = document.querySelector(channelElementQuery);
	if (channel) {
		patchRender(channel);
		if (isPatched) return;
	}
	const unobserve = scoped.observeDom(channelElementQuery, (el) => {
		if (isPatched) return;
		patchRender(el);
		if (!isPatched) return;
		unobserve();
	});
}
const triggers = [
	"TYPING_START",
	"TYPING_STOP",
	"MESSAGE_CREATE"
];
function onLoad() {
	waitForChannelElementAndPatch();
	triggers.forEach((t) => scoped.flux.subscribe(t, handleTypingDispatch));
}
function onUnload() {
	isPatched = false;
	removeAllIndicators();
}

//#endregion
exports.channelElementQuery = channelElementQuery
exports.onLoad = onLoad
exports.onUnload = onUnload
return exports;
})({});