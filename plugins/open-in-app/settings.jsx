const {
    plugin: { store },
    ui: { SwitchItem }
} = shelter;

import { apps } from ".";

export const settings = () => {
    const rows = [];
    for (const appName of Object.keys(apps)) {
        rows.push(
            <SwitchItem
                value={store.enabledApps[appName]}
                onChange={(value) => {
                    store.enabledApps[appName] = value;
                }}
            >
                {`${appName} Protocol`}
            </SwitchItem>
        );
    }

    return <>{rows}</>;
};
