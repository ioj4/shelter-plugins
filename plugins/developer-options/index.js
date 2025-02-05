const {
    util: { getFiberOwner, awaitDispatch },
    flux: { awaitStore, dispatcher, intercept }
} = shelter;

function forceUpdateSettings() {
    // this also applies to server settings, but that's fine
    const sidebar =
        document.querySelector(`nav > [role=tablist]`)?.parentElement;
    getFiberOwner(sidebar)?.forceUpdate?.();
}

function modifyFlags(flags, isStaff) {
    return isStaff ? flags | 1 : flags & ~1;
}

function interceptHandler(dispatch) {
    if (
        dispatch?.type !== "CONNECTION_OPEN" ||
        dispatch?.user?.flags === undefined
    )
        return;

    dispatch.user.flags = modifyFlags(dispatch.user.flags, true);

    return dispatch;
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
    user.flags = modifyFlags(user.flags, enable);

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

let unintercept;

export function onLoad() {
    unintercept = intercept(interceptHandler);
    toggleDevOptions(true);
}

export function onUnload() {
    unintercept?.();
    toggleDevOptions(false);
}
