const {
	plugin: { store },
	flux: {
		dispatcher,
		stores: { GuildMemberStore, ChannelStore, RelationshipStore, SelectedChannelStore }
	},
	util: {
		getFiber,
		reactFiberWalker
	},
	observeDom
} = shelter;

export function forceAddUsernames() {
	for (const e of document.querySelectorAll(`[id^=message-username-]`)) {
		addUsername(e);
	}
}

function addUsername(element) {
	const msg = reactFiberWalker(getFiber(element), "message", true)?.pendingProps?.message;
	if (!msg || !msg?.author) return;
	
	const { username: authorUsername, id: authorId } = msg.author
	const { type, guild_id: guildId } = ChannelStore.getChannel(msg?.channel_id);
	// type = 0: Guild, 1: DM
	const nick = type ? RelationshipStore.getNickname(authorId) : GuildMemberStore.getNick(guildId, authorId);
	
	const style = "font-weight: 600;border-radius: 5px;padding: 0 3px;background: var(--background-secondary);";
	const usernameElement = <span style={style}>{authorUsername}</span>;

	element.firstElementChild.textContent = (nick && !store.usernameOnly) ? ' ' + nick : '';
	element.firstElementChild.prepend(usernameElement);
}


function onDispatch() {
	const unObserve = observeDom(`[id^=message-username-]:not([data-ysink_su="true"])`, e => {
		unObserve();
		queueMicrotask(() => addUsername(e));
	});
	
	setTimeout(unObserve, 500);
}

function onMessage(e) {
	if (e.message.channel_id !== SelectedChannelStore.getCurrentlySelectedChannelId()) return;
	onDispatch();
}

// CHANNEL_SELECT: the user switches servers
// LOAD_MESSAGES_SUCCESS: new messages in viewport
// UPDATE_CHANNEL_DIMENSIONS: the user scrolls back down perhaps
// GUILD_MEMBER_UPDATE: nickname change
const TRIGGERS = ["CHANNEL_SELECT", "LOAD_MESSAGES_SUCCESS", "UPDATE_CHANNEL_DIMENSIONS", "GUILD_MEMBER_UPDATE"];

export function onLoad() {
	store.usernameOnly ??= false;
	for (const t of TRIGGERS) dispatcher.subscribe(t, onDispatch);
	dispatcher.subscribe("MESSAGE_CREATE", onMessage);
}

export function onUnload() {
	for (const t of TRIGGERS) dispatcher.unsubscribe(t, onDispatch);
	dispatcher.unsubscribe("MESSAGE_CREATE", onMessage);
}

export { default as settings } from "./settings"