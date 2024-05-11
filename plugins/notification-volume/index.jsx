const {
    ui: { Slider, Header },
    plugin: { store, scoped },
    patcher
} = shelter;

import classes from "./styles.jsx.scss";

let audio;

export function onLoad() {
    store.volume ??= 100;

    scoped.patcher.after("Audio", window, (args, res) => {
        patcher.before("play", res, function () {
            this.volume = store.volume / 100;
        });
    });

    audio = new Audio();
    // Message notification sound
    audio.src = "/assets/9422aef94aa931248105.mp3";
}

function playPreview() {
    audio.currentTime = 0;
    audio.play();
}

export const settings = () => (
    <div class={classes.container}>
        <Header class={classes.header}>
            Volume of notifications and sounds
        </Header>
        <Slider
            min={0}
            max={100}
            value={store.volume}
            step={5}
            tick
            onInput={(v) => {
                store.volume = v;
                playPreview();
            }}
        />
    </div>
);
