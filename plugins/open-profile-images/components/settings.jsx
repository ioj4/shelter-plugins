const {
	plugin: { store },
	ui: { SwitchItem }
} = shelter;

export default () => (
  	<>
    	<SwitchItem value={store.fullResolution} onChange={v => { store.fullResolution = v }}>
	    	Display images in their full resolution
    	</SwitchItem>
  	</>
);