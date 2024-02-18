const {
    plugin: { store }
} = shelter;
import { open, queue, play } from "../spotify";

import { Open, Queue, Play } from "./icons";
import classes from "../styles.jsx.scss";

export default function ({ url }) {
    return (
        <div class={classes.container}>
            <button title="Open in Spotify" onClick={() => open(url)}>
                <Open />
            </button>
            <button title="Add to queue" onClick={() => queue(url)}>
                <Queue />
            </button>
            <button title="Play in Spotify" onClick={() => play(url)}>
                <Play />
            </button>
        </div>
    );
}
