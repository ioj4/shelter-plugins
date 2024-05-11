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

  // plugins/notification-volume/index.jsx
  var notification_volume_exports = {};
  __export(notification_volume_exports, {
    onLoad: () => onLoad,
    settings: () => settings
  });
  var import_web = __toESM(require_web(), 1);
  var import_web2 = __toESM(require_web(), 1);
  var import_web3 = __toESM(require_web(), 1);
  var import_web4 = __toESM(require_web(), 1);
  var import_web5 = __toESM(require_web(), 1);

  // plugins/notification-volume/styles.jsx.scss
  shelter.plugin.scoped.ui.injectCss(`._header_ifxfs_1{font-weight:700;margin-bottom:8px;letter-spacing:.02em;line-height:1.33333}._container_ifxfs_1{position:absolute;margin:0;width:80%;top:50%;left:50%;transform:translate(-50%, -50%)}`);
  var styles_jsx_default = {
    "header": "_header_ifxfs_1",
    "container": "_container_ifxfs_1"
  };

  // plugins/notification-volume/index.jsx
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<div></div>`, 2);
  var {
    ui: {
      Slider,
      Header
    },
    plugin: {
      store,
      scoped
    },
    patcher
  } = shelter;
  var audio;
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
  var settings = () => (() => {
    const _el$ = _tmpl$.cloneNode(true);
    (0, import_web4.insert)(_el$, (0, import_web5.createComponent)(Header, {
      get ["class"]() {
        return styles_jsx_default.header;
      },
      children: "Volume of notifications and sounds"
    }), null);
    (0, import_web4.insert)(_el$, (0, import_web5.createComponent)(Slider, {
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
    }), null);
    (0, import_web3.effect)(() => (0, import_web2.className)(_el$, styles_jsx_default.container));
    return _el$;
  })();
  return __toCommonJS(notification_volume_exports);
})();
