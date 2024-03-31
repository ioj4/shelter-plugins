const {
    plugin: { scoped, store },
    util: { getFiber, reactFiberWalker }
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

export function onLoad() {
    store.usernamesOnly ??= false;
    // apply on usernames that are already in the DOM
    forceAddUsernames();

    // using a long living observeDom here because awaiting dispatches is a bit slower and
    // adds excessive complexity for what it's worth
    scoped.observeDom(USERNAME_QUERY, (e) => {
        queueMicrotask(() => {
            addUsername(e);
        });
    });
}

export { default as settings } from "./settings";
