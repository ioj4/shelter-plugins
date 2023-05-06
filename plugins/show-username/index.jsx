const {
    plugin: { store },
    flux: { dispatcher, awaitStore },
    util: { getFiber, reactFiberWalker },
    observeDom
} = shelter;

export function forceAddUsernames() {
    for (const e of document.querySelectorAll(
        "[id^=message-username-] > [class^=username-]"
    )) {
        addUsername(e, true);
    }
}

async function addUsername(element, overwrite = false) {
    if (element.querySelector(".ioj4-su") && !overwrite) return;
    const msg = reactFiberWalker(getFiber(element), "message", true)
        ?.pendingProps?.message;
    if (!msg || !msg?.author) return;
    const channelStore = await awaitStore("ChannelStore");
    const { username: authorUsername, id: authorId } = msg.author;
    const { type, guild_id: guildId } = channelStore.getChannel(
        msg?.channel_id
    );
    const guildMemberStore = await awaitStore("GuildMemberStore");
    const relationshipStore = await awaitStore("RelationshipStore");
    // type = 0: Guild, 1: DM
    const nick = type
        ? relationshipStore.getNickname(authorId)
        : guildMemberStore.getNick(guildId, authorId);

    const style =
        "font-weight: 600;border-radius: 5px;padding: 0 3px;background: var(--background-secondary);";
    const usernameElement = (
        <span style={style} className={"ioj4-su"}>
            {authorUsername}
        </span>
    );

    element.textContent = nick && !store.usernamesOnly ? ` ${nick}` : "";
    element.prepend(usernameElement);
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

    const unObserve = observeDom(
        "[id^=message-username-] > [class^=username-]",
        (e) => {
            unObserve();
            queueMicrotask(() => addUsername(e));
        }
    );

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
    // if names are already rendered
    forceAddUsernames();
    for (const t of TRIGGERS) dispatcher.subscribe(t, onDispatch);
}

export function onUnload() {
    for (const t of TRIGGERS) dispatcher.unsubscribe(t, onDispatch);
}

export { default as settings } from "./settings";
