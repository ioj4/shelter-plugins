(()=>{var r=Object.defineProperty;var S=Object.getOwnPropertyDescriptor;var d=Object.getOwnPropertyNames;var l=Object.prototype.hasOwnProperty;var m=(e,t)=>{for(var n in t)r(e,n,{get:t[n],enumerable:!0})},E=(e,t,n,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of d(t))!l.call(e,o)&&o!==n&&r(e,o,{get:()=>t[o],enumerable:!(s=S(t,o))||s.enumerable});return e};var f=e=>E(r({},"__esModule",{value:!0}),e);var U={};m(U,{onLoad:()=>A,onUnload:()=>I});var{flux:{dispatcher:i,stores:{GuildMemberStore:h,ChannelStore:g,RelationshipStore:C}},util:{getFiber:N,reactFiberWalker:b},observeDom:_}=shelter;function p(){for(let e of document.querySelectorAll("[id^=message-username-]")){if(e?.dataset?.YSINK_SU)continue;e.dataset.YSINK_SU=!0;let t=b(N(e),"message",!0).pendingProps?.message,n=t.author?.username,s=t?.author?.id,{type:o,guildId:u}=g.getChannel(t?.channel_id);!(o?C.getNickname(s):h.getNick(u,s))||!n||(e.firstElementChild.textContent+=` (${n})`)}}var a=["MESSAGE_CREATE","CHANNEL_SELECT","LOAD_MESSAGES_SUCCESS","UPDATE_CHANNEL_DIMENSIONS"];function c(){let e=_("[id^=message-username-]",()=>{e(),queueMicrotask(p)});setTimeout(e,500)}function A(){for(let e of a)i.subscribe(e,c)}function I(){for(let e of a)i.unsubscribe(e,c)}return f(U);})();
