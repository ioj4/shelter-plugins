const {
    solid: { createSignal, onCleanup },
    plugin: { store }
} = shelter;

import { insertTimer } from "..";

function toTimeString(secs) {
    const h = Math.floor(secs / 3_600);
    const m = Math.floor(secs / 60) - h * 60;
    const s = Math.floor(secs - h * 3_600 - m * 60);
    return (
        (h ? h.toString() + ":" : "") +
        m.toString().padStart(2, "0") +
        ":" +
        s.toString().padStart(2, "0")
    );
}

export default () => {
    const getDuration = () => (Date.now() - store.joinTime) / 1_000;

    const [time, setTime] = createSignal(toTimeString(getDuration()));

    const timer = setInterval(
        () => setTime(toTimeString(getDuration())),
        1_000
    );

    // attempt to reinject the timer if it gets removed due to a rerender (channel name change, etc)
    onCleanup(() => {
        clearInterval(timer);
        insertTimer();
    });

    return (
        <p
            style={{
                display: "inline",
                "font-family": "monospace"
            }}
        >
            {time()}
        </p>
    );
};
