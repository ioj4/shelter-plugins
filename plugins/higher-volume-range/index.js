const {
    flux: { dispatcher },
    observeDom
} = shelter;

const SLIDER_QUERY = `[class*="sliderContainer-"]`;

function injectVolumeSlider(container) {
    const component = shelter.util.reactFiberWalker(
      shelter.util.getFiber(container),
      "aria-label",
      true,
      true
    )?.type;

    if (!component || typeof component.render !== "function") return;

    shelter.patcher.before(
        "render",
        component,
        (originalArgs) => {
            if (originalArgs[0]?.maxValue && originalArgs[0]?.maxValue !== 400) {
                originalArgs[0].maxValue = 400;
            }
            return originalArgs;
        },
        false
    );

    dispatcher.unsubscribe("CONTEXT_MENU_OPEN", onContextMenu);
}

function onContextMenu(payload) {
    const unObserve = observeDom(SLIDER_QUERY, container => {
        unObserve();
        queueMicrotask(() => { 
            injectVolumeSlider(container);
            // reopen context-menu to trigger render with new maxValue
            dispatcher.dispatch({type: "CONTEXT_MENU_CLOSE"});
            dispatcher.dispatch(payload);
        });
    });

    setTimeout(unObserve, 500);
}

export function onLoad() {
    dispatcher.subscribe("CONTEXT_MENU_OPEN", onContextMenu);
}

export function onUnload() {
    dispatcher.unsubscribe("CONTEXT_MENU_OPEN", onContextMenu);
}