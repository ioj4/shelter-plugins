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
//#region plugins/open-profile-images/styles.jsx.scss
shelter.plugin.scoped.ui.injectCss(`.RweeCW_wrapper {
  flex-direction: column;
  align-items: flex-start;
  width: fit-content;
  margin: 0 auto;
  display: flex;
}

.RweeCW_image {
  user-select: none;
  object-fit: contain;
  width: 420px;
  max-width: 90vw;
}

.RweeCW_image.RweeCW_banner {
  width: 900px;
}

.RweeCW_link {
  color: var(--white-500);
  opacity: .5;
  font-size: 14px;
  font-weight: 500;
  line-height: 30px;
  text-decoration: none;
  transition: opacity .15s;
}

.RweeCW_link:hover {
  opacity: 1;
  text-decoration: underline;
}

.RweeCW_ioj4Opi {
  cursor: pointer;
}
`);
var styles_jsx_default = {
	"link": "RweeCW_link",
	"image": "RweeCW_image",
	"ioj4Opi": "RweeCW_ioj4Opi",
	"banner": "RweeCW_banner",
	"wrapper": "RweeCW_wrapper"
};

//#endregion
//#region plugins/open-profile-images/components/image-modal.jsx
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
var import_web$3 = __toESM(require_web(), 1);
var import_web$4 = __toESM(require_web(), 1);
var import_web$5 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web$1.template)(`<div><img><a rel="noreferrer noopener" target="_blank">Open in Browser</a></div>`, 5);
const { solid: { createSignal } } = shelter;
var image_modal_default = ({ url }) => {
	const [isLoaded, setIsLoaded] = createSignal(false);
	const lowResUrl = url.toString();
	const isBanner = url.pathname.startsWith("/banners/");
	url.searchParams.set("size", "4096");
	const fullResUrl = url.toString();
	const preloadImage = new Image();
	preloadImage.onload = () => setIsLoaded(true);
	preloadImage.src = fullResUrl;
	const browserURL = fullResUrl.replace(/\.(webp)($|\?)/, ".png$2");
	return (() => {
		const _el$ = (0, import_web$4.getNextElement)(_tmpl$), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
		(0, import_web$5.setAttribute)(_el$3, "href", browserURL);
		(0, import_web$3.effect)((_p$) => {
			const _v$ = styles_jsx_default.wrapper, _v$2 = `${styles_jsx_default.image} ${isBanner ? styles_jsx_default.banner : ""}`, _v$3 = isLoaded() ? fullResUrl : lowResUrl, _v$4 = styles_jsx_default.link;
			_v$ !== _p$._v$ && (0, import_web$2.className)(_el$, _p$._v$ = _v$);
			_v$2 !== _p$._v$2 && (0, import_web$2.className)(_el$2, _p$._v$2 = _v$2);
			_v$3 !== _p$._v$3 && (0, import_web$5.setAttribute)(_el$2, "src", _p$._v$3 = _v$3);
			_v$4 !== _p$._v$4 && (0, import_web$2.className)(_el$3, _p$._v$4 = _v$4);
			return _p$;
		}, {
			_v$: undefined,
			_v$2: undefined,
			_v$3: undefined,
			_v$4: undefined
		});
		return _el$;
	})();
};

//#endregion
//#region plugins/open-profile-images/index.jsx
var import_web = __toESM(require_web(), 1);
const { ui: { openModal }, plugin: { scoped } } = shelter;
function onClick(e) {
	const src = e.target?.querySelector(`img[class*="avatar"]`)?.src ?? e.target?.style?.backgroundImage?.slice(5, -2);
	if (!src) return;
	openModal(() => (0, import_web.createComponent)(image_modal_default, { url: new URL(src) }));
	e.stopImmediatePropagation();
}
const bannerSelector = `[class*="inner"] header [class*="banner"]`;
const subSelectors = [
	`[class*="memberInner"] [class*="avatar"] [class*="wrapper"]`,
	`[class*="avatarWrapperNonUserBot"]`,
	`[class*="headerInner"] [class*="avatar"]:not([class*="clickable"]) [class*="wrapper"]`,
	`[class*="wrapper"][class*="avatar"]`,
	bannerSelector
];
function onLoad() {
	scoped.observeDom(`:is(${subSelectors.join(",")}):not(.${styles_jsx_default.ioj4Opi})`, (el) => {
		if (el.matches(bannerSelector) && !el.style.backgroundImage) return;
		el.classList.add(styles_jsx_default.ioj4Opi);
		el.addEventListener("click", onClick);
	});
}
function onUnload() {
	document.querySelectorAll(`.${styles_jsx_default.ioj4Opi}`).forEach((el) => {
		el.removeEventListener("click", onClick);
		el.classList.remove(styles_jsx_default.ioj4Opi);
	});
}

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
return exports;
})({});