import{K as P,E as y,Q as x,w as b}from"./QCheckbox.b8d0cf70.js";import{y as Q,r as p,c as h,w as j,aj as C,h as k,g as M}from"./index.08e86ffb.js";var E=Q({name:"QPopupProxy",props:{...P,breakpoint:{type:[String,Number],default:450}},emits:["show","hide"],setup(a,{slots:g,emit:c,attrs:v}){const{proxy:u}=M(),{$q:l}=u,n=p(!1),t=p(null),i=h(()=>parseInt(a.breakpoint,10)),{canShow:f}=y({showing:n});function r(){return l.screen.width<i.value||l.screen.height<i.value?"dialog":"menu"}const o=p(r()),m=h(()=>o.value==="menu"?{maxHeight:"99vh"}:{});j(()=>r(),e=>{n.value!==!0&&(o.value=e)});function d(e){n.value=!0,c("show",e)}function w(e){n.value=!1,o.value=r(),c("hide",e)}return Object.assign(u,{show(e){f(e)===!0&&t.value.show(e)},hide(e){t.value.hide(e)},toggle(e){t.value.toggle(e)}}),C(u,"currentComponent",()=>({type:o.value,ref:t.value})),()=>{const e={ref:t,...m.value,...v,onShow:d,onHide:w};let s;return o.value==="dialog"?s=x:(s=b,Object.assign(e,{target:a.target,contextMenu:a.contextMenu,noParentEvent:!0,separateClosePopup:!0})),k(s,e,g.default)}}});export{E as Q};
