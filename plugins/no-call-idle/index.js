const {
    plugin: { scoped },
    flux: { dispatcher }
} = shelter;

const dispatchTypes = ["EMBEDDED_ACTIVITY_DISCONNECT", "VOICE_STATE_UPDATES"];
const resubscribe = [];

// delete subscription handler right before it gets called
export function onLoad() {
    scoped.flux.intercept(({ type }) => {
        if (dispatchTypes.includes(type)) {
            const actionHandlers = dispatcher._subscriptions[type] ?? [];

            for (const handler of actionHandlers) {
                if (handler.toString().includes("idleTimeout.start")) {
                    actionHandlers.delete(handler);
                    resubscribe.push(() => actionHandlers.add(handler));
                }
            }
        }
    });
}

export function onUnload() {
    resubscribe.forEach((resub) => resub());
}
