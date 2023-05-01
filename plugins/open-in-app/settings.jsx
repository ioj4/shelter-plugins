const {
    plugin: { store },
    ui: { SwitchItem }
} = shelter;

import { apps } from ".";

export const settings = () => {
    const rows = [];
    for (const app of apps) {
        rows.push(
            <SwitchItem
                value={store.enabledApps[app.name]}
                onChange={(value) => {
                    store.enabledApps[app.name] = value;
                }}
            >
                {`${app.name} Protocol`}
            </SwitchItem>
        );
    }

    return <>{rows}</>;
};
