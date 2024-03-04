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

  // plugins/channel-typing-indicators/index.jsx
  var channel_typing_indicators_exports = {};
  __export(channel_typing_indicators_exports, {
    channelElementQuery: () => channelElementQuery,
    onLoad: () => onLoad,
    onUnload: () => onUnload
  });

  // plugins/channel-typing-indicators/utils.jsx
  var import_web2 = __toESM(require_web(), 1);

  // plugins/channel-typing-indicators/components/typing-indicator.jsx
  var import_web = __toESM(require_web(), 1);
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<div><span></span><span></span><span></span></div>`, 8);
  var typing_indicator_default = () => _tmpl$.cloneNode(true);

  // plugins/channel-typing-indicators/styles.jsx.scss
  shelter.plugin.scoped.ui.injectCss(`._indicator_1obqu_1{margin-left:4px}._indicator_1obqu_1 span{height:6px;width:6px;float:left;margin:0 1px;background-color:var(--text-normal);display:block;border-radius:50%;opacity:.3}._indicator_1obqu_1 span:nth-child(1){animation:1s ease-in 0.2s _typingAnimation_1obqu_1;animation-iteration-count:infinite}._indicator_1obqu_1 span:nth-child(2){animation:1s ease-in 0.4s _typingAnimation_1obqu_1;animation-iteration-count:infinite}._indicator_1obqu_1 span:nth-child(3){animation:1s ease-in 0.6s _typingAnimation_1obqu_1;animation-iteration-count:infinite}@keyframes _typingAnimation_1obqu_1{33.3%{opacity:1;transform:scale(1.2)}}`);
  var styles_jsx_default = {
    "indicator": "_indicator_1obqu_1",
    "typingAnimation": "_typingAnimation_1obqu_1"
  };

  // plugins/channel-typing-indicators/utils.jsx
  var {
    flux: {
      awaitStore
    },
    solidWeb: {
      render
    },
    util: {
      getFiber,
      reactFiberWalker
    }
  } = shelter;
  function forceUpdateChannels() {
    const channels = document.querySelectorAll(channelElementQuery);
    channels.forEach((channel) => {
      const fiber = getFiber(channel);
      const filter = ({
        stateNode
      }) => stateNode && !(stateNode instanceof Element);
      const ownerInstance = reactFiberWalker(fiber, filter, true)?.stateNode;
      ownerInstance?.forceUpdate();
    });
  }
  function getChannelIconContainer(channelId) {
    const channelElement = document.querySelector(`[data-list-item-id="channels___${channelId}"]`)?.parentElement;
    return channelElement?.querySelector(`div[class^="children_"]`);
  }
  async function removeTypingIndicator(channelId) {
    const iconContainer = getChannelIconContainer(channelId);
    const typingIndicator = iconContainer?.querySelector(`.${styles_jsx_default.indicator}`);
    typingIndicator?.remove();
  }
  function addTypingIndicator(channelId) {
    const iconContainer = getChannelIconContainer(channelId);
    if (iconContainer && !iconContainer.querySelector(`.${styles_jsx_default.indicator}`)) {
      const typingIndicatorWrapper = document.createElement("div");
      typingIndicatorWrapper.classList.add(styles_jsx_default.indicator);
      iconContainer.prepend(typingIndicatorWrapper);
      render(() => (0, import_web2.createComponent)(typing_indicator_default, {}), typingIndicatorWrapper);
    }
  }
  async function isSomeoneTypingInChannel(channelId) {
    const typingStore = await awaitStore("TypingStore");
    const userStore = await awaitStore("UserStore");
    const currentUserId = userStore.getCurrentUser().id;
    const typingUsers = Object.keys(typingStore.getTypingUsers(channelId)).filter((id) => id !== currentUserId);
    return typingUsers.length !== 0;
  }
  function removeAllIndicators() {
    document.querySelectorAll(`.${styles_jsx_default.indicator}`).forEach((e) => e.remove());
  }

  // plugins/channel-typing-indicators/index.jsx
  var {
    flux: {
      dispatcher,
      awaitStore: awaitStore2
    },
    util: {
      getFiber: getFiber2,
      reactFiberWalker: reactFiberWalker2
    },
    patcher,
    observeDom
  } = shelter;
  var channelElementQuery = `a[data-list-item-id^="channels___"]:not([class^="mainContent"])`;
  var isPatched = false;
  var unpatch;
  async function handleTypingDispatch({
    type,
    userId,
    channelId
  }) {
    const userStore = await awaitStore2("UserStore");
    if (userId === userStore.getCurrentUser().id)
      return;
    switch (type) {
      case "TYPING_START":
        return addTypingIndicator(channelId);
      case "TYPING_STOP":
      case "MESSAGE_CREATE":
        if (!await isSomeoneTypingInChannel(channelId)) {
          removeTypingIndicator(channelId);
        }
    }
  }
  function patchFiber(channelElement) {
    const fiber = getFiber2(channelElement);
    const component = reactFiberWalker2(fiber, (f) => !!f?.type?.render, true);
    if (!component)
      return;
    unpatch = patcher.after("render", component.type, (args) => {
      const itemId = args[0]["data-list-item-id"];
      if (!itemId)
        return;
      const channelId = itemId.split("___")[1];
      queueMicrotask(async () => {
        if (await isSomeoneTypingInChannel(channelId)) {
          addTypingIndicator(channelId);
        } else {
          removeTypingIndicator(channelId);
        }
      });
    });
    isPatched = true;
    forceUpdateChannels();
  }
  async function handleChanneListDispatch() {
    const unObserve = observeDom(channelElementQuery, (channel) => {
      if (!isPatched) {
        patchFiber(channel);
        unObserve();
        dispatcher.unsubscribe("UPDATE_CHANNEL_LIST_DIMENSIONS", handleChanneListDispatch);
      }
    });
    setTimeout(unObserve, 1e3);
  }
  function attemptPatch() {
    const channel = document.querySelector(channelElementQuery);
    if (!channel)
      return;
    patchFiber(channel);
  }
  var triggers = ["TYPING_START", "TYPING_STOP", "MESSAGE_CREATE"];
  function onLoad() {
    attemptPatch();
    triggers.forEach((t) => dispatcher.subscribe(t, handleTypingDispatch));
    !isPatched && dispatcher.subscribe("UPDATE_CHANNEL_LIST_DIMENSIONS", handleChanneListDispatch);
  }
  function onUnload() {
    triggers.forEach((t) => dispatcher.unsubscribe(t, handleTypingDispatch));
    dispatcher.unsubscribe("UPDATE_CHANNEL_LIST_DIMENSIONS", handleChanneListDispatch);
    unpatch?.();
    isPatched = false;
    removeAllIndicators();
  }
  return __toCommonJS(channel_typing_indicators_exports);
})();
