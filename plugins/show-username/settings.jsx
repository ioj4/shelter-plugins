const {
	plugin: { store },
	ui: { SwitchItem }
} = shelter;

import { forceAddUsernames } from "./index"

export default () => (
  	<>
    	<SwitchItem value={store.usernameOnly} onChange={(v) => { store.usernameOnly = v; forceAddUsernames(); }}>
	    	Display the username only
    	</SwitchItem>
  	</>
);