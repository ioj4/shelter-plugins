const {
	plugin: { store },
	ui: { SwitchItem }
} = shelter;

import { addUsernames } from "./index"

export default () => (
  <>
    <SwitchItem value={store.usernameOnly} onChange={(v) => { store.usernameOnly = v; addUsernames(true); }}>
	    Display the username only
    </SwitchItem>
  </>
);