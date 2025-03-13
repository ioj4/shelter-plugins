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
//#region plugins/notification-volume/styles.jsx.scss
shelter.plugin.scoped.ui.injectCss(`.LlDkza_header {
  letter-spacing: .02em;
  margin-bottom: 8px;
  font-weight: 700;
  line-height: 1.33333;
}

.LlDkza_container {
  width: 80%;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
`);
var styles_jsx_default = {
	"header": "LlDkza_header",
	"container": "LlDkza_container"
};

//#endregion
//#region plugins/notification-volume/index.jsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
var import_web$3 = __toESM(require_web(), 1);
var import_web$4 = __toESM(require_web(), 1);
var import_web$5 = __toESM(require_web(), 1);
var import_web$6 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<div><!#><!/><!#><!/></div>`, 6);
const { ui: { Slider, Header }, plugin: { store, scoped }, patcher } = shelter;
let audio;
function onLoad() {
	store.volume ??= 100;
	scoped.patcher.after("Audio", window, (args, res) => {
		patcher.before("play", res, function() {
			this.volume = store.volume / 100;
		});
	});
	audio = new Audio();
	audio.src = "/assets/9422aef94aa931248105.mp3";
}
function playPreview() {
	audio.currentTime = 0;
	audio.play();
}
const settings = () => (() => {
	const _el$ = (0, import_web$3.getNextElement)(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = (0, import_web$4.getNextMarker)(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = (0, import_web$4.getNextMarker)(_el$4.nextSibling);
	(0, import_web$5.insert)(_el$, (0, import_web$6.createComponent)(Header, {
		get ["class"]() {
			return styles_jsx_default.header;
		},
		children: "Volume of notifications and sounds"
	}), _el$3, _co$);
	(0, import_web$5.insert)(_el$, (0, import_web$6.createComponent)(Slider, {
		min: 0,
		max: 100,
		get value() {
			return store.volume;
		},
		step: 5,
		tick: true,
		onInput: (v) => {
			store.volume = v;
			playPreview();
		}
	}), _el$5, _co$2);
	(0, import_web$2.effect)(() => (0, import_web$1.className)(_el$, styles_jsx_default.container));
	return _el$;
})();

//#endregion
exports.onLoad = onLoad
exports.settings = settings
return exports;
})({});