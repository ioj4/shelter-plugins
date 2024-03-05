(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // plugins/no-call-idle/index.js
  var no_call_idle_exports = {};
  __export(no_call_idle_exports, {
    onLoad: () => onLoad,
    onUnload: () => onUnload
  });
  var {
    plugin: { scoped },
    flux: { dispatcher }
  } = shelter;
  var dispatchTypes = ["EMBEDDED_ACTIVITY_DISCONNECT", "VOICE_STATE_UPDATES"];
  var resubscribe = [];
  function onLoad() {
    scoped.flux.intercept(({ type }) => {
      if (dispatchTypes.includes(type)) {
        const actionHandlers = dispatcher._subscriptions[type] ?? [];
        for (const handler of actionHandlers) {
          if (handler.toString().includes("idleTimeout.start")) {
            actionHandlers.delete(handler);
            resubscribe.push(() => actionHandlers.add(handler));
          }
        }
      }
    });
  }
  function onUnload() {
    resubscribe.forEach((resub) => resub());
  }
  return __toCommonJS(no_call_idle_exports);
})();
