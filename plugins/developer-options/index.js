const {
    util: { getFiberOwner, awaitDispatch },
    flux: { awaitStore, dispatcher }
} = shelter;

function forceUpdateSettings() {
    // this also applies to server settings, but that's fine
    const sidebar =
        document.querySelector(`nav > [role=tablist]`)?.parentElement;
    getFiberOwner(sidebar)?.forceUpdate?.();
}

async function toggleDevOptions(enable) {
    const { getCurrentUser } = await awaitStore("UserStore");
    let user = getCurrentUser();

    // user can be null during start of discord
    if (!user) {
        await awaitDispatch("CONNECTION_OPEN");
        user = getCurrentUser();
    }

    // last bit is whether the user is staff
    user.flags = enable ? user.flags | 1 : user.flags & ~1;

    // just to make sure they're initialized
    await awaitStore("ExperimentStore");
    await awaitStore("DeveloperExperimentStore");

    const actions = Object.values(
        dispatcher._actionHandlers._dependencyGraph.nodes
    );

    actions
        .find((n) => n.name === "ExperimentStore")
        .actionHandler.CONNECTION_OPEN({
            type: "CONNECTION_OPEN",
            user: { flags: user.flags },
            experiments: []
        });

    actions
        .find((n) => n.name === "DeveloperExperimentStore")
        .actionHandler.CONNECTION_OPEN();

    forceUpdateSettings();
}

export function onLoad() {
    toggleDevOptions(true);
}

export function onUnload() {
    toggleDevOptions(false);
}
