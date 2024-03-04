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

  // plugins/prevent-spotify-pause/index.js
  var prevent_spotify_pause_exports = {};
  __export(prevent_spotify_pause_exports, {
    onLoad: () => onLoad,
    onUnload: () => onUnload
  });
  var {
    flux: { awaitStore },
    patcher
  } = shelter;
  var testUrl = /https?:\/\/api.spotify.com.+\/me\/player\/pause/;
  var unpatchStore;
  var unpatchXHR;
  async function onLoad() {
    const spotifyStore = await awaitStore("SpotifyStore");
    unpatchStore = patcher.instead("wasAutoPaused", spotifyStore, () => false);
    unpatchXHR = patcher.instead(
      "send",
      XMLHttpRequest.prototype,
      function(args, orig) {
        if (!testUrl.test(this.__sentry_xhr_v2__?.url)) {
          return orig.apply(this, args);
        }
      }
    );
  }
  function onUnload() {
    unpatchStore?.();
    unpatchXHR?.();
  }
  return __toCommonJS(prevent_spotify_pause_exports);
})();
