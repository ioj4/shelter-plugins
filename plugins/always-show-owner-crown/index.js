const {
    util: { getFiber, reactFiberWalker },
    flux: {
        stores: { GuildStore }
    },
    observeDom,
    patcher
} = shelter;

const memberSelector = `[class^="member-"][role="listitem"]`;

function rerenderAllMembers() {
    document.querySelectorAll(memberSelector).forEach((memberElement) => {
        const fiber = getFiber(memberElement);
        fiber.memoizedProps.onMouseEnter();
        setTimeout(fiber.memoizedProps.onMouseLeave);
    });
}

let unpatch;
function patchMember(memberElement) {
    const fiber = getFiber(memberElement);
    const component = reactFiberWalker(
        fiber,
        (c) => !!c?.type?.prototype?.renderOwner,
        true
    );
    unpatch = patcher.instead(
        "renderOwner",
        component.type.prototype,
        function (args, originalFunction) {
            const guild = GuildStore.getGuild(this.props.guildId);
            if (!this.props.isOwner && guild.isOwner(this.props.user.id)) {
                // we only want to change the value temporarily
                this.props.isOwner = true;
                const returnValue = originalFunction(args);
                this.props.isOwner = false;
                return returnValue;
            } else {
                return originalFunction(args);
            }
        }
    );
    rerenderAllMembers();
}

let unObserve;
function observeForMember() {
    let isUnpatched = true;
    unObserve = observeDom(memberSelector, (memberElement) => {
        // prevent patching multiple times
        if (isUnpatched) {
            isUnpatched = false;
            unObserve();
            queueMicrotask(patchMember.bind(null, memberElement));
        }
    });
}

export const onLoad = observeForMember;

export function onUnload() {
    unObserve?.();
    unpatch?.();
    rerenderAllMembers();
}
