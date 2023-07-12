const {
    plugin: { store },
    ui: { SwitchItem }
} = shelter;

export default () => (
    <>
        <SwitchItem
            value={store.matchDotSeparators}
            onChange={(v) => {
                store.matchDotSeparators = v;
            }}
        >
            <p
                style={{
                    "white-space": "pre-line"
                }}
            >
                Match dot separators in original filename\n
                <code>(myfile.rev1.png → 1678677832.png)</code>
            </p>
        </SwitchItem>
    </>
);
