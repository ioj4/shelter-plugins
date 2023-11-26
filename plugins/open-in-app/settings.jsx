const {
    plugin: { store },
    ui: { SwitchItem }
} = shelter;

import { apps } from ".";

export const settings = () => {
    const rows = [];
    for (const [appName, app] of Object.entries(apps)) {
        rows.push(
            <SwitchItem
                value={store.enabledApps[appName]}
                onChange={(value) => {
                    store.enabledApps[appName] = value;
                }}
                note={app.protocol}
            >
                {appName}
            </SwitchItem>
        );
    }

    return <>{rows}</>;
};
