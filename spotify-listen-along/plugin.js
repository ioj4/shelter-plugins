(function(exports) {

"use strict";

//#region plugins/spotify-listen-along/index.js
const { flux: { awaitStore }, plugin: { scoped } } = shelter;
async function onLoad() {
	const spotifyStore = await awaitStore("SpotifyStore");
	scoped.patcher.after("getActiveSocketAndDevice", spotifyStore, (_, res) => {
		if (res?.socket) res.socket.isPremium = true;
	});
}

//#endregion
exports.onLoad = onLoad
return exports;
})({});