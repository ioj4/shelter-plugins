(function(exports) {

"use strict";

//#region plugins/developer-options/index.js
const { util: { getFiberOwner, awaitDispatch, log }, flux: { awaitStore, dispatcher, stores }, patcher } = shelter;
function forceUpdateSettings() {
	const sidebar = document.querySelector(`nav > [role=tablist]`)?.parentElement;
	getFiberOwner(sidebar)?.forceUpdate?.();
}
function modifyFlags(flags, isStaff) {
	return isStaff ? flags | 1 : flags & -2;
}
let pluginEnabled = true;
let unpatches = [];
function patchActionHandlers() {
	try {
		const nodes = Object.values(dispatcher._actionHandlers._dependencyGraph.nodes);
		const experimentStore = nodes.find((n) => n?.name === "ExperimentStore");
		const devExperimentStore = nodes.find((n) => n?.name === "DeveloperExperimentStore");
		unpatches.push(patcher.before("CONNECTION_OPEN", experimentStore.actionHandler, ([dispatch]) => {
			if (dispatch?.user?.flags === undefined) return;
			const userProxy = new Proxy(dispatch.user, { get(target, prop) {
				if (prop === "flags") return modifyFlags(target.flags, pluginEnabled);
				return Reflect.get(...arguments);
			} });
			const dispatchProxy = new Proxy(dispatch, { get(target, prop) {
				if (prop === "user") return userProxy;
				return Reflect.get(...arguments);
			} });
			return [dispatchProxy];
		}));
		unpatches.push(patcher.instead("CONNECTION_OPEN", devExperimentStore.actionHandler, function(args, orig) {
			const user = stores.UserStore.getCurrentUser();
			const origFlags = user.flags;
			user.flags = modifyFlags(user.flags, pluginEnabled);
			orig.apply(this, args);
			user.flags = origFlags;
		}));
	} catch (e) {
		log(`[Developer-Options] Error while trying to patch action handlers: ${e}`, "error");
	}
}
async function triggerDevOptions() {
	await awaitStore("DeveloperExperimentStore");
	await awaitStore("ExperimentStore");
	const { getCurrentUser } = await awaitStore("UserStore");
	let user = getCurrentUser();
	if (!user) {
		await awaitDispatch("CONNECTION_OPEN");
		user = getCurrentUser();
	}
	const actions = Object.values(dispatcher._actionHandlers._dependencyGraph.nodes);
	actions.find((n) => n.name === "ExperimentStore").actionHandler.CONNECTION_OPEN({
		type: "CONNECTION_OPEN",
		user: getCurrentUser(),
		experiments: []
	});
	actions.find((n) => n.name === "DeveloperExperimentStore").actionHandler.CONNECTION_OPEN();
	forceUpdateSettings();
}
function onLoad() {
	patchActionHandlers();
	triggerDevOptions();
}
function onUnload() {
	pluginEnabled = false;
	triggerDevOptions().then(() => {
		unpatches.forEach((u) => u());
	});
}

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
return exports;
})({});