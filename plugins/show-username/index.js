const {
	plugin: { store },
	flux: {
		dispatcher,
		stores: { GuildMemberStore, ChannelStore, RelationshipStore }
	},
	util: {
		getFiber,
		reactFiberWalker
	},
	observeDom
} = shelter;

export function addUsernames(overwrite) {
	for (const e of document.querySelectorAll("[id^=message-username-]")) {
		if (e?.dataset?.YSINK_SU && !overwrite) continue;
		e.dataset.YSINK_SU = true;

		const msg = reactFiberWalker(getFiber(e), "message", true).pendingProps?.message;
		const authorUsername = msg.author?.username;
		const authorId = msg?.author?.id;
		const { type, guild_id: guildId } = ChannelStore.getChannel(msg?.channel_id);
		// type = 0: Guild, 1: DM
		const nick = type ? RelationshipStore.getNickname(authorId) : GuildMemberStore.getNick(guildId, authorId);

		if (!authorUsername) continue;

		const usernameElement = document.createElement("span");
		usernameElement.textContent = authorUsername;
		usernameElement.style = `font-weight: 600;border-radius: 5px;padding-left: 3px;padding-right: 3px;background: var(--background-secondary);`

		e.firstElementChild.textContent = nick && !store.usernameOnly ? ' ' + nick : '';
		e.firstElementChild.prepend(usernameElement);
	}
}

// MESSAGE_CREATE: a new message is sent
// CHANNEL_SELECT: the user switches servers
// LOAD_MESSAGES_SUCCESS: new messages in viewport
// UPDATE_CHANNEL_DIMENSIONS: the user scrolls back down perhaps
const TRIGGERS = ["MESSAGE_CREATE", "CHANNEL_SELECT", "LOAD_MESSAGES_SUCCESS", "UPDATE_CHANNEL_DIMENSIONS"];

function onDispatch() {
	const unObserve = observeDom("[id^=message-username-]", () => {
		unObserve();
		queueMicrotask(addUsernames);
	});

	// maybe that message was created in another server? don't leave this forever.
	setTimeout(unObserve, 500);
}

export function onLoad() {
	store.usernameOnly = store.usernameOnly ?? false;

	for (const t of TRIGGERS) dispatcher.subscribe(t, onDispatch);
}

export function onUnload() {
	for (const t of TRIGGERS) dispatcher.unsubscribe(t, onDispatch);
}

export {default as settings} from "./settings"