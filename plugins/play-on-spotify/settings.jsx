import { BUTTONS } from ".";

const {
    plugin: { store },
    ui: { SwitchItem }
} = shelter;

export default () => {
    const rows = [];
    for (const button of BUTTONS) {
        rows.push(
            <SwitchItem
                value={store[button.storeKey]}
                onChange={(value) => {
                    store[button.storeKey] = value;
                }}
            >
                {button.settingsDescription}
            </SwitchItem>
        );
    }
    return <>{rows}</>;
};
