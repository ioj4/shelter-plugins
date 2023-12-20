const {
    plugin: { store },
    flux: { dispatcher, awaitStore },
    util: { getFiber, reactFiberWalker },
    observeDom
} = shelter;

const USERNAME_QUERY = '[id^="message-username-"] > [class^="username"]';

export function forceAddUsernames() {
    for (const e of document.querySelectorAll(USERNAME_QUERY)) {
        addUsername(e, true);
    }
}

async function addUsername(e, overwrite = false) {
    if (e.querySelector(".ioj4-su") && !overwrite) return;

    const msg = reactFiberWalker(getFiber(e), "message", true)?.pendingProps
        ?.message;
    if (!msg || !msg?.author) return;

    const channelStore = await awaitStore("ChannelStore");
    const guildMemberStore = await awaitStore("GuildMemberStore");
    const relationshipStore = await awaitStore("RelationshipStore");

    const { username: authorUsername, id: authorId } = msg.author;
    const { type: channelType, guild_id: guildId } = channelStore.getChannel(
        msg?.channel_id
    );

    // type = 0: Guild, 1: DM
    const nickname = channelType
        ? relationshipStore.getNickname(authorId)
        : guildMemberStore.getNick(guildId, authorId);

    const style =
        "font-weight: 600;border-radius: 5px;padding: 0 3px;background: var(--background-secondary);";
    const usernameElement = (
        <span style={style} className={"ioj4-su"}>
            {authorUsername}
        </span>
    );

    e.textContent = nickname && !store.usernamesOnly ? ` ${nickname}` : "";
    e.prepend(usernameElement);
}

async function onDispatch(payload) {
    // ignore MESSAGE_CREATEs from other channels
    const selectedChannelStore = await awaitStore("SelectedChannelStore");
    if (
        payload.type === "MESSAGE_CREATE" &&
        payload.channelId !== selectedChannelStore.getChannelId()
    ) {
        return;
    }

    const unObserve = observeDom(USERNAME_QUERY, (e) => {
        unObserve();
        addUsername(e);
    });

    // don't leave this forever, just in case!
    setTimeout(unObserve, 500);
}

// MESSAGE_CREATE: new message somewhere
// CHANNEL_SELECT: the user switches servers
// LOAD_MESSAGES_SUCCESS: new messages in viewport
// UPDATE_CHANNEL_DIMENSIONS: the user scrolls back down perhaps
// GUILD_MEMBER_UPDATE: nickname change
const TRIGGERS = [
    "MESSAGE_CREATE",
    "CHANNEL_SELECT",
    "LOAD_MESSAGES_SUCCESS",
    "UPDATE_CHANNEL_DIMENSIONS",
    "GUILD_MEMBER_UPDATE",
    "USER_NOTE_LOADED",
    "GUILD_MEMBER_PROFILE_UPDATE",
    "USER_UPDATE"
];

export function onLoad() {
    store.usernamesOnly ??= false;
    // apply on usernames that are already in the DOM
    forceAddUsernames();
    for (const t of TRIGGERS) dispatcher.subscribe(t, onDispatch);
}

export function onUnload() {
    for (const t of TRIGGERS) dispatcher.unsubscribe(t, onDispatch);
}

export { default as settings } from "./settings";
