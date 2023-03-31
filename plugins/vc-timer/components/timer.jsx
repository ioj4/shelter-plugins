const {
    solid: { createSignal, onCleanup }
} = shelter;

import { classes } from "./timer.jsx.scss";

function formatSeconds(secs) {
    const pad = (n) => (n < 10 ? `0${n}` : n ? n : "00");
    const padH = (n) => (!n ? "" : pad(n) + ":");

    const h = Math.floor(secs / 3600);
    const m = Math.floor(secs / 60) - h * 60;
    const s = Math.floor(secs - h * 3600 - m * 60);
    return `${padH(h)}${h ? pad(m) : m}:${pad(s)}`;
}

export default () => {
    const startTime = Date.now();
    const [time, setTime] = createSignal(formatSeconds(0));

    const timer = setInterval(() => {
        const secs = (Date.now() - startTime) / 1000;
        setTime(formatSeconds(secs));
    }, 1_000);

    onCleanup(() => clearInterval(timer));

    return (
        <p class={classes.time} style={"margin: 0;"}>
            {time()}&nbsp;•&nbsp;
        </p>
    );
};
