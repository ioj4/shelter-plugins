const {
	plugin: { store },
	ui: { SwitchItem }
} = shelter;

import { forceAddUsernames } from "./index"

export default () => (
  	<>
    	<SwitchItem value={store.usernamesOnly} onChange={(v) => { store.usernamesOnly = v; forceAddUsernames(); }}>
	    	Only display usernames
    	</SwitchItem>
  	</>
);