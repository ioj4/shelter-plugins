(()=>{var D=Object.create;var o=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var O=Object.getOwnPropertyNames;var M=Object.getPrototypeOf,N=Object.prototype.hasOwnProperty;var R=(e,n)=>()=>(n||e((n={exports:{}}).exports,n),n.exports),T=(e,n)=>{for(var t in n)o(e,t,{get:n[t],enumerable:!0})},l=(e,n,t,s)=>{if(n&&typeof n=="object"||typeof n=="function")for(let r of O(n))!N.call(e,r)&&r!==t&&o(e,r,{get:()=>n[r],enumerable:!(s=I(n,r))||s.enumerable});return e};var i=(e,n,t)=>(t=e!=null?D(M(e)):{},l(n||!e||!e.__esModule?o(t,"default",{value:e,enumerable:!0}):t,e)),k=e=>l(o({},"__esModule",{value:!0}),e);var a=R((K,m)=>{m.exports=shelter.solidWeb});var W={};T(W,{forceAddUsernames:()=>u,onLoad:()=>B,onUnload:()=>H,settings:()=>f});var g=i(a()),S=i(a());var E=i(a());var{plugin:{store:p},ui:{SwitchItem:L}}=shelter,f=()=>(0,E.createComponent)(L,{get value(){return p.usernamesOnly},onChange:e=>{p.usernamesOnly=e,u()},children:"Only display usernames"});var G=(0,g.template)('<span style="font-weight: 600;border-radius: 5px;padding: 0 3px;background: var(--background-secondary);" class="ioj4-su"></span>',2),{plugin:{store:_},flux:{dispatcher:h,stores:{GuildMemberStore:P,ChannelStore:v,RelationshipStore:$,SelectedChannelStore:q}},util:{getFiber:w,reactFiberWalker:F},observeDom:j}=shelter;function u(){for(let e of document.querySelectorAll("[id^=message-username-] > [class^=username-]"))b(e,!0)}function b(e,n=!1){if(e.querySelector(".ioj4-su")&&!n)return;let t=F(w(e),"message",!0)?.pendingProps?.message;if(!t||!t?.author)return;let{username:s,id:r}=t.author,{type:U,guild_id:y}=v.getChannel(t?.channel_id),c=U?$.getNickname(r):P.getNick(y,r),z="font-weight: 600;border-radius: 5px;padding: 0 3px;background: var(--background-secondary);",x=(()=>{let d=G.cloneNode(!0);return(0,S.insert)(d,s),d})();e.textContent=c&&!_.usernamesOnly?" "+c:"",e.prepend(x)}function A(e){if(e.type==="MESSAGE_CREATE"&&e.channelId!==q.getChannelId())return;let n=j("[id^=message-username-] > [class^=username-]",t=>{n(),queueMicrotask(()=>b(t))});setTimeout(n,500)}var C=["MESSAGE_CREATE","CHANNEL_SELECT","LOAD_MESSAGES_SUCCESS","UPDATE_CHANNEL_DIMENSIONS","GUILD_MEMBER_UPDATE","USER_NOTE_LOADED","GUILD_MEMBER_PROFILE_UPDATE","USER_UPDATE"];function B(){_.usernamesOnly??=!1,u();for(let e of C)h.subscribe(e,A)}function H(){for(let e of C)h.unsubscribe(e,A)}return k(W);})();
