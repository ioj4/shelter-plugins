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

  // plugins/open-in-app/index.js
  var open_in_app_exports = {};
  __export(open_in_app_exports, {
    apps: () => apps,
    onLoad: () => onLoad,
    onUnload: () => onUnload,
    settings: () => settings
  });

  // plugins/open-in-app/settings.jsx
  var import_web = __toESM(require_web(), 1);
  var {
    plugin: {
      store
    },
    ui: {
      SwitchItem
    }
  } = shelter;
  var settings = () => {
    const rows = [];
    for (const [appName, app] of Object.entries(apps)) {
      rows.push((0, import_web.createComponent)(SwitchItem, {
        get value() {
          return store[appName];
        },
        onChange: (value) => {
          store[appName] = value;
        },
        get note() {
          return app.protocol;
        },
        children: appName
      }));
    }
    return rows;
  };

  // plugins/open-in-app/index.js
  var {
    plugin: { store: store2 },
    patcher: { instead }
  } = shelter;
  var apps = {
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
  function getEnabledApp(url2) {
    if (!/https?:\/\//.test(url2.toString()))
      return;
    const { hostname } = new URL(url2);
    return Object.entries(apps).find(
      ([appName, app]) => app.hostnames.includes(hostname) && store2[appName]
    );
  }
  async function unshortenLink(url2) {
    const re = /<meta property="og:url" content="(.+?)"/;
    const body = await (await fetch(`https://shcors.uwu.network/${url2}`)).text();
    return re.exec(body)?.[1];
  }
  async function openInApp(url2) {
    try {
      url2 = new URL(url2);
      if (["spotify.link", "on.soundcloud.com"].includes(url2.hostname)) {
        url2 = new URL(await unshortenLink(url2));
      }
      if (url2.hostname === "open.spotify.com") {
        url2.pathname = url2.pathname.replace(/\/intl-.+?(\/.+)/i, "$1");
      }
      const [appName, app] = getEnabledApp(url2);
      const replacedUrl = app.protocol + url2;
      window.open(replacedUrl, "_blank")?.close();
    } catch (e) {
      console.error("[open-in-app] Error opening in App", e);
    }
  }
  var unpatchWindow;
  function patchWindowOpen() {
    unpatchWindow = instead("open", window, (args, orig) => {
      const [url2] = args;
      if (!getEnabledApp(url2))
        return orig(...args);
      openInApp(url2);
    });
  }
  var unpatchVirtualClick;
  async function patchVirtualClick() {
    unpatchVirtualClick = instead(
      "click",
      HTMLAnchorElement.prototype,
      function(args, orig) {
        const { href } = this;
        if (!getEnabledApp(href))
          return orig(...args);
        openInApp(url);
      }
    );
  }
  async function onClick(e) {
    const anchor = e?.target?.closest("a");
    if (!anchor?.href || !getEnabledApp(anchor.href))
      return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openInApp(anchor.href);
  }
  var appMount = document.querySelector("#app-mount");
  function onLoad() {
    Object.entries(apps).forEach(([appName, app]) => {
      store2[appName] ??= app.default;
    });
    patchWindowOpen();
    patchVirtualClick();
    appMount.addEventListener("click", onClick);
  }
  function onUnload() {
    unpatchWindow?.();
    unpatchVirtualClick?.();
    appMount.removeEventListener("click", onClick);
  }
  return __toCommonJS(open_in_app_exports);
})();
