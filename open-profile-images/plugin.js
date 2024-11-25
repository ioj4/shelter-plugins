(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // shltr-res-ns:solid-js/web
  var require_web = __commonJS({
    "shltr-res-ns:solid-js/web"(exports, module) {
      module.exports = shelter.solidWeb;
    }
  });

  // plugins/open-profile-images/index.jsx
  var open_profile_images_exports = {};
  __export(open_profile_images_exports, {
    onLoad: () => onLoad,
    onUnload: () => onUnload
  });
  var import_web5 = __toESM(require_web(), 1);

  // plugins/open-profile-images/components/image-modal.jsx
  var import_web = __toESM(require_web(), 1);
  var import_web2 = __toESM(require_web(), 1);
  var import_web3 = __toESM(require_web(), 1);
  var import_web4 = __toESM(require_web(), 1);

  // plugins/open-profile-images/styles.jsx.scss
  shelter.plugin.scoped.ui.injectCss(`._wrapper_kr65f_1{display:flex;flex-direction:column;align-items:flex-start;margin:0 auto;width:fit-content}._image_kr65f_1{user-select:none;object-fit:contain;max-width:90vw;width:420px}._image_kr65f_1._banner_kr65f_1{width:900px}._link_kr65f_1{font-size:14px;font-weight:500;line-height:30px;color:var(--white-500);text-decoration:none;transition:opacity .15s ease;opacity:.5}._link_kr65f_1:hover{opacity:1;text-decoration:underline}._ioj4Opi_kr65f_1{cursor:pointer}`);
  var styles_jsx_default = {
    "wrapper": "_wrapper_kr65f_1",
    "image": "_image_kr65f_1",
    "banner": "_banner_kr65f_1",
    "link": "_link_kr65f_1",
    "ioj4Opi": "_ioj4Opi_kr65f_1"
  };

  // plugins/open-profile-images/components/image-modal.jsx
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<div><img><a rel="noreferrer noopener" target="_blank">Open in Browser</a></div>`, 5);
  var {
    solid: {
      createSignal
    }
  } = shelter;
  var image_modal_default = ({
    url
  }) => {
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
      const _el$ = _tmpl$.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
      (0, import_web4.setAttribute)(_el$3, "href", browserURL);
      (0, import_web3.effect)((_p$) => {
        const _v$ = styles_jsx_default.wrapper, _v$2 = `${styles_jsx_default.image} ${isBanner ? styles_jsx_default.banner : ""}`, _v$3 = isLoaded() ? fullResUrl : lowResUrl, _v$4 = styles_jsx_default.link;
        _v$ !== _p$._v$ && (0, import_web2.className)(_el$, _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && (0, import_web2.className)(_el$2, _p$._v$2 = _v$2);
        _v$3 !== _p$._v$3 && (0, import_web4.setAttribute)(_el$2, "src", _p$._v$3 = _v$3);
        _v$4 !== _p$._v$4 && (0, import_web2.className)(_el$3, _p$._v$4 = _v$4);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0,
        _v$3: void 0,
        _v$4: void 0
      });
      return _el$;
    })();
  };

  // plugins/open-profile-images/index.jsx
  var {
    ui: {
      openModal
    },
    plugin: {
      scoped
    }
  } = shelter;
  function onClick(e) {
    const src = e.target?.querySelector(`img[class*="avatar"]`)?.src ?? e.target?.style?.backgroundImage?.slice(5, -2);
    if (!src)
      return;
    openModal(() => (0, import_web5.createComponent)(image_modal_default, {
      url: new URL(src)
    }));
    e.stopImmediatePropagation();
  }
  var bannerSelector = `[class*="inner"] header [class*="banner"]`;
  var subSelectors = [
    // pfp in member list
    `[class*="memberInner"] [class*="avatar"] [class*="wrapper"]`,
    // pfp in popout of webhooks
    `[class*="avatarWrapperNonUserBot"]`,
    // pfp in profile modal
    `[class*="headerInner"] [class*="avatar"]:not([class*="clickable"]) [class*="wrapper"]`,
    // pfp in topbar in DMs, friends list, add to DM popover and own pfp in bottom left
    `[class*="wrapper"][class*="avatar"]`,
    // banner in profile modal
    bannerSelector
  ];
  function onLoad() {
    scoped.observeDom(`:is(${subSelectors.join(",")}):not(.${styles_jsx_default.ioj4Opi})`, (el) => {
      if (el.matches(bannerSelector) && !el.style.backgroundImage)
        return;
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
  return __toCommonJS(open_profile_images_exports);
})();
