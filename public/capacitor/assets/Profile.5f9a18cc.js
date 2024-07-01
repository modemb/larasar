import{Q as q}from"./QCard.ec410a0e.js";import{Q as sl,i as ol,t as Pe}from"./QCheckbox.b8d0cf70.js";import{d as rl,r,c as C,w as Ie,o as ul,R as m,S as v,f as t,Y as d,bd as dl,F as Ne,a3 as V,Q as Fe,a0 as u,a1 as $,J as Te,U as f,a4 as _,ab as Be,bj as c,a7 as Le,$ as te,bk as nl,a2 as il}from"./index.08e86ffb.js";import{Q as ml,a as pl}from"./QSpace.2b47e780.js";import{Q as vl,a as cl}from"./QLayout.f367b0a4.js";import{Q as P}from"./QCardSection.3d25e11d.js";import{Q as i,C as fl}from"./ClosePopup.71a35b4b.js";import{Q as Me}from"./QTooltip.6758108f.js";import{Q as Re}from"./QForm.b5701193.js";import{Q as bl}from"./QSeparator.e65deedb.js";import{Q as yl}from"./QPage.04ecbe7a.js";import{Q as gl}from"./QPageContainer.58a868ff.js";import{u as hl}from"./use-quasar.41efb91a.js";import{u as Vl,s as $l,i as se,b as _l,a as I,j as Ee,d as Ke,k as wl,n as N,x as A}from"./axios.dd0a7574.js";import{t as Ul}from"./Functions.a6828b9d.js";import{C as kl}from"./UserCheckout.70f50a93.js";import{U as Ql}from"./UserFiles.b62f67b7.js";import{S as Cl}from"./UserShare.9975d54e.js";import{i18n as ql}from"./i18n.a0f971c3.js";import"./use-dark.09fea322.js";import"./UserReports.1bc0db70.js";import"./QToggle.c5ba4237.js";import"./export-file.200e4ebe.js";import"./QPopupProxy.40be37ab.js";import"./QTable.7b2293dc.js";import"./QTr.5fbb2c40.js";import"./plugin-vue_export-helper.21dcd24c.js";import"./QImg.786665cf.js";const Al={class:"q-gutter-md"},zl={class:"row"},Dl={class:"col-md-6 q-pa-sm"},Gl={class:"text-h6"},Sl=["src"],Pl={class:"row"},Il={key:0,class:"col-12"},Nl=u("br",null,null,-1),Fl={key:1,class:"col-12"},Tl={class:"col-12"},Bl={class:"col-6"},Ll={class:"col-6"},Ml={class:"row"},Rl={class:"col-4"},El={class:"col-4"},Kl={class:"col-4"},jl={class:"row"},Hl={class:"col-6"},Jl={class:"col-6"},Wl={class:"col-3"},Yl={key:0,class:"col-9"},Ol={key:1,class:"col-9"},Xl={key:2,class:"col-9 *q-pb-md"},Zl=u("br",null,null,-1),xl={class:"col-md-6 q-pa-sm"},ea={class:"text-h6"},la={key:2},aa=["value"],ta={class:"text-h6"},sa={class:"row q-ma-sm"},oa={class:"col-xs-12 col-md-4"},ra={class:"col-xs-12 col-md-8"},ua=u("br",null,null,-1),Na=rl({name:"ProfilePage",__name:"Profile",props:["user"],emits:["update"],setup(je,{emit:He}){var ve,ce,fe,be,ye,ge,he,Ve,$e,_e,we,Ue,ke,Qe,Ce,qe,Ae,ze;const oe=He,b=je,F=hl(),p=Vl(),{crudAction:Je,notifyAction:y}=p,T=r(null),z=r((ve=b.user)==null?void 0:ve.gain),B=r((ce=b.user)==null?void 0:ce.credit),g=r(b.user),o=C(()=>g.value||p.authGetter),L=r((fe=o.value)==null?void 0:fe.role),M=r(""),R=r(""),We=r((be=o.value)==null?void 0:be.name),E=r((ye=o.value)==null?void 0:ye.first_name),K=r((ge=o.value)==null?void 0:ge.last_name),j=r((he=o.value)==null?void 0:he.email),w=r(!1),U=r(!1),H=r((Ve=o.value)==null?void 0:Ve.phone),J=r(($e=o.value)==null?void 0:$e.address),re=r(""),W=r((_e=o.value)==null?void 0:_e.city),Y=r((we=o.value)==null?void 0:we.region),ue=r((Ue=o.value)==null?void 0:Ue.region_data),O=r((ke=o.value)==null?void 0:ke.postal_code),de=r((Qe=o.value)==null?void 0:Qe.postal_code_data),X=r((Ce=o.value)==null?void 0:Ce.country),Z=r(null),D=r(null),x=r(null),k=r(!0),ee=r((qe=o.value)==null?void 0:qe.locale),G=r(F.localStorage.getItem("ip")),ne=r(!1),Q=r(""),ie=r((Ae=o.value)==null?void 0:Ae.hostUserName_data),Ye=C(()=>{var e;return(e=p.shareDataGetter)==null?void 0:e.shareData}),Oe=C(()=>{var e,l;return((e=p.ipGetter)==null?void 0:e.ip)===((l=se)==null?void 0:l.ip)}),le=C(()=>{var e;return(e=p.configGetter)==null?void 0:e.ipDebug}),Xe=C(()=>{var e;return((e=p.authGetter)==null?void 0:e.id)===1}),Ze=C(()=>{var e,l,s,n,a,h;return(e=o.value)!=null&&e.avatar?(l=o.value)!=null&&l.avatar.includes("files/")?_l+"/"+((s=o.value)==null?void 0:s.avatar):(n=o.value)==null?void 0:n.avatar:(h=(a=o.value)==null?void 0:a.new)==null?void 0:h.avatar}),S=`api/users/${(ze=o.value)==null?void 0:ze.id}`,xe=screen.height/(F.platform.is.mobile?1.2:1.35),el=["Admin","User","Editor"],ll=()=>{var e;return G.value=(e=se)==null?void 0:e.ip},me=e=>I({url:S,method:"put",data:{update:!0,avatar:e}}).then(({data:l})=>{y(l),p.authGetter=g.value=l.user}).catch(l=>y({error:"createImage",e:l}));Ie(G,e=>{F.localStorage.set("ip",p.ipGetter.ip=e),Ee()}),Ie(ee,e=>{var l;setTimeout(()=>b.user?oe("update",{usersData:"users"}):Ke(),1500),ql.global.locale.value=e,p.authGetter.id=(l=o.value)==null?void 0:l.id,Ee()});function al(e){const l=new FileReader;console.log("reader",l),l.onload=async s=>{var n;return me([`${(n=s==null?void 0:s.target)==null?void 0:n.result}`])},l.readAsDataURL(e)}ul(()=>{const e=o.value.currency_code;p.rateGetter=o.value.rate,$l(o.value),Je({currency:e,mutate:"currencyGetter",refresh:["currencyGetter"]})});function pe(){var e,l;I({url:S,method:"put",data:{hostUserName:Q.value,authCode:Q.value?!0:"",ip:Q.value?(e=se)==null?void 0:e.ip:"",id:Q.value?(l=o.value)==null?void 0:l.id:"",update:!0,table:T.value,gain:z.value,credit:B.value,role:L.value,name:M.value,first_name:E.value,last_name:K.value,phone:H.value,address:J.value,city:W.value,region:Y.value,postal_code:O.value,country:X.value}}).then(({data:s})=>y(s)).then(()=>A(Ke())).then(()=>oe("update",{refresh:["reloadApp"]})).catch(s=>{var n,a,h,De,Ge,Se;return R.value=((De=(h=(a=(n=s.response)==null?void 0:n.data)==null?void 0:a.errors)==null?void 0:h.name)==null?void 0:De[0])||((Se=(Ge=s.response)==null?void 0:Ge.data)==null?void 0:Se.message)})}function ae(){I({url:S,method:"put",data:{pwd:!b.user,update:!0,email:j.value,update_email:w.value||le.value,delete_account:U.value,password:b.user?!1:Z.value,update_password:b.user?D.value:!1,new_password:D.value,password_confirmation:x.value}}).catch(e=>y({error:"passwordAction",e})).then(({data:e})=>y(e))}function tl(){I({url:S,method:"delete",data:{delete_avatar:1}}).then(({data:e})=>{y(e),p.authGetter=g.value=e.User}).catch(e=>y({error:"deleteAvatar",e}))}return(e,l)=>(m(),v(Ne,null,[t(sl,{modelValue:ne.value,"onUpdate:modelValue":l[0]||(l[0]=s=>ne.value=s)},{default:d(()=>[t(q,{class:"my-card col-12",style:{width:"100%","max-width":"1000px"}},{default:d(()=>[t(Ql,{avatar:!0})]),_:1})]),_:1},8,["modelValue"]),t(vl,{view:"lHh lpr lFf",container:"",style:dl("height:"+xe+"px"),class:"shadow-2 rounded-borders"},{default:d(()=>[g.value?(m(),V(cl,{key:0,elevated:""},{default:d(()=>[t(ml,null,{default:d(()=>[t(Fe,{name:"fas fa-user"}),u("div",null,$(e.$t("profile")),1),t(pl),Te(t(f,{dense:"",flat:"",icon:"close"},null,512),[[fl]])]),_:1})]),_:1})):_("",!0),t(gl,null,{default:d(()=>[t(yl,{class:"flex flex-center q-pa-md"},{default:d(()=>[u("div",Al,[u("div",zl,[u("div",Dl,[t(q,{class:"my-card"},{default:d(()=>[t(P,{class:"bg-primary text-white"},{default:d(()=>[u("div",Gl,$(e.$t("your_info")),1)]),_:1}),t(Re,{class:"q-pa-sm",onKeyup:Be(pe,["enter"])},{default:d(()=>{var s,n;return[t(q,{class:"row q-mb-md"},{default:d(()=>[u("img",{src:Ze.value,class:"col-md-6"},null,8,Sl),t(P,{class:"col-md-6"},{default:d(()=>{var a;return[c(wl)?(m(),V(f,{key:0,color:"primary",class:"q-ma-md",icon:"fas fa-camera",onClick:l[1]||(l[1]=async()=>me([await c(Ul)()]))})):(m(),V(i,{key:1,filled:"",clearable:"",type:"file","onUpdate:modelValue":l[2]||(l[2]=h=>al(h[0]))})),t(f,{color:"primary",class:"q-ma-md",onClick:tl,label:e.$t("remove_image")},null,8,["label"]),u("div",null,[t(Cl,{shareData:Ye.value},null,8,["shareData"]),t(f,{dense:"",color:"primary",class:"q-ma-md",label:c(N)(c(A)((a=o.value)==null?void 0:a.gain))},{default:d(()=>[t(Me,{anchor:"top middle",self:"bottom middle",offset:[10,10],class:"text-h6"},{default:d(()=>[Le($(e.$t("gain_tooltip")),1)]),_:1})]),_:1},8,["label"])])]}),_:1})]),_:1}),u("div",Pl,[g.value?(m(),v("div",Il,[t(ol,{filled:"",modelValue:L.value,"onUpdate:modelValue":l[3]||(l[3]=a=>L.value=a),options:el,label:e.$t("role"),clearable:""},null,8,["modelValue","label"]),Nl])):_("",!0),(n=(s=o.value)==null?void 0:s[0])!=null&&n.host_id?_("",!0):(m(),v("div",Fl,[t(i,{filled:"",type:"text",modelValue:Q.value,"onUpdate:modelValue":l[4]||(l[4]=a=>Q.value=a),"lazy-rules":"",clearable:"",label:e.$t("Affiliate Code"),rules:[a=>a&&a.length>0||e.$t("user_name")],hint:e.$t("Add The Code To Earn Money"),error:!!ie.value,"error-message":ie.value},null,8,["modelValue","label","rules","hint","error","error-message"])])),u("div",Tl,[t(i,{filled:"",type:"text",modelValue:M.value,"onUpdate:modelValue":l[5]||(l[5]=a=>M.value=a),"lazy-rules":"",clearable:"",label:We.value||e.$t("user_name"),rules:[a=>a&&a.length>0||e.$t("user_name")],error:!!R.value,"error-message":R.value},{default:d(()=>[t(f,{dense:"",flat:"",round:"",icon:"fas fa-question",class:"q-ma-md"},{default:d(()=>[t(Me,{anchor:"top middle",self:"bottom middle",offset:[10,10],class:"text-h6"},{default:d(()=>[Le($(e.$t("To gain users and earn money, you can share your username, as your affiliate code. When new users sign up using this code, you'll earn a percentage of their spending."))+" | ",1)]),_:1})]),_:1})]),_:1},8,["modelValue","label","rules","error","error-message"])]),u("div",Bl,[t(i,{filled:"",type:"text",modelValue:E.value,"onUpdate:modelValue":l[6]||(l[6]=a=>E.value=a),label:e.$t("first_name"),"lazy-rules":"",clearable:"",rules:[a=>a&&a.length>0||e.$t("first_name")]},null,8,["modelValue","label","rules"])]),u("div",Ll,[t(i,{filled:"",type:"text",modelValue:K.value,"onUpdate:modelValue":l[7]||(l[7]=a=>K.value=a),label:e.$t("last_name"),"lazy-rules":"",clearable:"",rules:[a=>a&&a.length>0||e.$t("last_name")]},null,8,["modelValue","label","rules"])])]),t(i,{filled:"",type:"text",modelValue:J.value,"onUpdate:modelValue":l[8]||(l[8]=a=>J.value=a),label:e.$t("address"),error:!!re.value,"error-message":re.value,clearable:"",rules:[a=>a&&a.length>0||e.$t("add_address")]},null,8,["modelValue","label","error","error-message","rules"]),u("div",Ml,[u("div",Rl,[t(i,{"lazy-rules":"",modelValue:W.value,"onUpdate:modelValue":l[9]||(l[9]=a=>W.value=a),filled:"",type:"text",label:e.$t("city"),clearable:"",rules:[a=>a&&a.length>0||e.$t("add_city")]},null,8,["modelValue","label","rules"])]),u("div",El,[t(i,{filled:"","lazy-rules":"",type:"text",modelValue:Y.value,"onUpdate:modelValue":l[10]||(l[10]=a=>Y.value=a),label:e.$t("region"),error:!!ue.value,"error-message":ue.value,clearable:"",rules:[a=>a&&a.length>0||e.$t("add_region")]},null,8,["modelValue","label","error","error-message","rules"])]),u("div",Kl,[t(i,{filled:"","lazy-rules":"",type:"text",modelValue:O.value,"onUpdate:modelValue":l[11]||(l[11]=a=>O.value=a),label:e.$t("postal_code"),error:!!de.value,"error-message":de.value,clearable:"",rules:[a=>a&&a.length>0||e.$t("add_postal_code")]},null,8,["modelValue","label","error","error-message","rules"])])]),u("div",jl,[u("div",Hl,[t(i,{modelValue:X.value,"onUpdate:modelValue":l[12]||(l[12]=a=>X.value=a),filled:"",type:"text",label:e.$t("country"),"lazy-rules":"",clearable:"",rules:[a=>a&&a.length>0||e.$t("add_country")]},null,8,["modelValue","label","rules"])]),u("div",Jl,[t(i,{modelValue:H.value,"onUpdate:modelValue":l[13]||(l[13]=a=>H.value=a),filled:"",type:"tel",label:e.$t("phone"),hint:e.$t("Including area code"),"lazy-rules":"",clearable:"",rules:[a=>a&&a.length>0||e.$t("add_phone")]},null,8,["modelValue","label","hint","rules"])]),u("div",Wl,[t(f,{color:"primary",label:e.$t("update"),onClick:te(pe,["prevent"])},null,8,["label"])]),g.value&&Xe.value?(m(),v("div",Yl,[t(i,{modelValue:z.value,"onUpdate:modelValue":l[14]||(l[14]=a=>z.value=a),filled:"",type:"number",label:"Gain "+c(N)(c(A)(z.value)),clearable:""},null,8,["modelValue","label"])])):le.value?(m(),v("div",Ol,[t(i,{modelValue:T.value,"onUpdate:modelValue":l[15]||(l[15]=a=>T.value=a),filled:"",type:"text",label:"Fix Table",clearable:""},null,8,["modelValue"])])):(m(),v("div",Xl,[t(i,{clearable:"",modelValue:B.value,"onUpdate:modelValue":l[16]||(l[16]=a=>B.value=a),filled:"",type:"text",label:`${e.$t("Credit")} ${c(N)(c(A)(o.value.credit))} --> ${e.$t("Gain")} ${c(N)(c(A)(o.value.gain))}`,hint:e.$t("Add from your credit to money earned to pay for plans")},null,8,["modelValue","label","hint"]),Zl]))])]}),_:1})]),_:1})]),u("div",xl,[t(q,{class:"my-card"},{default:d(()=>[t(P,{class:"bg-primary text-white"},{default:d(()=>[u("div",ea,$(e.$t("your_password")),1)]),_:1}),t(Re,{class:"q-pa-sm",onKeyup:Be(ae,["enter"])},{default:d(()=>[g.value?_("",!0):(m(),V(i,{key:0,filled:"",modelValue:Z.value,"onUpdate:modelValue":l[17]||(l[17]=s=>Z.value=s),type:k.value?"password":"text",label:e.$t("your_password"),"lazy-rules":"",clearable:"",rules:[s=>s&&s.length>0||e.$t("your_password")]},null,8,["modelValue","type","label","rules"])),t(i,{filled:"",type:k.value?"password":"text",modelValue:D.value,"onUpdate:modelValue":l[18]||(l[18]=s=>D.value=s),label:e.$t("new_password"),clearable:"","lazy-rules":"",disable:w.value||U.value,rules:[s=>s&&s.length>0||e.$t("new_password")]},null,8,["type","modelValue","label","disable","rules"]),t(i,{filled:"",modelValue:x.value,"onUpdate:modelValue":l[20]||(l[20]=s=>x.value=s),type:k.value?"password":"text",label:e.$t("confirm_password"),clearable:"","lazy-rules":"",disable:w.value||U.value,rules:[s=>s&&s.length>0||e.$t("confirm_password")]},{append:d(()=>[t(Fe,{name:k.value?"visibility_off":"visibility",class:"cursor-pointer",onClick:l[19]||(l[19]=s=>k.value=!k.value)},null,8,["name"])]),_:1},8,["modelValue","type","label","disable","rules"]),w.value?(m(),V(i,{key:1,filled:"",type:"email",modelValue:j.value,"onUpdate:modelValue":l[21]||(l[21]=s=>j.value=s),label:e.$t("email"),"lazy-rules":"",clearable:"",rules:[s=>s&&s.length>0||e.$t("email")]},null,8,["modelValue","label","rules"])):_("",!0),U.value?(m(),V(f,{key:3,color:"red",label:e.$t("delete_account"),onClick:te(ae,["prevent"])},null,8,["label"])):(m(),v("span",la,[t(f,{color:"primary",class:"q-ma-sm",label:e.$t("update"),onClick:te(ae,["prevent"])},null,8,["label"]),t(Pe,{modelValue:w.value,"onUpdate:modelValue":l[22]||(l[22]=s=>w.value=s),label:e.$t("update_email")},null,8,["modelValue","label"])])),t(Pe,{class:"q-ma-sm",modelValue:U.value,"onUpdate:modelValue":l[23]||(l[23]=s=>U.value=s),label:e.$t("delete_account")},null,8,["modelValue","label"])]),_:1})]),_:1}),t(bl,{vertical:"",inset:""}),t(q,{class:"my-card"},{default:d(()=>{var s;return[t(P,{class:"bg-primary text-white"},{default:d(()=>[le.value?Te((m(),v("select",{key:0,"onUpdate:modelValue":l[24]||(l[24]=n=>ee.value=n),class:"float-right"},[(m(!0),v(Ne,null,il(e.$i18n.availableLocales,n=>(m(),v("option",{key:`locale-${n}`,value:n},$(n),9,aa))),128))],512)),[[nl,ee.value]]):_("",!0),u("div",ta,$(e.$t("settings")),1)]),_:1}),u("div",sa,[u("div",oa,[t(kl,{profile:!0,user:o.value,filled:"",onCurrency:l[25]||(l[25]=n=>e.$emit("update",{usersData:"users"}))},null,8,["user"])]),u("div",ra,[((s=o.value)==null?void 0:s.role)==="Admin"?(m(),V(i,{key:0,type:"text",filled:"",modelValue:G.value,"onUpdate:modelValue":l[26]||(l[26]=n=>G.value=n),label:e.$t("IP Address"),clearable:""},{default:d(()=>[t(f,{color:Oe.value?"red":"grey",label:"IP",onClick:ll},null,8,["color"])]),_:1},8,["modelValue","label"])):_("",!0),ua])])]}),_:1})])])])]),_:1})]),_:1})]),_:1},8,["style"])],64))}});export{Na as default};
