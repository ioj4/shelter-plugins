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
//#region plugins/show-username/settings.jsx
var import_web$3 = __toESM(require_web(), 1);
const { plugin: { store: store$1 }, ui: { SwitchItem } } = shelter;
var settings_default = () => (0, import_web$3.createComponent)(SwitchItem, {
	get value() {
		return store$1.usernamesOnly;
	},
	onChange: (v) => {
		store$1.usernamesOnly = v;
		forceAddUsernames();
	},
	children: "Only display usernames"
});

//#endregion
//#region plugins/show-username/index.jsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<span style="font-weight: 600;border-radius: 4px;padding: 0 4px;background: var(--background-secondary);" class="ioj4-su"></span>`, 2);
const { plugin: { scoped, store }, util: { getFiber, reactFiberWalker } } = shelter;
const USERNAME_QUERY = "[id^=\"message-username-\"] > [class^=\"username\"]";
function forceAddUsernames() {
	for (const e of document.querySelectorAll(USERNAME_QUERY)) addUsername(e, true);
}
function addUsername(e, overwrite = false) {
	if (e.querySelector(".ioj4-su") && !overwrite) return;
	const props = reactFiberWalker(getFiber(e), "message", true)?.pendingProps;
	if (!props?.author || !props?.message) return;
	const { nick } = props.author;
	const { username } = props.message.author;
	const style = "font-weight: 600;border-radius: 4px;padding: 0 4px;background: var(--background-secondary);";
	const usernameElement = (() => {
		const _el$ = (0, import_web$1.getNextElement)(_tmpl$);
		(0, import_web$2.insert)(_el$, username);
		return _el$;
	})();
	const appendNick = nick && !store.usernamesOnly && username !== nick;
	e.textContent = appendNick ? ` ${nick}` : ``;
	e.prepend(usernameElement);
}
function onLoad() {
	store.usernamesOnly ??= false;
	forceAddUsernames();
	scoped.observeDom(USERNAME_QUERY, (e) => {
		queueMicrotask(() => {
			addUsername(e);
		});
	});
}

//#endregion
exports.forceAddUsernames = forceAddUsernames
exports.onLoad = onLoad
exports.settings = settings_default
return exports;
})({});