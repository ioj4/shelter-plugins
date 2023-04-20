const {
    flux: { intercept, dispatcher }
} = shelter;

const dispatchTypes = ["EMBEDDED_ACTIVITY_DISCONNECT", "VOICE_STATE_UPDATES"];

export const onUnload = intercept((payload) => {
    if (dispatchTypes.includes(payload?.type)) {
        // delete handlers that start the call idle timeout
        for (const handler of dispatcher._subscriptions?.[payload.type]) {
            if (handler.toString().includes("idleTimeout.start(")) {
                actionHandlers.delete(handler);
            }
        }
    }
});
