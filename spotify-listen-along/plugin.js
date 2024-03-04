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

  // plugins/spotify-listen-along/index.js
  var spotify_listen_along_exports = {};
  __export(spotify_listen_along_exports, {
    onLoad: () => onLoad
  });
  var { awaitStore } = shelter.flux;
  var scoped = shelter.plugin.scoped;
  async function onLoad() {
    const spotifyStore = await awaitStore("SpotifyStore");
    scoped.patcher.after("getActiveSocketAndDevice", spotifyStore, (_, res) => {
      if (res?.socket) {
        res.socket.isPremium = true;
      }
    });
  }
  return __toCommonJS(spotify_listen_along_exports);
})();
