const {
	flux: { dispatcher },
	observeDom,
	util: { awaitDispatch, getFiber, reactFiberWalker },
	patcher
} = shelter;

// only sliders in user-popouts and stream-popouts
const SLIDER_QUERY = `[class*="sliderContainer-"]`;

let unpatch;

function injectVolumeSlider(container) {
	const fiber = getFiber(container);
	const component = reactFiberWalker(fiber, "maxValue", true, true)?.type;
	if (!component || typeof component.render !== "function") return;

	const props = fiber?.pendingProps?.children?.props;
	// get volume from slider else 100 (default)
	const userVolume = props?.initialValue ?? 100;
	const { onValueChange } = props;

	// triggers a "AUDIO_SET_LOCAL_VOLUME" dispatch
	// we need this later else the rerender won't trigger
	// (the value needs to be updated for rerender)
	onValueChange(userVolume - 1);

	unpatch = patcher.before(
		"render",
		component,
		(args) => {
			args[0].maxValue *= 2;
			return args;
		},
		false
	);

	// re-set volume to trigger rerender with the patch
	// need to wait until previous change was dispatched else react won't notice it
	awaitDispatch("AUDIO_SET_LOCAL_VOLUME").then(() =>
		onValueChange(userVolume)
	);
	dispatcher.unsubscribe("CONTEXT_MENU_OPEN", onContextMenu);
}

function onContextMenu() {
	const unObserve = observeDom(SLIDER_QUERY, (container) => {
		unObserve();
		queueMicrotask(() => {
			injectVolumeSlider(container);
		});
	});

	setTimeout(unObserve, 500);
}

export function onLoad() {
	dispatcher.subscribe("CONTEXT_MENU_OPEN", onContextMenu);
}

export function onUnload() {
	dispatcher.unsubscribe("CONTEXT_MENU_OPEN", onContextMenu);
	unpatch && unpatch();
}
