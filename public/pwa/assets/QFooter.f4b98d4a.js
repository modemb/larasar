import{u as pe,a as ze}from"./use-dark.eef62c6b.js";import{Q as x,c as ye}from"./QLayout.b1ae1389.js";import{a1 as ge,a2 as M,O as Se,a3 as Ce,a4 as V,a5 as L,I as G,aT as Q,a6 as I,a7 as R,V as qe,y as ie,r as b,c as f,aP as _e,w as P,$ as we,a0 as Ee,C as ne,h as C,A as ue,K as W,g as se,a$ as Z,b0 as k,i as Pe,J as X,aV as Me,L as Te}from"./index.13c3f144.js";import{c as He,b as j}from"./ClosePopup.1bf598b3.js";const K={left:!0,right:!0,up:!0,down:!0,horizontal:!0,vertical:!0},Oe=Object.keys(K);K.all=!0;function ee(a){const i={};for(const v of Oe)a[v]===!0&&(i[v]=!0);return Object.keys(i).length===0?K:(i.horizontal===!0?i.left=i.right=!0:i.left===!0&&i.right===!0&&(i.horizontal=!0),i.vertical===!0?i.up=i.down=!0:i.up===!0&&i.down===!0&&(i.vertical=!0),i.horizontal===!0&&i.vertical===!0&&(i.all=!0),i)}const Ae=["INPUT","TEXTAREA"];function te(a,i){return i.event===void 0&&a.target!==void 0&&a.target.draggable!==!0&&typeof i.handler=="function"&&Ae.includes(a.target.nodeName.toUpperCase())===!1&&(a.qClonedBy===void 0||a.qClonedBy.indexOf(i.uid)===-1)}function Y(a,i,v){const h=I(a);let e,l=h.left-i.event.x,o=h.top-i.event.y,t=Math.abs(l),c=Math.abs(o);const s=i.direction;s.horizontal===!0&&s.vertical!==!0?e=l<0?"left":"right":s.horizontal!==!0&&s.vertical===!0?e=o<0?"up":"down":s.up===!0&&o<0?(e="up",t>c&&(s.left===!0&&l<0?e="left":s.right===!0&&l>0&&(e="right"))):s.down===!0&&o>0?(e="down",t>c&&(s.left===!0&&l<0?e="left":s.right===!0&&l>0&&(e="right"))):s.left===!0&&l<0?(e="left",t<c&&(s.up===!0&&o<0?e="up":s.down===!0&&o>0&&(e="down"))):s.right===!0&&l>0&&(e="right",t<c&&(s.up===!0&&o<0?e="up":s.down===!0&&o>0&&(e="down")));let z=!1;if(e===void 0&&v===!1){if(i.event.isFirst===!0||i.event.lastDir===void 0)return{};e=i.event.lastDir,z=!0,e==="left"||e==="right"?(h.left-=l,t=0,l=0):(h.top-=o,c=0,o=0)}return{synthetic:z,payload:{evt:a,touch:i.event.mouse!==!0,mouse:i.event.mouse===!0,position:h,direction:e,isFirst:i.event.isFirst,isFinal:v===!0,duration:Date.now()-i.event.time,distance:{x:t,y:c},offset:{x:l,y:o},delta:{x:h.left-i.event.lastX,y:h.top-i.event.lastY}}}}let $e=0;var le=ge({name:"touch-pan",beforeMount(a,{value:i,modifiers:v}){if(v.mouse!==!0&&M.has.touch!==!0)return;function h(l,o){v.mouse===!0&&o===!0?qe(l):(v.stop===!0&&Q(l),v.prevent===!0&&G(l))}const e={uid:"qvtp_"+$e++,handler:i,modifiers:v,direction:ee(v),noop:Se,mouseStart(l){te(l,e)&&Ce(l)&&(V(e,"temp",[[document,"mousemove","move","notPassiveCapture"],[document,"mouseup","end","passiveCapture"]]),e.start(l,!0))},touchStart(l){if(te(l,e)){const o=l.target;V(e,"temp",[[o,"touchmove","move","notPassiveCapture"],[o,"touchcancel","end","passiveCapture"],[o,"touchend","end","passiveCapture"]]),e.start(l)}},start(l,o){if(M.is.firefox===!0&&L(a,!0),e.lastEvt=l,o===!0||v.stop===!0){if(e.direction.all!==!0&&(o!==!0||e.modifiers.mouseAllDir!==!0&&e.modifiers.mousealldir!==!0)){const s=l.type.indexOf("mouse")!==-1?new MouseEvent(l.type,l):new TouchEvent(l.type,l);l.defaultPrevented===!0&&G(s),l.cancelBubble===!0&&Q(s),Object.assign(s,{qKeyEvent:l.qKeyEvent,qClickOutside:l.qClickOutside,qAnchorHandled:l.qAnchorHandled,qClonedBy:l.qClonedBy===void 0?[e.uid]:l.qClonedBy.concat(e.uid)}),e.initialEvent={target:l.target,event:s}}Q(l)}const{left:t,top:c}=I(l);e.event={x:t,y:c,time:Date.now(),mouse:o===!0,detected:!1,isFirst:!0,isFinal:!1,lastX:t,lastY:c}},move(l){if(e.event===void 0)return;const o=I(l),t=o.left-e.event.x,c=o.top-e.event.y;if(t===0&&c===0)return;e.lastEvt=l;const s=e.event.mouse===!0,z=()=>{h(l,s);let g;v.preserveCursor!==!0&&v.preservecursor!==!0&&(g=document.documentElement.style.cursor||"",document.documentElement.style.cursor="grabbing"),s===!0&&document.body.classList.add("no-pointer-events--children"),document.body.classList.add("non-selectable"),He(),e.styleCleanup=q=>{if(e.styleCleanup=void 0,g!==void 0&&(document.documentElement.style.cursor=g),document.body.classList.remove("non-selectable"),s===!0){const p=()=>{document.body.classList.remove("no-pointer-events--children")};q!==void 0?setTimeout(()=>{p(),q()},50):p()}else q!==void 0&&q()}};if(e.event.detected===!0){e.event.isFirst!==!0&&h(l,e.event.mouse);const{payload:g,synthetic:q}=Y(l,e,!1);g!==void 0&&(e.handler(g)===!1?e.end(l):(e.styleCleanup===void 0&&e.event.isFirst===!0&&z(),e.event.lastX=g.position.left,e.event.lastY=g.position.top,e.event.lastDir=q===!0?void 0:g.direction,e.event.isFirst=!1));return}if(e.direction.all===!0||s===!0&&(e.modifiers.mouseAllDir===!0||e.modifiers.mousealldir===!0)){z(),e.event.detected=!0,e.move(l);return}const y=Math.abs(t),m=Math.abs(c);y!==m&&(e.direction.horizontal===!0&&y>m||e.direction.vertical===!0&&y<m||e.direction.up===!0&&y<m&&c<0||e.direction.down===!0&&y<m&&c>0||e.direction.left===!0&&y>m&&t<0||e.direction.right===!0&&y>m&&t>0?(e.event.detected=!0,e.move(l)):e.end(l,!0))},end(l,o){if(e.event!==void 0){if(R(e,"temp"),M.is.firefox===!0&&L(a,!1),o===!0)e.styleCleanup!==void 0&&e.styleCleanup(),e.event.detected!==!0&&e.initialEvent!==void 0&&e.initialEvent.target.dispatchEvent(e.initialEvent.event);else if(e.event.detected===!0){e.event.isFirst===!0&&e.handler(Y(l===void 0?e.lastEvt:l,e).payload);const{payload:t}=Y(l===void 0?e.lastEvt:l,e,!0),c=()=>{e.handler(t)};e.styleCleanup!==void 0?e.styleCleanup(c):c()}e.event=void 0,e.initialEvent=void 0,e.lastEvt=void 0}}};if(a.__qtouchpan=e,v.mouse===!0){const l=v.mouseCapture===!0||v.mousecapture===!0?"Capture":"";V(e,"main",[[a,"mousedown","mouseStart",`passive${l}`]])}M.has.touch===!0&&V(e,"main",[[a,"touchstart","touchStart",`passive${v.capture===!0?"Capture":""}`],[a,"touchmove","noop","notPassiveCapture"]])},updated(a,i){const v=a.__qtouchpan;v!==void 0&&(i.oldValue!==i.value&&(typeof value!="function"&&v.end(),v.handler=i.value),v.direction=ee(i.modifiers))},beforeUnmount(a){const i=a.__qtouchpan;i!==void 0&&(i.event!==void 0&&i.end(),R(i,"main"),R(i,"temp"),M.is.firefox===!0&&L(a,!1),i.styleCleanup!==void 0&&i.styleCleanup(),delete a.__qtouchpan)}});const ae=["vertical","horizontal"],N={vertical:{offset:"offsetY",scroll:"scrollTop",dir:"down",dist:"y"},horizontal:{offset:"offsetX",scroll:"scrollLeft",dir:"right",dist:"x"}},re={prevent:!0,mouse:!0,mouseAllDir:!0},oe=a=>a>=250?50:Math.ceil(a/5);var je=ie({name:"QScrollArea",props:{...pe,thumbStyle:Object,verticalThumbStyle:Object,horizontalThumbStyle:Object,barStyle:[Array,String,Object],verticalBarStyle:[Array,String,Object],horizontalBarStyle:[Array,String,Object],contentStyle:[Array,String,Object],contentActiveStyle:[Array,String,Object],delay:{type:[String,Number],default:1e3},visible:{type:Boolean,default:null},tabindex:[String,Number],onScroll:Function},setup(a,{slots:i,emit:v}){const h=b(!1),e=b(!1),l=b(!1),o={vertical:b(0),horizontal:b(0)},t={vertical:{ref:b(null),position:b(0),size:b(0)},horizontal:{ref:b(null),position:b(0),size:b(0)}},{proxy:c}=se(),s=ze(a,c.$q);let z=null,y;const m=b(null),g=f(()=>"q-scrollarea"+(s.value===!0?" q-scrollarea--dark":""));t.vertical.percentage=f(()=>{const r=t.vertical.size.value-o.vertical.value;if(r<=0)return 0;const n=j(t.vertical.position.value/r,0,1);return Math.round(n*1e4)/1e4}),t.vertical.thumbHidden=f(()=>(a.visible===null?l.value:a.visible)!==!0&&h.value===!1&&e.value===!1||t.vertical.size.value<=o.vertical.value+1),t.vertical.thumbStart=f(()=>t.vertical.percentage.value*(o.vertical.value-t.vertical.thumbSize.value)),t.vertical.thumbSize=f(()=>Math.round(j(o.vertical.value*o.vertical.value/t.vertical.size.value,oe(o.vertical.value),o.vertical.value))),t.vertical.style=f(()=>({...a.thumbStyle,...a.verticalThumbStyle,top:`${t.vertical.thumbStart.value}px`,height:`${t.vertical.thumbSize.value}px`})),t.vertical.thumbClass=f(()=>"q-scrollarea__thumb q-scrollarea__thumb--v absolute-right"+(t.vertical.thumbHidden.value===!0?" q-scrollarea__thumb--invisible":"")),t.vertical.barClass=f(()=>"q-scrollarea__bar q-scrollarea__bar--v absolute-right"+(t.vertical.thumbHidden.value===!0?" q-scrollarea__bar--invisible":"")),t.horizontal.percentage=f(()=>{const r=t.horizontal.size.value-o.horizontal.value;if(r<=0)return 0;const n=j(Math.abs(t.horizontal.position.value)/r,0,1);return Math.round(n*1e4)/1e4}),t.horizontal.thumbHidden=f(()=>(a.visible===null?l.value:a.visible)!==!0&&h.value===!1&&e.value===!1||t.horizontal.size.value<=o.horizontal.value+1),t.horizontal.thumbStart=f(()=>t.horizontal.percentage.value*(o.horizontal.value-t.horizontal.thumbSize.value)),t.horizontal.thumbSize=f(()=>Math.round(j(o.horizontal.value*o.horizontal.value/t.horizontal.size.value,oe(o.horizontal.value),o.horizontal.value))),t.horizontal.style=f(()=>({...a.thumbStyle,...a.horizontalThumbStyle,[c.$q.lang.rtl===!0?"right":"left"]:`${t.horizontal.thumbStart.value}px`,width:`${t.horizontal.thumbSize.value}px`})),t.horizontal.thumbClass=f(()=>"q-scrollarea__thumb q-scrollarea__thumb--h absolute-bottom"+(t.horizontal.thumbHidden.value===!0?" q-scrollarea__thumb--invisible":"")),t.horizontal.barClass=f(()=>"q-scrollarea__bar q-scrollarea__bar--h absolute-bottom"+(t.horizontal.thumbHidden.value===!0?" q-scrollarea__bar--invisible":""));const q=f(()=>t.vertical.thumbHidden.value===!0&&t.horizontal.thumbHidden.value===!0?a.contentStyle:a.contentActiveStyle),p=[[le,r=>{$(r,"vertical")},void 0,{vertical:!0,...re}]],_=[[le,r=>{$(r,"horizontal")},void 0,{horizontal:!0,...re}]];function T(){const r={};return ae.forEach(n=>{const d=t[n];r[n+"Position"]=d.position.value,r[n+"Percentage"]=d.percentage.value,r[n+"Size"]=d.size.value,r[n+"ContainerSize"]=o[n].value}),r}const H=_e(()=>{const r=T();r.ref=c,v("scroll",r)},0);function O(r,n,d){if(ae.includes(r)===!1){console.error("[QScrollArea]: wrong first param of setScrollPosition (vertical/horizontal)");return}(r==="vertical"?Z:k)(m.value,n,d)}function A({height:r,width:n}){let d=!1;o.vertical.value!==r&&(o.vertical.value=r,d=!0),o.horizontal.value!==n&&(o.horizontal.value=n,d=!0),d===!0&&B()}function u({position:r}){let n=!1;t.vertical.position.value!==r.top&&(t.vertical.position.value=r.top,n=!0),t.horizontal.position.value!==r.left&&(t.horizontal.position.value=r.left,n=!0),n===!0&&B()}function S({height:r,width:n}){t.horizontal.size.value!==n&&(t.horizontal.size.value=n,B()),t.vertical.size.value!==r&&(t.vertical.size.value=r,B())}function $(r,n){const d=t[n];if(r.isFirst===!0){if(d.thumbHidden.value===!0)return;y=d.position.value,e.value=!0}else if(e.value!==!0)return;r.isFinal===!0&&(e.value=!1);const E=N[n],D=o[n].value,he=(d.size.value-D)/(D-d.thumbSize.value),me=r.distance[E.dist],be=y+(r.direction===E.dir?1:-1)*me*he;J(be,n)}function U(r,n){const d=t[n];if(d.thumbHidden.value!==!0){const E=r[N[n].offset];if(E<d.thumbStart.value||E>d.thumbStart.value+d.thumbSize.value){const D=E-d.thumbSize.value/2;J(D/o[n].value*d.size.value,n)}d.ref.value!==null&&d.ref.value.dispatchEvent(new MouseEvent(r.type,r))}}function ce(r){U(r,"vertical")}function ve(r){U(r,"horizontal")}function B(){h.value=!0,z!==null&&clearTimeout(z),z=setTimeout(()=>{z=null,h.value=!1},a.delay),a.onScroll!==void 0&&H()}function J(r,n){m.value[N[n].scroll]=r}let w=null;function de(){w!==null&&clearTimeout(w),w=setTimeout(()=>{w=null,l.value=!0},c.$q.platform.is.ios?50:0)}function fe(){w!==null&&(clearTimeout(w),w=null),l.value=!1}let F=null;return P(()=>c.$q.lang.rtl,r=>{m.value!==null&&k(m.value,Math.abs(t.horizontal.position.value)*(r===!0?-1:1))}),we(()=>{F={top:t.vertical.position.value,left:t.horizontal.position.value}}),Ee(()=>{if(F===null)return;const r=m.value;r!==null&&(k(r,F.left),Z(r,F.top))}),ne(H.cancel),Object.assign(c,{getScrollTarget:()=>m.value,getScroll:T,getScrollPosition:()=>({top:t.vertical.position.value,left:t.horizontal.position.value}),getScrollPercentage:()=>({top:t.vertical.percentage.value,left:t.horizontal.percentage.value}),setScrollPosition:O,setScrollPercentage(r,n,d){O(r,n*(t[r].size.value-o[r].value)*(r==="horizontal"&&c.$q.lang.rtl===!0?-1:1),d)}}),()=>C("div",{class:g.value,onMouseenter:de,onMouseleave:fe},[C("div",{ref:m,class:"q-scrollarea__container scroll relative-position fit hide-scrollbar",tabindex:a.tabindex!==void 0?a.tabindex:void 0},[C("div",{class:"q-scrollarea__content absolute",style:q.value},ue(i.default,[C(x,{debounce:0,onResize:S})])),C(ye,{axis:"both",onScroll:u})]),C(x,{debounce:0,onResize:A}),C("div",{class:t.vertical.barClass.value,style:[a.barStyle,a.verticalBarStyle],"aria-hidden":"true",onMousedown:ce}),C("div",{class:t.horizontal.barClass.value,style:[a.barStyle,a.horizontalBarStyle],"aria-hidden":"true",onMousedown:ve}),W(C("div",{ref:t.vertical.ref,class:t.vertical.thumbClass.value,style:t.vertical.style.value,"aria-hidden":"true"}),p),W(C("div",{ref:t.horizontal.ref,class:t.horizontal.thumbClass.value,style:t.horizontal.style.value,"aria-hidden":"true"}),_)])}}),Le=ie({name:"QFooter",props:{modelValue:{type:Boolean,default:!0},reveal:Boolean,bordered:Boolean,elevated:Boolean,heightHint:{type:[String,Number],default:50}},emits:["reveal","focusin"],setup(a,{slots:i,emit:v}){const{proxy:{$q:h}}=se(),e=Pe(Te,X);if(e===X)return console.error("QFooter needs to be child of QLayout"),X;const l=b(parseInt(a.heightHint,10)),o=b(!0),t=b(Me.value===!0||e.isContainer.value===!0?0:window.innerHeight),c=f(()=>a.reveal===!0||e.view.value.indexOf("F")!==-1||h.platform.is.ios&&e.isContainer.value===!0),s=f(()=>e.isContainer.value===!0?e.containerHeight.value:t.value),z=f(()=>{if(a.modelValue!==!0)return 0;if(c.value===!0)return o.value===!0?l.value:0;const u=e.scroll.value.position+s.value+l.value-e.height.value;return u>0?u:0}),y=f(()=>a.modelValue!==!0||c.value===!0&&o.value!==!0),m=f(()=>a.modelValue===!0&&y.value===!0&&a.reveal===!0),g=f(()=>"q-footer q-layout__section--marginal "+(c.value===!0?"fixed":"absolute")+"-bottom"+(a.bordered===!0?" q-footer--bordered":"")+(y.value===!0?" q-footer--hidden":"")+(a.modelValue!==!0?" q-layout--prevent-focus"+(c.value!==!0?" hidden":""):"")),q=f(()=>{const u=e.rows.value.bottom,S={};return u[0]==="l"&&e.left.space===!0&&(S[h.lang.rtl===!0?"right":"left"]=`${e.left.size}px`),u[2]==="r"&&e.right.space===!0&&(S[h.lang.rtl===!0?"left":"right"]=`${e.right.size}px`),S});function p(u,S){e.update("footer",u,S)}function _(u,S){u.value!==S&&(u.value=S)}function T({height:u}){_(l,u),p("size",u)}function H(){if(a.reveal!==!0)return;const{direction:u,position:S,inflectionPoint:$}=e.scroll.value;_(o,u==="up"||S-$<100||e.height.value-s.value-S-l.value<300)}function O(u){m.value===!0&&_(o,!0),v("focusin",u)}P(()=>a.modelValue,u=>{p("space",u),_(o,!0),e.animate()}),P(z,u=>{p("offset",u)}),P(()=>a.reveal,u=>{u===!1&&_(o,a.modelValue)}),P(o,u=>{e.animate(),v("reveal",u)}),P([l,e.scroll,e.height],H),P(()=>h.screen.height,u=>{e.isContainer.value!==!0&&_(t,u)});const A={};return e.instances.footer=A,a.modelValue===!0&&p("size",l.value),p("space",a.modelValue),p("offset",z.value),ne(()=>{e.instances.footer===A&&(e.instances.footer=void 0,p("size",0),p("offset",0),p("space",!1))}),()=>{const u=ue(i.default,[C(x,{debounce:0,onResize:T})]);return a.elevated===!0&&u.push(C("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),C("footer",{class:g.value,style:q.value,onFocusin:O},u)}}});export{je as Q,le as T,Le as a,ee as g,te as s};
