(function(exports) {

"use strict";

//#region plugins/prevent-spotify-pause/index.js
const { flux: { awaitStore }, plugin: { scoped } } = shelter;
const spotifyRe = /https?:\/\/api.spotify.com\/v\d+\/me\/player\/pause/;
const getSentryProperty = (obj) => obj[Object.keys(obj).find((k) => k.startsWith("__sentry_xhr"))];
async function onLoad() {
	const spotifyStore = await awaitStore("SpotifyStore");
	scoped.patcher.instead("wasAutoPaused", spotifyStore, () => false);
	scoped.patcher.instead("send", XMLHttpRequest.prototype, function(args, orig) {
		if (!spotifyRe.test(getSentryProperty(this)?.url)) return orig.apply(this, args);
	});
}

//#endregion
exports.onLoad = onLoad
return exports;
})({});