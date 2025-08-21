const {
    plugin: { store },
    ui: { tooltip, showToast, ToastColors },
    solid: { Show },
    util: { log }
} = shelter;

import { BUTTONS } from "..";
import classes from "../styles.jsx.scss";

false || tooltip;

export default function ({ item }) {
    const rows = [];
    for (const button of BUTTONS) {
        rows.push(
            <Show
                when={
                    store[button.storeKey] &&
                    (!button.allowedTypes ||
                        button.allowedTypes.includes(item.type))
                }
            >
                <button
                    use:tooltip={button.tooltip}
                    onClick={(e) => {
                        const el = e.currentTarget;
                        el.style.color = "var(--interactive-active, #fbfbfb)";
                        button.action(item).then(
                            () => {
                                el.style.color = "#1bc357";
                                setTimeout(() => (el.style.color = ""), 800);
                            },
                            (err) => {
                                el.style.color = "#da3e44";
                                setTimeout(() => (el.style.color = ""), 800);
                                log(
                                    `[play-on-spotify] ${err.message}`,
                                    "error"
                                );
                                showToast({
                                    title: "Couldn't perform action",
                                    content: err.message,
                                    duration: 8_000,
                                    class: ToastColors.CRITICAL
                                });
                            }
                        );
                    }}
                >
                    <button.icon />
                </button>
            </Show>
        );
    }
    return (
        <div className={`ioj4-pos-buttons ${classes.container}`}>{rows}</div>
    );
}
