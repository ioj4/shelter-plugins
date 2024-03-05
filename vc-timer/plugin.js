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

  // plugins/vc-timer/index.jsx
  var vc_timer_exports = {};
  __export(vc_timer_exports, {
    insertTimer: () => insertTimer,
    onLoad: () => onLoad,
    onUnload: () => onUnload,
    settings: () => settings
  });
  var import_web4 = __toESM(require_web(), 1);

  // plugins/vc-timer/components/timer.jsx
  var import_web = __toESM(require_web(), 1);
  var import_web2 = __toESM(require_web(), 1);
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<p></p>`, 2);
  var {
    solid: {
      createSignal,
      onCleanup
    },
    plugin: {
      store
    }
  } = shelter;
  function toTimeString(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor(secs / 60) - h * 60;
    const s = Math.floor(secs - h * 3600 - m * 60);
    return (h ? h.toString() + ":" : "") + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
  }
  var timer_default = () => {
    const getDuration = () => (Date.now() - store.joinTime) / 1e3;
    const [time, setTime] = createSignal(toTimeString(getDuration()));
    const timer = setInterval(() => setTime(toTimeString(getDuration())), 1e3);
    onCleanup(() => {
      clearInterval(timer);
      insertTimer();
    });
    return (() => {
      const _el$ = _tmpl$.cloneNode(true);
      _el$.style.setProperty("display", "inline");
      _el$.style.setProperty("font-family", "monospace");
      (0, import_web2.insert)(_el$, () => time() + " \u2022 ");
      return _el$;
    })();
  };

  // plugins/vc-timer/settings.jsx
  var import_web3 = __toESM(require_web(), 1);
  var {
    plugin: {
      store: store2
    },
    ui: {
      SwitchItem
    }
  } = shelter;
  var settings = () => (0, import_web3.createComponent)(SwitchItem, {
    get value() {
      return store2.persistTime;
    },
    onChange: (v) => store2.persistTime = v,
    note: "Time resets after 10 seconds of not being in a voice channel",
    children: "Persist time across channel moves"
  });

  // plugins/vc-timer/index.jsx
  var {
    flux: {
      awaitStore
    },
    ui: {
      ReactiveRoot
    },
    plugin: {
      scoped,
      store: store3
    }
  } = shelter;
  var SUBTEXT_QUERY = `[class^="rtcConnectionStatus"] + a > div[class*="subtext"]:not(:has(.ioj4-vct))`;
  var insertLock = false;
  async function insertTimer() {
    if (insertLock || !store3.isInVC)
      return;
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
    const timer = (0, import_web4.createComponent)(ReactiveRoot, {
      get children() {
        return (0, import_web4.createComponent)(timer_default, {});
      }
    });
    timer.className = "ioj4-vct";
    subtext.prepend(timer);
    insertLock = false;
  }
  var lastLeave = 0;
  function initializeTimer() {
    if (!store3.isInVC) {
      store3.isInVC = true;
      if (!store3.persistTime || lastLeave < Date.now() - 1e4) {
        store3.joinTime = Date.now();
      }
    }
    insertTimer();
  }
  function onTrack(e) {
    if (e.event === "join_voice_channel") {
      initializeTimer();
    } else if (e.event === "leave_voice_channel") {
      store3.isInVC = false;
      lastLeave = Date.now();
    }
  }
  function onLogout() {
    store3.isInVC = false;
  }
  async function onLoad() {
    const vcStore = await awaitStore("VoiceStateStore");
    if (vcStore.isCurrentClientInVoiceChannel())
      initializeTimer();
    scoped.flux.subscribe("TRACK", onTrack);
    scoped.flux.subscribe("LOGOUT", onLogout);
  }
  function onUnload() {
    store3.isInVC = false;
    document.querySelectorAll(`.ioj4-vct`).forEach((e) => e.remove());
  }
  return __toCommonJS(vc_timer_exports);
})();
