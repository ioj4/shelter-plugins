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

  // plugins/developer-options/index.js
  var developer_options_exports = {};
  __export(developer_options_exports, {
    onLoad: () => onLoad,
    onUnload: () => onUnload
  });
  var {
    util: { getFiberOwner, awaitDispatch },
    flux: { awaitStore, dispatcher }
  } = shelter;
  function forceUpdateSettings() {
    const sidebar = document.querySelector(`nav > [role=tablist]`)?.parentElement;
    getFiberOwner(sidebar)?.forceUpdate?.();
  }
  async function toggleDevOptions(enable) {
    const { getCurrentUser } = await awaitStore("UserStore");
    let user = getCurrentUser();
    if (!user) {
      await awaitDispatch("CONNECTION_OPEN");
      user = getCurrentUser();
    }
    user.flags = enable ? user.flags | 1 : user.flags & ~1;
    await awaitStore("ExperimentStore");
    await awaitStore("DeveloperExperimentStore");
    const actions = Object.values(
      dispatcher._actionHandlers._dependencyGraph.nodes
    );
    actions.find((n) => n.name === "ExperimentStore").actionHandler.CONNECTION_OPEN({
      type: "CONNECTION_OPEN",
      user: { flags: user.flags },
      experiments: []
    });
    actions.find((n) => n.name === "DeveloperExperimentStore").actionHandler.CONNECTION_OPEN();
    forceUpdateSettings();
  }
  function onLoad() {
    toggleDevOptions(true);
  }
  function onUnload() {
    toggleDevOptions(false);
  }
  return __toCommonJS(developer_options_exports);
})();
