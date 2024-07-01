import{aw as ze,y as ye,ax as Ue,c as h,h as g,ay as Pe,g as ie,r as C,aK as Fe,au as ke,ap as Ae,ah as Be,aO as Qe,bf as De,w as oe,B as Re,b as Le,aj as Te,a$ as Ne,C as ge,Q as ne,U as T,aU as je,a9 as Ee,o as Ie,R as L,a3 as N,Y as M,f as A,a0 as ee,a1 as Oe,J as Me,a4 as j,S as re,$ as J,a5 as ae,F as Ve}from"./index.08e86ffb.js";import{Q as He,a as We}from"./QSpace.2b47e780.js";import{b as Ye,w as he,Q as _e,C as Ge}from"./ClosePopup.71a35b4b.js";import{u as Xe,a as Ke}from"./use-dark.09fea322.js";import{c as Je,b as Ze}from"./QTable.7b2293dc.js";import{Q as $e}from"./QToggle.c5ba4237.js";import{Q as ea,a as aa}from"./QLayout.f367b0a4.js";import{Q as ta}from"./QImg.786665cf.js";import{t as la}from"./QCheckbox.b8d0cf70.js";import{Q as ra}from"./QCard.ec410a0e.js";import{Q as oa}from"./QPage.04ecbe7a.js";import{Q as na}from"./QPageContainer.58a868ff.js";import{u as sa}from"./use-quasar.41efb91a.js";import{u as ia,b as ua,k as da,o as ca,a as Z}from"./axios.dd0a7574.js";import{c as fa,t as va}from"./Functions.a6828b9d.js";import{_ as ma}from"./plugin-vue_export-helper.21dcd24c.js";const pa={...ze,min:{type:Number,default:0},max:{type:Number,default:100},color:String,centerColor:String,trackColor:String,fontSize:String,rounded:Boolean,thickness:{type:Number,default:.2,validator:t=>t>=0&&t<=1},angle:{type:Number,default:0},showValue:Boolean,reverse:Boolean,instantFeedback:Boolean},se=50,we=2*se,Se=we*Math.PI,ga=Math.round(Se*1e3)/1e3;var ha=ye({name:"QCircularProgress",props:{...pa,value:{type:Number,default:0},animationSpeed:{type:[String,Number],default:600},indeterminate:Boolean},setup(t,{slots:o}){const{proxy:{$q:n}}=ie(),e=Ue(t),d=h(()=>{const f=(n.lang.rtl===!0?-1:1)*t.angle;return{transform:t.reverse!==(n.lang.rtl===!0)?`scale3d(-1, 1, 1) rotate3d(0, 0, 1, ${-90-f}deg)`:`rotate3d(0, 0, 1, ${f-90}deg)`}}),c=h(()=>t.instantFeedback!==!0&&t.indeterminate!==!0?{transition:`stroke-dashoffset ${t.animationSpeed}ms ease 0s, stroke ${t.animationSpeed}ms ease`}:""),i=h(()=>we/(1-t.thickness/2)),w=h(()=>`${i.value/2} ${i.value/2} ${i.value} ${i.value}`),x=h(()=>Ye(t.value,t.min,t.max)),z=h(()=>t.max-t.min),p=h(()=>t.thickness/2*i.value),S=h(()=>{const f=(t.max-x.value)/z.value,a=t.rounded===!0&&x.value<t.max&&f<.25?p.value/2*(1-f/.25):0;return Se*f+a});function Q({thickness:f,offset:a,color:F,cls:P,rounded:v}){return g("circle",{class:"q-circular-progress__"+P+(F!==void 0?` text-${F}`:""),style:c.value,fill:"transparent",stroke:"currentColor","stroke-width":f,"stroke-dasharray":ga,"stroke-dashoffset":a,"stroke-linecap":v,cx:i.value,cy:i.value,r:se})}return()=>{const f=[];t.centerColor!==void 0&&t.centerColor!=="transparent"&&f.push(g("circle",{class:`q-circular-progress__center text-${t.centerColor}`,fill:"currentColor",r:se-p.value/2,cx:i.value,cy:i.value})),t.trackColor!==void 0&&t.trackColor!=="transparent"&&f.push(Q({cls:"track",thickness:p.value,offset:0,color:t.trackColor})),f.push(Q({cls:"circle",thickness:p.value,offset:S.value,color:t.color,rounded:t.rounded===!0?"round":void 0}));const a=[g("svg",{class:"q-circular-progress__svg",style:d.value,viewBox:w.value,"aria-hidden":"true"},f)];return t.showValue===!0&&a.push(g("div",{class:"q-circular-progress__text absolute-full row flex-center content-center",style:{fontSize:t.fontSize}},o.default!==void 0?o.default():[g("div",x.value)])),g("div",{class:`q-circular-progress q-circular-progress--${t.indeterminate===!0?"in":""}determinate`,style:e.value,role:"progressbar","aria-valuemin":t.min,"aria-valuemax":t.max,"aria-valuenow":t.indeterminate===!0?void 0:x.value},Pe(o.internal,a))}}});function X(t,o,n,e){const d=[];return t.forEach(c=>{e(c)===!0?d.push(c):o.push({failedPropValidation:n,file:c})}),d}function te(t){t&&t.dataTransfer&&(t.dataTransfer.dropEffect="copy"),ke(t)}const _a={multiple:Boolean,accept:String,capture:String,maxFileSize:[Number,String],maxTotalSize:[Number,String],maxFiles:[Number,String],filter:Function},ba=["rejected"];function ya({editable:t,dnd:o,getFileInput:n,addFilesToQueue:e}){const{props:d,emit:c,proxy:i}=ie(),w=C(null),x=h(()=>d.accept!==void 0?d.accept.split(",").map(r=>(r=r.trim(),r==="*"?"*/":(r.endsWith("/*")&&(r=r.slice(0,r.length-1)),r.toUpperCase()))):null),z=h(()=>parseInt(d.maxFiles,10)),p=h(()=>parseInt(d.maxTotalSize,10));function S(r){if(t.value)if(r!==Object(r)&&(r={target:null}),r.target!==null&&r.target.matches('input[type="file"]')===!0)r.clientX===0&&r.clientY===0&&Fe(r);else{const U=n();U&&U!==r.target&&U.click(r)}}function Q(r){t.value&&r&&e(null,r)}function f(r,U,s,k){let u=Array.from(U||r.target.files);const _=[],D=()=>{_.length!==0&&c("rejected",_)};if(d.accept!==void 0&&x.value.indexOf("*/")===-1&&(u=X(u,_,"accept",b=>x.value.some(q=>b.type.toUpperCase().startsWith(q)||b.name.toUpperCase().endsWith(q))),u.length===0))return D();if(d.maxFileSize!==void 0){const b=parseInt(d.maxFileSize,10);if(u=X(u,_,"max-file-size",q=>q.size<=b),u.length===0)return D()}if(d.multiple!==!0&&u.length!==0&&(u=[u[0]]),u.forEach(b=>{b.__key=b.webkitRelativePath+b.lastModified+b.name+b.size}),k===!0){const b=s.map(q=>q.__key);u=X(u,_,"duplicate",q=>b.includes(q.__key)===!1)}if(u.length===0)return D();if(d.maxTotalSize!==void 0){let b=k===!0?s.reduce((q,I)=>q+I.size,0):0;if(u=X(u,_,"max-total-size",q=>(b+=q.size,b<=p.value)),u.length===0)return D()}if(typeof d.filter=="function"){const b=d.filter(u);u=X(u,_,"filter",q=>b.includes(q))}if(d.maxFiles!==void 0){let b=k===!0?s.length:0;if(u=X(u,_,"max-files",()=>(b++,b<=z.value)),u.length===0)return D()}if(D(),u.length!==0)return u}function a(r){te(r),o.value!==!0&&(o.value=!0)}function F(r){ke(r),(r.relatedTarget!==null||Ae.is.safari!==!0?r.relatedTarget!==w.value:document.elementsFromPoint(r.clientX,r.clientY).includes(w.value)===!1)===!0&&(o.value=!1)}function P(r){te(r);const U=r.dataTransfer.files;U.length!==0&&e(null,U),o.value=!1}function v(r){if(o.value===!0)return g("div",{ref:w,class:`q-${r}__dnd absolute-full`,onDragenter:te,onDragover:te,onDragleave:F,onDrop:P})}return Object.assign(i,{pickFiles:S,addFiles:Q}),{pickFiles:S,addFiles:Q,onDragover:a,onDragleave:F,processFiles:f,getDndNode:v,maxFilesNumber:z,maxTotalSizeNumber:p}}function be(t){return(t*100).toFixed(2)+"%"}const Fa={...Xe,..._a,label:String,color:String,textColor:String,square:Boolean,flat:Boolean,bordered:Boolean,noThumbnails:Boolean,autoUpload:Boolean,hideUploadBtn:Boolean,disable:Boolean,readonly:Boolean},xe=[...ba,"start","finish","added","removed"];function ka(t,o){const n=ie(),{props:e,slots:d,emit:c,proxy:i}=n,{$q:w}=i,x=Ke(e,w);function z(l,y,B){if(l.__status=y,y==="idle"){l.__uploaded=0,l.__progress=0,l.__sizeLabel=he(l.size),l.__progressLabel="0.00%";return}if(y==="failed"){i.$forceUpdate();return}l.__uploaded=y==="uploaded"?l.size:B,l.__progress=y==="uploaded"?1:Math.min(.9999,l.__uploaded/l.size),l.__progressLabel=be(l.__progress),i.$forceUpdate()}const p=h(()=>e.disable!==!0&&e.readonly!==!0),S=C(!1),Q=C(null),f=C(null),a={files:C([]),queuedFiles:C([]),uploadedFiles:C([]),uploadedSize:C(0),updateFileStatus:z,isAlive:()=>Be(n)===!1},{pickFiles:F,addFiles:P,onDragover:v,onDragleave:r,processFiles:U,getDndNode:s,maxFilesNumber:k,maxTotalSizeNumber:u}=ya({editable:p,dnd:S,getFileInput:ce,addFilesToQueue:fe});Object.assign(a,t({props:e,slots:d,emit:c,helpers:a,exposeApi:l=>{Object.assign(a,l)}})),a.isBusy===void 0&&(a.isBusy=C(!1));const _=C(0),D=h(()=>_.value===0?0:a.uploadedSize.value/_.value),b=h(()=>be(D.value)),q=h(()=>he(_.value)),I=h(()=>p.value===!0&&a.isUploading.value!==!0&&(e.multiple===!0||a.queuedFiles.value.length===0)&&(e.maxFiles===void 0||a.files.value.length<k.value)&&(e.maxTotalSize===void 0||_.value<u.value)),m=h(()=>p.value===!0&&a.isBusy.value!==!0&&a.isUploading.value!==!0&&a.queuedFiles.value.length!==0);Qe(De,me);const H=h(()=>"q-uploader column no-wrap"+(x.value===!0?" q-uploader--dark q-dark":"")+(e.bordered===!0?" q-uploader--bordered":"")+(e.square===!0?" q-uploader--square no-border-radius":"")+(e.flat===!0?" q-uploader--flat no-shadow":"")+(e.disable===!0?" disabled q-uploader--disable":"")+(S.value===!0?" q-uploader--dnd":"")),W=h(()=>"q-uploader__header"+(e.color!==void 0?` bg-${e.color}`:"")+(e.textColor!==void 0?` text-${e.textColor}`:""));oe(a.isUploading,(l,y)=>{y===!1&&l===!0?c("start"):y===!0&&l===!1&&c("finish")});function Y(){e.disable===!1&&(a.abort(),a.uploadedSize.value=0,_.value=0,de(),a.files.value=[],a.queuedFiles.value=[],a.uploadedFiles.value=[])}function E(){e.disable===!1&&ue(["uploaded"],()=>{a.uploadedFiles.value=[]})}function $(){ue(["idle","failed"],({size:l})=>{_.value-=l,a.queuedFiles.value=[]})}function ue(l,y){if(e.disable===!0)return;const B={files:[],size:0},O=a.files.value.filter(R=>l.indexOf(R.__status)===-1?!0:(B.size+=R.size,B.files.push(R),R.__img!==void 0&&window.URL.revokeObjectURL(R.__img.src),!1));B.files.length!==0&&(a.files.value=O,y(B),c("removed",B.files))}function le(l){e.disable||(l.__status==="uploaded"?a.uploadedFiles.value=a.uploadedFiles.value.filter(y=>y.__key!==l.__key):l.__status==="uploading"?l.__abort():_.value-=l.size,a.files.value=a.files.value.filter(y=>y.__key!==l.__key?!0:(y.__img!==void 0&&window.URL.revokeObjectURL(y.__img.src),!1)),a.queuedFiles.value=a.queuedFiles.value.filter(y=>y.__key!==l.__key),c("removed",[l]))}function de(){a.files.value.forEach(l=>{l.__img!==void 0&&window.URL.revokeObjectURL(l.__img.src)})}function ce(){return f.value||Q.value.getElementsByClassName("q-uploader__input")[0]}function fe(l,y){const B=U(l,y,a.files.value,!0),O=ce();O!=null&&(O.value=""),B!==void 0&&(B.forEach(R=>{if(a.updateFileStatus(R,"idle"),_.value+=R.size,e.noThumbnails!==!0&&R.type.toUpperCase().startsWith("IMAGE")){const pe=new Image;pe.src=window.URL.createObjectURL(R),R.__img=pe}}),a.files.value=a.files.value.concat(B),a.queuedFiles.value=a.queuedFiles.value.concat(B),c("added",B),e.autoUpload===!0&&a.upload())}function ve(){m.value===!0&&a.upload()}function K(l,y,B){if(l===!0){const O={type:"a",key:y,icon:w.iconSet.uploader[y],flat:!0,dense:!0};let R;return y==="add"?(O.onClick=F,R=me):O.onClick=B,g(T,O,R)}}function me(){return g("input",{ref:f,class:"q-uploader__input overflow-hidden absolute-full",tabindex:-1,type:"file",title:"",accept:e.accept,multiple:e.multiple===!0?"multiple":void 0,capture:e.capture,onMousedown:Fe,onClick:F,onChange:fe})}function qe(){return d.header!==void 0?d.header(G):[g("div",{class:"q-uploader__header-content column"},[g("div",{class:"flex flex-center no-wrap q-gutter-xs"},[K(a.queuedFiles.value.length!==0,"removeQueue",$),K(a.uploadedFiles.value.length!==0,"removeUploaded",E),a.isUploading.value===!0?g(ge,{class:"q-uploader__spinner"}):null,g("div",{class:"col column justify-center"},[e.label!==void 0?g("div",{class:"q-uploader__title"},[e.label]):null,g("div",{class:"q-uploader__subtitle"},[q.value+" / "+b.value])]),K(I.value,"add"),K(e.hideUploadBtn===!1&&m.value===!0,"upload",a.upload),K(a.isUploading.value,"clear",a.abort)])])]}function Ce(){return d.list!==void 0?d.list(G):a.files.value.map(l=>g("div",{key:l.__key,class:"q-uploader__file relative-position"+(e.noThumbnails!==!0&&l.__img!==void 0?" q-uploader__file--img":"")+(l.__status==="failed"?" q-uploader__file--failed":l.__status==="uploaded"?" q-uploader__file--uploaded":""),style:e.noThumbnails!==!0&&l.__img!==void 0?{backgroundImage:'url("'+l.__img.src+'")'}:null},[g("div",{class:"q-uploader__file-header row flex-center no-wrap"},[l.__status==="failed"?g(ne,{class:"q-uploader__file-status",name:w.iconSet.type.negative,color:"negative"}):null,g("div",{class:"q-uploader__file-header-content col"},[g("div",{class:"q-uploader__title"},[l.name]),g("div",{class:"q-uploader__subtitle row items-center no-wrap"},[l.__sizeLabel+" / "+l.__progressLabel])]),l.__status==="uploading"?g(ha,{value:l.__progress,min:0,max:1,indeterminate:l.__progress===0}):g(T,{round:!0,dense:!0,flat:!0,icon:w.iconSet.uploader[l.__status==="uploaded"?"done":"clear"],onClick:()=>{le(l)}})])]))}Re(()=>{a.isUploading.value===!0&&a.abort(),a.files.value.length!==0&&de()});const G={};for(const l in a)Le(a[l])===!0?Te(G,l,()=>a[l].value):G[l]=a[l];return Object.assign(G,{upload:ve,reset:Y,removeUploadedFiles:E,removeQueuedFiles:$,removeFile:le,pickFiles:F,addFiles:P}),Ne(G,{canAddFiles:()=>I.value,canUpload:()=>m.value,uploadSizeLabel:()=>q.value,uploadProgressLabel:()=>b.value}),o({...a,upload:ve,reset:Y,removeUploadedFiles:E,removeQueuedFiles:$,removeFile:le,pickFiles:F,addFiles:P,canAddFiles:I,canUpload:m,uploadSizeLabel:q,uploadProgressLabel:b}),()=>{const l=[g("div",{class:W.value},qe()),g("div",{class:"q-uploader__list scroll"},Ce()),s("uploader")];a.isBusy.value===!0&&l.push(g("div",{class:"q-uploader__overlay absolute-full flex flex-center"},[g(ge)]));const y={ref:Q,class:H.value};return I.value===!0&&Object.assign(y,{onDragover:v,onDragleave:r}),g("div",y,l)}}const wa=()=>!0;function Sa(t){const o={};return t.forEach(n=>{o[n]=wa}),o}const xa=Sa(xe);var qa=({name:t,props:o,emits:n,injectPlugin:e})=>ye({name:t,props:{...Fa,...o},emits:je(n)===!0?{...xa,...n}:[...xe,...n],setup(d,{expose:c}){return ka(e,c)}});function V(t){return typeof t=="function"?t:()=>t}const Ca="QUploader",za={url:[Function,String],method:{type:[Function,String],default:"POST"},fieldName:{type:[Function,String],default:()=>t=>t.name},headers:[Function,Array],formFields:[Function,Array],withCredentials:[Function,Boolean],sendRaw:[Function,Boolean],batch:[Function,Boolean],factory:Function},Ua=["factoryFailed","uploaded","failed","uploading"];function Pa({props:t,emit:o,helpers:n}){const e=C([]),d=C([]),c=C(0),i=h(()=>({url:V(t.url),method:V(t.method),headers:V(t.headers),formFields:V(t.formFields),fieldName:V(t.fieldName),withCredentials:V(t.withCredentials),sendRaw:V(t.sendRaw),batch:V(t.batch)})),w=h(()=>c.value>0),x=h(()=>d.value.length!==0);let z;function p(){e.value.forEach(a=>{a.abort()}),d.value.length!==0&&(z=!0)}function S(){const a=n.queuedFiles.value.slice(0);n.queuedFiles.value=[],i.value.batch(a)?Q(a):a.forEach(F=>{Q([F])})}function Q(a){if(c.value++,typeof t.factory!="function"){f(a,{});return}const F=t.factory(a);if(!F)o("factoryFailed",new Error("QUploader: factory() does not return properly"),a),c.value--;else if(typeof F.catch=="function"&&typeof F.then=="function"){d.value.push(F);const P=v=>{n.isAlive()===!0&&(d.value=d.value.filter(r=>r!==F),d.value.length===0&&(z=!1),n.queuedFiles.value=n.queuedFiles.value.concat(a),a.forEach(r=>{n.updateFileStatus(r,"failed")}),o("factoryFailed",v,a),c.value--)};F.then(v=>{z===!0?P(new Error("Aborted")):n.isAlive()===!0&&(d.value=d.value.filter(r=>r!==F),f(a,v))}).catch(P)}else f(a,F||{})}function f(a,F){const P=new FormData,v=new XMLHttpRequest,r=(m,H)=>F[m]!==void 0?V(F[m])(H):i.value[m](H),U=r("url",a);if(!U){console.error("q-uploader: invalid or no URL specified"),c.value--;return}const s=r("formFields",a);s!==void 0&&s.forEach(m=>{P.append(m.name,m.value)});let k=0,u=0,_=0,D=0,b;v.upload.addEventListener("progress",m=>{if(b===!0)return;const H=Math.min(D,m.loaded);n.uploadedSize.value+=H-_,_=H;let W=_-u;for(let Y=k;W>0&&Y<a.length;Y++){const E=a[Y];if(W>E.size)W-=E.size,k++,u+=E.size,n.updateFileStatus(E,"uploading",E.size);else{n.updateFileStatus(E,"uploading",W);return}}},!1),v.onreadystatechange=()=>{v.readyState<4||(v.status&&v.status<400?(n.uploadedFiles.value=n.uploadedFiles.value.concat(a),a.forEach(m=>{n.updateFileStatus(m,"uploaded")}),o("uploaded",{files:a,xhr:v})):(b=!0,n.uploadedSize.value-=_,n.queuedFiles.value=n.queuedFiles.value.concat(a),a.forEach(m=>{n.updateFileStatus(m,"failed")}),o("failed",{files:a,xhr:v})),c.value--,e.value=e.value.filter(m=>m!==v))},v.open(r("method",a),U),r("withCredentials",a)===!0&&(v.withCredentials=!0);const q=r("headers",a);q!==void 0&&q.forEach(m=>{v.setRequestHeader(m.name,m.value)});const I=r("sendRaw",a);a.forEach(m=>{n.updateFileStatus(m,"uploading",0),I!==!0&&P.append(r("fieldName",m),m,m.name),m.xhr=v,m.__abort=()=>{v.abort()},D+=m.size}),o("uploading",{files:a,xhr:v}),e.value.push(v),I===!0?v.send(new Blob(a)):v.send(P)}return{isUploading:w,isBusy:x,abort:p,upload:S}}var Aa={name:Ca,props:za,emits:Ua,injectPlugin:Pa},Ba=qa(Aa);const Qa={props:["height","avatar","post"],setup(t,{emit:o}){var r,U;const n=sa(),e=ia(),{crudAction:d,notifyAction:c}=e,i=Ee(),w=C([]),x=C("my_pics"),z=0,p=h(()=>e.authGetter),S=h(()=>e[x.value]||[]),Q=C({page:1,rowsPerPage:v()});oe(()=>n.screen.name,()=>Q.value.rowsPerPage=v()),oe(x,()=>f({}));function f(s){var k;w.value=[],d({...s,url:`api/users/${(k=p.value)==null?void 0:k.id}`,method:"get",mutate:x.value}).then(()=>o("reload",t.post?"file":i)).catch(u=>c({error:"FilesAction",e:u}))}Ie(()=>f({refresh:["reloadApp"]}));function a(s){var k;Z({url:`api/users/${(k=p.value)==null?void 0:k.id}`,method:"put",data:{avatar:t.avatar,post:t.post,pics:s,update:!0}}).then(({data:u})=>{f({refresh:["reloadApp"]}),c(u)}).catch(u=>c({error:"storeImageAction",e:u}))}function F(s){for(let k=0;k<s.length;k++){const u=new FileReader;u.readAsDataURL(s[k]),u.onload=_=>{var D;(D=_==null?void 0:_.target)!=null&&D.result&&w.value.push(_.target.result),k+1===(s==null?void 0:s.length)&&a(w.value)}}}function P(s){var k;if(confirm("Are You Sure You Want "+(s!=null&&s.forever?"To Delete Forever Pics":"To Delete Pics"))===!0)return Z({url:`api/users/${(k=p.value)==null?void 0:k.id}`,method:"delete",data:{auth:p==null?void 0:p.value,forever:s==null?void 0:s.forever,pics:s}}).then(()=>f({refresh:["reloadApp"]})).catch(u=>c({error:"deleteSelectedFiles",e:u}))}function v(){return z}return{baseURL:ua,filter:C(""),auth:p,ipDebug:h(()=>{var s;return(s=e.configGetter)==null?void 0:s.ipDebug}),upload:C(!1),bool:C(!1),selectedFiles:w,showFiles:x,ios:((U=(r=fa())==null?void 0:r.Capacitor)==null?void 0:U.getPlatform())==="ios",modembIos:navigator.userAgent.match(/(modembIos)/),mobileApp:da,storeFiles:a,getFiles:F,files:C(null),logUserAction:ca,takePhoto:async()=>a([await va()]),restore(s){Z({url:"api/users",method:"post",data:{restorePics:s}}).then(()=>f({refresh:["reloadApp"]})).catch(k=>c({error:"restorePics",e:k}))},restoreAll(){confirm("Restore All Files")&&Z({url:"api/users",method:"post",data:{filesRestore:!0}}).then(()=>f({refresh:["reloadApp"]})).catch(s=>c({error:"restoreAll",e:s}))},deletePic(s){confirm("Are You Sure You Want To Delete Pics")===!0&&Z.delete(`api/categories/${s}?deletePic=1`).then(()=>f({refresh:["reloadApp"]})).catch(k=>c({error:"deletePic",e:k}))},Delete:P,delete_forever(s){s.forever=!0,P(s)},columns:[{name:"pic",align:"center",label:"picture",field:"pic",sortable:!0},{name:"post_title",align:"center",label:"post_title",field:"name",sortable:!0},{name:"address",align:"center",label:"address",field:"address",sortable:!0},{name:"city",align:"center",label:"city",field:"city",sortable:!0},{name:"end_date",align:"center",label:"expiry",field:"end_date",sortable:!0},{name:"edit",align:"center",label:"edit",field:"edit",sortable:!1},{name:"delete",align:"center",label:"delete",field:"delete",sortable:!1}],rows:S,pagination:Q,cardContainerClass:h(()=>n.screen.gt.xs?"grid-masonry grid-masonry--"+(n.screen.gt.sm?"3":"2"):""),cardContainerStyle:h(()=>{var s;return{height:((s=S.value)==null?void 0:s.length)*200+"px"}}),rowsPerPageOptions:h(()=>n.screen.gt.xs?n.screen.gt.sm?[3,6,9]:[3,6]:[3])}}},Da={class:"q-pa-sm row items-center"},Ra={key:0,class:"col-xl-4"},La={class:"col-xl-8"},Ta={class:"q-pa-xs col-xs-12 col-sm-6 col-md-4"},Na=["innerHTML"];function ja(t,o,n,e,d,c){return L(),N(ea,{view:"lHh lpr lFf",container:"",style:{height:"800px"},class:"shadow-2 rounded-borders"},{default:M(()=>[A(aa,{elevated:""},{default:M(()=>{var i,w,x,z,p;return[n.post?(L(),N(He,{key:0},{default:M(()=>[A(ne,{name:"fas fa-photo-video"}),ee("div",null,Oe(t.$t("My Library")),1),A(We),Me(A(T,{dense:"",flat:"",icon:"close"},null,512),[[Ge]])]),_:1})):j("",!0),ee("div",Da,[n.post||e.ipDebug?(L(),re("div",Ra,[e.mobileApp?(L(),N(T,{key:0,color:"primary",icon:"fas fa-camera",onClick:e.takePhoto},null,8,["onClick"])):j("",!0),e.upload?(L(),N(Ba,{key:1,factory:e.getFiles,label:t.$t("Batch upload"),multiple:"","max-files":"10","auto-upload":"",batch:""},null,8,["factory","label"])):j("",!0),A(_e,{filled:"",multiple:"",type:"file",hint:"Native file (multiple)","onUpdate:modelValue":o[0]||(o[0]=S=>e.getFiles(S))})])):j("",!0),ee("div",La,[e.ipDebug?(L(),N(T,{key:0,class:"q-ma-xs col-md-2",icon:"fas fa-cloud-upload-alt",onClick:o[1]||(o[1]=J(S=>e.upload=!e.upload,["prevent"]))})):j("",!0),A(Je,{modelValue:e.showFiles,"onUpdate:modelValue":o[2]||(o[2]=S=>e.showFiles=S),push:"",glossy:"",class:"q-ma-xs *col-xs-2 *col-md-2","toggle-color":"orange",options:[{label:t.$t("My Pics"),value:"my_pics"},{label:t.$t("Trash"),value:e.bool?"all_trashed_pics":"trashed_pics"}].concat(e.ipDebug||((i=e.auth)==null?void 0:i.role)==="Admin"?[{label:t.$t("Users Pics"),value:"users_pics"},{label:t.$t("Avatars"),value:"avatars"},{label:t.$t("All Pics"),value:"all_pics"}]:[])},null,8,["modelValue","options"]),e.ipDebug&&e.showFiles==="trashed_pics"||e.showFiles==="all_trashed_pics"?(L(),N($e,{key:1,icon:"fas fa-user"+(e.bool?"s":""),val:[!0],size:"xl",modelValue:e.bool,"onUpdate:modelValue":o[3]||(o[3]=S=>e.bool=S)},null,8,["icon","modelValue"])):j("",!0),n.post?(L(),N(T,{key:2,icon:"fas fa-file-import",class:ae(((w=e.selectedFiles)!=null&&w.length?"bg-orange":"")+" q-ma-xs col-md-2"),onClick:o[4]||(o[4]=S=>e.storeFiles(e.selectedFiles))},null,8,["class"])):j("",!0),e.ipDebug?(L(),N(T,{key:3,icon:"edit",class:"q-ma-xs col-md-2",label:"restore all",onClick:e.restoreAll},null,8,["onClick"])):j("",!0),e.showFiles!=="trashed_pics"&&e.showFiles!=="all_trashed_pics"?(L(),N(T,{key:4,icon:"delete",class:ae(((x=e.selectedFiles)!=null&&x.length?"bg-orange":"")+" q-ma-xs col-md-2"),onClick:o[5]||(o[5]=J(S=>e.Delete(e.selectedFiles),["prevent"]))},null,8,["class"])):(L(),re(Ve,{key:5},[A(T,{icon:"restore",class:ae(((z=e.selectedFiles)!=null&&z.length?"bg-orange":"")+" q-ma-xs col-md-2"),onClick:o[6]||(o[6]=S=>e.restore(e.selectedFiles))},null,8,["class"]),A(T,{icon:"delete_forever",class:ae(((p=e.selectedFiles)!=null&&p.length?"bg-orange":"")+" q-ma-xs col-md-2"),onClick:o[7]||(o[7]=J(S=>e.delete_forever(e.selectedFiles),["prevent"]))},null,8,["class"])],64))])])]}),_:1}),A(na,null,{default:M(()=>[A(oa,{class:"q-pa-sm"},{default:M(()=>[A(Ze,{"_:style":"'height:' + height + 'px;'",grid:"","card-container-style":e.cardContainerStyle,"card-container-class":e.cardContainerClass,title:t.$t("gallery"),rows:e.rows,columns:e.columns,"row-key":"name",filter:e.filter,"hide-header":"",pagination:e.pagination,"onUpdate:pagination":o[10]||(o[10]=i=>e.pagination=i),"rows-per-page-options":e.rowsPerPageOptions,"virtual-scroll":"","virtual-scroll-item-size":48},{"top-right":M(()=>[A(_e,{clearable:"",borderless:"",dense:"",debounce:"300",modelValue:e.filter,"onUpdate:modelValue":o[8]||(o[8]=i=>e.filter=i),placeholder:"Search"},{append:M(()=>[A(ne,{name:"search"})]),_:1},8,["modelValue"])]),item:M(i=>[ee("div",Ta,[A(ra,{class:"my-card"},{default:M(()=>{var w,x,z;return[A(ta,{src:(x=(w=i.row)==null?void 0:w.avatar)!=null&&x.includes("https")?i.row.avatar:e.baseURL+"/"+(i.row.pic||i.row.avatar)},null,8,["src"]),i.row.name?(L(),re("div",{key:0,innerHTML:i.row.name},null,8,Na)):j("",!0),A(la,{modelValue:e.selectedFiles,"onUpdate:modelValue":o[9]||(o[9]=p=>e.selectedFiles=p),val:i.row.pic,label:i.row.updated_at||i.row.id},null,8,["modelValue","val","label"]),e.ipDebug?(L(),N(T,{key:1,size:"12px",flat:"",dense:"",icon:"fas fa-sign-in-alt",label:t.$t("Log User"),onClick:J(p=>e.logUserAction(i.row.user_id||i.row.id),["prevent"])},null,8,["label","onClick"])):j("",!0),e.showFiles!=="trashed_pics"&&e.showFiles!=="all_trashed_pics"&&((z=e.selectedFiles)==null?void 0:z.length)?(L(),N(T,{key:2,label:t.$t("delete"),size:"12px",icon:"fas fa-trash",onClick:J(p=>e.deletePic(i.row.id),["prevent"]),flat:"",dense:""},null,8,["label","onClick"])):j("",!0)]}),_:2},1024)])]),_:1},8,["card-container-style","card-container-class","title","rows","columns","filter","pagination","rows-per-page-options"])]),_:1})]),_:1})]),_:1})}var Ea=ma(Qa,[["render",ja]]),lt=Object.freeze(Object.defineProperty({__proto__:null,default:Ea},Symbol.toStringTag,{value:"Module"}));export{Ba as Q,Ea as U,lt as a};
