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
    console.log(component)

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

function onContextMenu() {
    const unObserve = observeDom(SLIDER_QUERY, container => {
        unObserve();
        queueMicrotask(injectVolumeSlider.bind(null, container));
    });

    setTimeout(unObserve, 500);
}

export function onLoad() {
    dispatcher.subscribe("CONTEXT_MENU_OPEN", onContextMenu);
}

export function onUnload() {
    dispatcher.unsubscribe("CONTEXT_MENU_OPEN", onContextMenu);
}