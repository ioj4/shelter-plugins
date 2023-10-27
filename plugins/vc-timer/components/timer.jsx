const {
    solid: { createSignal, onCleanup }
} = shelter;

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
    const startTime = Date.now();
    const [time, setTime] = createSignal(formatSeconds(0));

    const timer = setInterval(() => {
        const secs = (Date.now() - startTime) / 1_000;
        setTime(formatSeconds(secs));
    }, 1_000);

    onCleanup(() => clearInterval(timer));

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
