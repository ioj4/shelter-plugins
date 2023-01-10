// disable notice
shelter.flux.stores.NoticeStore.__getLocalVars().temporaryDismisses["SPOTIFY_AUTO_PAUSED"] = true;

// prevent access to the pause endpoint
export const onUnload = shelter.patcher.instead(
  "send",
  XMLHttpRequest.prototype,
  function (args, orig) {
    const testUrl = /https?:\/\/api.spotify.com.+\/me\/player\/pause/;
    if (!testUrl.test(this.__sentry_xhr__?.url)) {
      return orig.apply(this, args);
    }
  }
);
