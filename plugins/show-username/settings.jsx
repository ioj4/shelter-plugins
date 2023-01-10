const {
	plugin: { store },
	ui: { SwitchItem }
} = shelter;

export default () => (
  <>
    <SwitchItem value={store.usernameOnly} onChange={(v) => store.usernameOnly = v}>
	    Display the username only
    </SwitchItem>
  </>
);