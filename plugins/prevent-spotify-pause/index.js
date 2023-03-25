const {
    flux: { stores: { NoticeStore } },
    patcher
} = shelter;

// dismiss popup in advance
NoticeStore.__getLocalVars().temporaryDismisses[
    'SPOTIFY_AUTO_PAUSED'
] = true;

const testUrl = /https?:\/\/api.spotify.com.+\/me\/player\/pause/;

// prevent access to the pause endpoint
export const onUnload = patcher.instead(
	'send',
    XMLHttpRequest.prototype,
    function (args, orig) {
        if (!testUrl.test(this.__sentry_xhr__?.url)) {
            return orig.apply(this, args);
        }
    }
);
