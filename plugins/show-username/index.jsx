const {
    plugin: { scoped, store },
    flux: { awaitStore },
    util: { getFiber, reactFiberWalker }
} = shelter;

const USERNAME_QUERY = '[id^="message-username-"] > [class^="username"]';

export function forceAddUsernames() {
    for (const e of document.querySelectorAll(USERNAME_QUERY)) {
        addUsername(e, true);
    }
}

function addUsername(e, overwrite = false) {
    if (e.querySelector(".ioj4-su") && !overwrite) return;

    const props = reactFiberWalker(getFiber(e), "message", true)?.pendingProps;
    if (!props?.author || !props?.message) return;

    const { nick } = props.author;
    const { username } = props.message.author;

    const style =
        "font-weight: 600;border-radius: 4px;padding: 0 4px;background: var(--background-secondary);";
    const usernameElement = (
        <span style={style} className={"ioj4-su"}>
            {username}
        </span>
    );

    const appendNick = nick && !store.usernamesOnly && username !== nick;
    e.textContent = appendNick ? ` ${nick}` : ``;
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

    const unobserve = scoped.observeDom(USERNAME_QUERY, (e) => {
        unobserve();
        addUsername(e);
    });

    // don't leave this forever, just in case!
    setTimeout(unobserve, 500);
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
    for (const t of TRIGGERS) scoped.flux.subscribe(t, onDispatch);
}

export { default as settings } from "./settings";
