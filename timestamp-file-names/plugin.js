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

  // plugins/timestamp-file-names/index.js
  var timestamp_file_names_exports = {};
  __export(timestamp_file_names_exports, {
    onLoad: () => onLoad,
    onUnload: () => onUnload,
    settings: () => settings_default
  });

  // plugins/timestamp-file-names/settings.jsx
  var import_web = __toESM(require_web(), 1);
  var import_web2 = __toESM(require_web(), 1);
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<p>Match dot separators in original filename
<code>(myfile.rev1.png \u2192 1678677832.png)</code></p>`, 4);
  var {
    plugin: {
      store
    },
    ui: {
      SwitchItem
    }
  } = shelter;
  var settings_default = () => (0, import_web2.createComponent)(SwitchItem, {
    get value() {
      return store.matchDotSeparators;
    },
    onChange: (v) => {
      store.matchDotSeparators = v;
    },
    get children() {
      const _el$ = _tmpl$.cloneNode(true);
      _el$.style.setProperty("white-space", "pre-line");
      return _el$;
    }
  });

  // plugins/timestamp-file-names/index.js
  var {
    flux: { intercept },
    plugin: { store: store2 }
  } = shelter;
  var unintercept;
  function onLoad() {
    store2.matchDotSeperators ??= false;
    unintercept = intercept((dispatch) => {
      if (dispatch?.type === "UPLOAD_ATTACHMENT_ADD_FILES") {
        dispatch?.files?.forEach(({ file }) => {
          if (!file?.name)
            return;
          let newFilename = Date.now().toString();
          if (file.name.includes(".")) {
            const dotIndex = store2.matchDotSeparators ? file.name.lastIndexOf(".") : file.name.indexOf(".");
            newFilename += file.name.slice(dotIndex);
          }
          Object.defineProperty(file, "name", {
            value: newFilename
          });
        });
        return dispatch;
      }
    });
  }
  function onUnload() {
    unintercept();
  }
  return __toCommonJS(timestamp_file_names_exports);
})();
