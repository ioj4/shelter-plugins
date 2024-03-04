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

  // plugins/show-username/index.jsx
  var show_username_exports = {};
  __export(show_username_exports, {
    forceAddUsernames: () => forceAddUsernames,
    onLoad: () => onLoad,
    onUnload: () => onUnload,
    settings: () => settings_default
  });
  var import_web2 = __toESM(require_web(), 1);
  var import_web3 = __toESM(require_web(), 1);

  // plugins/show-username/settings.jsx
  var import_web = __toESM(require_web(), 1);
  var {
    plugin: {
      store
    },
    ui: {
      SwitchItem
    }
  } = shelter;
  var settings_default = () => (0, import_web.createComponent)(SwitchItem, {
    get value() {
      return store.usernamesOnly;
    },
    onChange: (v) => {
      store.usernamesOnly = v;
      forceAddUsernames();
    },
    children: "Only display usernames"
  });

  // plugins/show-username/index.jsx
  var _tmpl$ = /* @__PURE__ */ (0, import_web2.template)(`<span style="font-weight: 600;border-radius: 5px;padding: 0 3px;background: var(--background-secondary);" class="ioj4-su"></span>`, 2);
  var {
    plugin: {
      store: store2
    },
    flux: {
      dispatcher,
      awaitStore
    },
    util: {
      getFiber,
      reactFiberWalker
    },
    observeDom
  } = shelter;
  var USERNAME_QUERY = '[id^="message-username-"] > [class^="username"]';
  function forceAddUsernames() {
    for (const e of document.querySelectorAll(USERNAME_QUERY)) {
      addUsername(e, true);
    }
  }
  async function addUsername(e, overwrite = false) {
    if (e.querySelector(".ioj4-su") && !overwrite)
      return;
    const msg = reactFiberWalker(getFiber(e), "message", true)?.pendingProps?.message;
    if (!msg || !msg?.author)
      return;
    const channelStore = await awaitStore("ChannelStore");
    const guildMemberStore = await awaitStore("GuildMemberStore");
    const relationshipStore = await awaitStore("RelationshipStore");
    const {
      username: authorUsername,
      id: authorId
    } = msg.author;
    const {
      type: channelType,
      guild_id: guildId
    } = channelStore.getChannel(msg?.channel_id);
    const nickname = channelType ? relationshipStore.getNickname(authorId) : guildMemberStore.getNick(guildId, authorId);
    const style = "font-weight: 600;border-radius: 5px;padding: 0 3px;background: var(--background-secondary);";
    const usernameElement = (() => {
      const _el$ = _tmpl$.cloneNode(true);
      (0, import_web3.insert)(_el$, authorUsername);
      return _el$;
    })();
    e.textContent = nickname && !store2.usernamesOnly ? ` ${nickname}` : "";
    e.prepend(usernameElement);
  }
  async function onDispatch(payload) {
    const selectedChannelStore = await awaitStore("SelectedChannelStore");
    if (payload.type === "MESSAGE_CREATE" && payload.channelId !== selectedChannelStore.getChannelId()) {
      return;
    }
    const unObserve = observeDom(USERNAME_QUERY, (e) => {
      unObserve();
      addUsername(e);
    });
    setTimeout(unObserve, 500);
  }
  var TRIGGERS = ["MESSAGE_CREATE", "CHANNEL_SELECT", "LOAD_MESSAGES_SUCCESS", "UPDATE_CHANNEL_DIMENSIONS", "GUILD_MEMBER_UPDATE", "USER_NOTE_LOADED", "GUILD_MEMBER_PROFILE_UPDATE", "USER_UPDATE"];
  function onLoad() {
    store2.usernamesOnly ??= false;
    forceAddUsernames();
    for (const t of TRIGGERS)
      dispatcher.subscribe(t, onDispatch);
  }
  function onUnload() {
    for (const t of TRIGGERS)
      dispatcher.unsubscribe(t, onDispatch);
  }
  return __toCommonJS(show_username_exports);
})();
