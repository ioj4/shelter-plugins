(()=>{var l=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var _=Object.getOwnPropertyNames;var x=Object.prototype.hasOwnProperty;var y=(e,t)=>{for(var o in t)l(e,o,{get:t[o],enumerable:!0})},T=(e,t,o,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of _(t))!x.call(e,s)&&s!==o&&l(e,s,{get:()=>t[s],enumerable:!(r=I(t,s))||r.enumerable});return e};var j=e=>T(l({},"__esModule",{value:!0}),e);var L={};y(L,{onUnload:()=>K});var u=()=>shelter.flux.stores.UserStore.getCurrentUser(),i,a=()=>{i||(i=u().premiumType,u().premiumType=2)},d=()=>{i!==void 0&&(u().premiumType=i,i=void 0)};var{plugin:{store:p},flux:{stores:{SelectedGuildStore:N,EmojiStore:v}}}=shelter,C=()=>!!document.querySelector('[data-list-item-id="guildsnav___home"][class*="selected"]'),z=()=>Number.isSafeInteger(parseInt(p.size))?p.size:64,f=e=>{let t=[],o=[];for(let r of e){let s=[];for(let n of r.children){if(n.emoji){let c=v.getCustomEmojiById(n.emoji.emojiId);if(c.guildId!==N.getLastSelectedGuildId()||c.animated||C()){t.push(`${c.url.split("?")[0]}?size=${z()}`);continue}}s.push(n)}o.push({type:"line",children:s})}for(let r of t)o.push({type:"line",children:[{text:r}]});return o};var{flux:{dispatcher:h},plugin:{store:m},observeDom:b}=shelter;m.size===void 0&&(m.size=64);function S(e){let t=(o,r)=>{if(e.event===o){a();let s=b(r,n=>{n.isConnected||(setTimeout(()=>d(),5e3),s())})}};t("expression_picker_opened","#emoji-picker-tab-panel"),t("channel_autocomplete_open","[class*=autocomplete]")}var g=!1,k=e=>{if(e.dataset.YSINK_FM)return;e.dataset.YSINK_FM="1";let o=e.__reactFiber$.child.pendingProps.editor;e.onkeydown=r=>{g||r.key==="Enter"&&!document.querySelector("[class*=autocomplete]")&&(o.children=f(o.children))}},E=b('[class*="slateContainer-"]',e=>{k(e)});h.subscribe("TRACK",S);var K=()=>{h.unsubscribe("TRACK",S),E(),g=!0};return j(L);})();