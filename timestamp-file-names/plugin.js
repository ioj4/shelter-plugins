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
//#region plugins/timestamp-file-names/settings.jsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<p>Match dot separators in original filename\n<code>(myfile.rev1.png → 1678677832.png)</code></p>`, 4);
const { plugin: { store: store$1 }, ui: { SwitchItem } } = shelter;
var settings_default = () => (0, import_web$1.createComponent)(SwitchItem, {
	get value() {
		return store$1.matchDotSeparators;
	},
	onChange: (v) => {
		store$1.matchDotSeparators = v;
	},
	get children() {
		const _el$ = (0, import_web$2.getNextElement)(_tmpl$);
		_el$.style.setProperty("white-space", "pre-line");
		return _el$;
	}
});

//#endregion
//#region plugins/timestamp-file-names/index.js
const { flux: { intercept }, plugin: { store } } = shelter;
let unintercept;
function onLoad() {
	store.matchDotSeperators ??= false;
	unintercept = intercept((dispatch) => {
		if (dispatch?.type === "UPLOAD_ATTACHMENT_ADD_FILES") {
			dispatch?.files?.forEach(({ file }) => {
				if (!file?.name) return;
				let newFilename = Date.now().toString();
				if (file.name.includes(".")) {
					const dotIndex = store.matchDotSeparators ? file.name.lastIndexOf(".") : file.name.indexOf(".");
					newFilename += file.name.slice(dotIndex);
				}
				Object.defineProperty(file, "name", { value: newFilename });
			});
			return dispatch;
		}
	});
}
function onUnload() {
	unintercept();
}

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings_default
return exports;
})({});