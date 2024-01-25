const {
    solid: { createSignal, onCleanup },
    plugin: { store }
} = shelter;

import { insertTimer } from "..";

function formatSeconds(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor(secs / 60) - h * 60;
    const s = Math.floor(secs - h * 3600 - m * 60);
    return (
        (h ? h.toString() + ":" : "") +
        m.toString().padStart(2, "0") +
        ":" +
        s.toString().padStart(2, "0")
    );
}

export default () => {
    const calcTime = () => Date.now() / 1_000 - store.joinTime;

    const [time, setTime] = createSignal(formatSeconds(calcTime()));

    const timer = setInterval(() => {
        setTime(formatSeconds(calcTime()));
    }, 1_000);

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
            {time() + " • "}
        </p>
    );
};
