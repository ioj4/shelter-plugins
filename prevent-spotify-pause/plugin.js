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
    onLoad: () => onLoad
  });
  var {
    flux: { awaitStore },
    plugin: { scoped }
  } = shelter;
  var spotifyRe = /https?:\/\/api.spotify.com\/v\d+\/me\/player\/pause/;
  var getSentryProperty = (obj) => obj[Object.keys(obj).find((k) => k.startsWith("__sentry_xhr"))];
  async function onLoad() {
    const spotifyStore = await awaitStore("SpotifyStore");
    scoped.patcher.instead("wasAutoPaused", spotifyStore, () => false);
    scoped.patcher.instead(
      "send",
      XMLHttpRequest.prototype,
      function(args, orig) {
        if (!spotifyRe.test(getSentryProperty(this)?.url)) {
          return orig.apply(this, args);
        }
      }
    );
  }
  return __toCommonJS(prevent_spotify_pause_exports);
})();
