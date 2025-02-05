(function(exports) {

"use strict";

//#region plugins/no-call-idle/index.js
const { plugin: { scoped }, flux: { dispatcher } } = shelter;
const dispatchTypes = ["EMBEDDED_ACTIVITY_DISCONNECT", "VOICE_STATE_UPDATES"];
const resubscribe = [];
function onLoad() {
	scoped.flux.intercept(({ type }) => {
		if (dispatchTypes.includes(type)) {
			const actionHandlers = dispatcher._subscriptions[type] ?? [];
			for (const handler of actionHandlers) if (handler.toString().includes("idleTimeout.start")) {
				actionHandlers.delete(handler);
				resubscribe.push(() => actionHandlers.add(handler));
			}
		}
	});
}
function onUnload() {
	resubscribe.forEach((resub) => resub());
}

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
return exports;
})({});