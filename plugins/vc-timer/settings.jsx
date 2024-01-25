const {
    plugin: { store },
    ui: { SwitchItem }
} = shelter;

export const settings = () => (
    <SwitchItem
        value={store.persistTime}
        onChange={(v) => (store.persistTime = v)}
        note={"Time resets after 10 seconds of not being in a voice channel"}
    >
        Persist time across channel moves
    </SwitchItem>
);
