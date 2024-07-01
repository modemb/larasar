import{Q as Y}from"./QCard.ec410a0e.js";import{Q as L}from"./QCheckbox.b8d0cf70.js";import{Q as j,a as i}from"./QTr.5fbb2c40.js";import{r as c,c as f,w as M,o as H,u as J,X as S,R as p,S as P,f as t,Y as r,a0 as K,bd as O,F as T,a7 as y,a1 as w,U as g,$ as D,a3 as V,a4 as x,Q as Z}from"./index.08e86ffb.js";import{b as $,c as ee}from"./QTable.7b2293dc.js";import{Q as ae}from"./ClosePopup.71a35b4b.js";import{u as le}from"./use-quasar.41efb91a.js";import{u as te,o as re,a as R}from"./axios.dd0a7574.js";import oe from"./Profile.5f9a18cc.js";import{S as ne}from"./UserShare.9975d54e.js";import se from"./Auth.1fdd8b5e.js";import{_ as ie}from"./plugin-vue_export-helper.21dcd24c.js";import{i18n as de}from"./i18n.a0f971c3.js";import"./use-dark.09fea322.js";import"./QSeparator.e65deedb.js";import"./QSpace.2b47e780.js";import"./QLayout.f367b0a4.js";import"./QCardSection.3d25e11d.js";import"./QTooltip.6758108f.js";import"./QForm.b5701193.js";import"./QPage.04ecbe7a.js";import"./QPageContainer.58a868ff.js";import"./Functions.a6828b9d.js";import"./UserCheckout.70f50a93.js";import"./UserReports.1bc0db70.js";import"./QToggle.c5ba4237.js";import"./export-file.200e4ebe.js";import"./QPopupProxy.40be37ab.js";import"./UserFiles.b62f67b7.js";import"./QImg.786665cf.js";const ue={components:{Profile:oe,AddUser:se,Share:ne},setup(){var I,N;const n=(N=(I=de)==null?void 0:I.global)==null?void 0:N.t,s=le(),d=te(),{crudAction:l,notifyAction:U}=d,A=c(!1),C=c(null),u=c("users"),b=c(!1),a=c(""),v=f(()=>{var e;return(e=d[u.value])==null?void 0:e.last_page}),o=f(()=>{var e;return(e=d[u.value])==null?void 0:e.total}),W=f(()=>{var e;return(e=d.configGetter)==null?void 0:e.ipDebug}),X=f(()=>{var e;return(e=d.reloadGetter)==null?void 0:e.reload}),q=f(()=>{var e;return((e=d[u.value])==null?void 0:e.data)||[]}),k=f(()=>d.authGetter),m=c({sortBy:"desc",descending:!1,page:1,rowsPerPage:0,rowsNumber:o.value}),B=[];M(a,e=>{m.value.page=1,B.includes(e)||_({filterUsers:e,load:!0}),B.push(e)}),M([u,X],()=>{m.value.page=1,_({})}),H(()=>{var e;return _({usersData:u.value=((e=k.value)==null?void 0:e.role)==="Admin"?"users":"my_users"})});function _(e){l({...e,url:`api/users/${k.value.id}`,method:"get",timeout:1e3,page:m.value.page,perPage:m.value.rowsPerPage,mutate:u.value}).catch(h=>U({error:"usersAction",e:h}))}function Q(e){k.value&&confirm("Are You Sure You Want To "+(e.forever?"Delete Forever":e.remove?"Remove":"Delete")+" User "+e.first_name)&&R({url:`/api/users/${e.id}`,data:{authID:k.value.id,remove:e.remove},method:"delete"}).then(()=>_({refresh:["reloadApp"]})).catch(h=>U({error:"deleteAction",e:h}))}return{ipDebug:W,total:o,desktop:s.platform.is.desktop,height:screen.height/1.4,price:"0.00",shareLink:c(!1),addUser:c(!1),editUser:A,shareData:f(()=>{var e;return(e=d.shareDataGetter)==null?void 0:e.shareData}),usersData:u,loading:b,auth:k,user:C,onScroll({to:e,ref:h}){var F;const G=((F=q.value)==null?void 0:F.length)-1,z=m.value.page,E=v.value;b.value!==!0&&z<E&&e===G&&(b.value=!0,setTimeout(()=>{m.value.page++,_({load:!0}),J(()=>{h.refresh(),b.value=!1})},500)),console.log("page",z,"<","lastPage",E,"to",e,"===",G,"lastIndex",">",0,"total",o.value)},usersAction:_,logUserAction:re,Edit(e){m.value.page=1,A.value=!0,C.value=e},Delete:Q,delete_forever(e){Q({...e,forever:!0})},remove(e){Q({...e,remove:!0})},restore(e){R.post("api/users",e).then(()=>_({refresh:["reloadApp"]})).catch(h=>U({error:"restoreUser",e:h}))},columns:f(()=>{var e;return[{name:"id",align:"center",label:"ID",field:"id",sortable:!0},{name:"name",align:"center",label:n("user_name"),field:"name",sortable:!0},{name:"first_name",align:"center",label:n("first_name"),field:"first_name",sortable:!0},{name:"last_name",align:"center",label:n("last_name"),field:"last_name",sortable:!0},{name:"email",align:"center",label:n("email"),field:"email",sortable:!0},{name:"status",align:"center",label:n("status"),field:"status",sortable:!0},{name:"role",align:"center",label:n("role"),field:"role",sortable:!0}].concat(((e=k.value)==null?void 0:e.role)==="Admin"?[{name:"login",align:"center",label:n("login"),field:"login",sortable:!1},{name:"edit",align:"center",label:n("edit/restore"),field:"edit",sortable:!1},{name:"delete",align:"center",label:n("delete/forever"),field:"delete",sortable:!1}]:[])}),rows:q,pagination:m,filter:a}}},me={class:"q-pa-md"};function ce(n,s,d,l,U,A){const C=S("addUser"),u=S("Profile"),b=S("Share");return p(),P(T,null,[t(L,{modelValue:l.addUser,"onUpdate:modelValue":s[0]||(s[0]=a=>l.addUser=a)},{default:r(()=>[t(Y,{class:"my-card text-white",style:{width:"100%"}},{default:r(()=>[t(C,{auth:l.auth},null,8,["auth"])]),_:1})]),_:1},8,["modelValue"]),t(L,{modelValue:l.editUser,"onUpdate:modelValue":s[1]||(s[1]=a=>l.editUser=a)},{default:r(()=>[t(Y,{class:"my-card text-black col-1",style:{width:"1000px"}},{default:r(()=>[t(u,{user:l.user,onUpdate:l.usersAction},null,8,["user","onUpdate"])]),_:1})]),_:1},8,["modelValue"]),K("div",me,[t($,{style:O(`height: ${l.height}px`),class:"my-sticky-virtscroll-table",ref:"table",title:`${n.$t("users_list")} ${l.total}`,rows:l.rows,columns:l.columns,"row-key":"name",filter:l.filter,loading:l.loading,"binary-state-sort":"","virtual-scroll":"","virtual-scroll-item-size":48,"virtual-scroll-sticky-size-start":48,pagination:l.pagination,"onUpdate:pagination":s[5]||(s[5]=a=>l.pagination=a),onVirtualScroll:l.onScroll},{body:r(a=>[t(j,{props:a},{default:r(()=>{var v;return[t(i,{key:"id",props:a},{default:r(()=>[y(w(a.row.id),1)]),_:2},1032,["props"]),t(i,{key:"name",props:a},{default:r(()=>{var o;return[y(w((o=a.row)==null?void 0:o.name),1)]}),_:2},1032,["props"]),t(i,{key:"first_name",props:a},{default:r(()=>[y(w(a.row.first_name),1)]),_:2},1032,["props"]),t(i,{key:"last_name",props:a},{default:r(()=>[y(w(a.row.last_name),1)]),_:2},1032,["props"]),t(i,{key:"email",props:a},{default:r(()=>{var o;return[t(g,{flat:"","icon-right":(o=a.row)!=null&&o.email_verified_at?"check":"",label:a.row.email},null,8,["icon-right","label"])]}),_:2},1032,["props"]),t(i,{key:"status",props:a},{default:r(()=>[y(w(a.row.status),1)]),_:2},1032,["props"]),t(i,{key:"role",props:a},{default:r(()=>[y(w(a.row.role),1)]),_:2},1032,["props"]),((v=l.auth)==null?void 0:v.role)==="Admin"?(p(),P(T,{key:0},[t(i,{key:"login",props:a},{default:r(()=>[t(g,{icon:"fas fa-sign-in-alt",rounded:"",onClick:D(o=>l.logUserAction(a.row.id),["prevent"])},null,8,["onClick"])]),_:2},1032,["props"]),t(i,{key:"edit",props:a},{default:r(()=>[t(g,{icon:"edit",rounded:"",class:"q-ma-md",onClick:D(o=>l.Edit(a.row),["prevent"])},null,8,["onClick"])]),_:2},1032,["props"]),l.usersData=="users"?(p(),V(i,{key:"delete",props:a},{default:r(()=>[t(g,{icon:"delete",rounded:"",onClick:D(o=>l.Delete(a.row),["prevent"])},null,8,["onClick"])]),_:2},1032,["props"])):l.usersData=="my_users"?(p(),V(i,{key:"edit",props:a},{default:r(()=>[t(g,{icon:"remove",rounded:"",onClick:D(o=>l.remove(a.row),["prevent"])},null,8,["onClick"])]),_:2},1032,["props"])):(p(),P(T,{key:2},[t(i,{key:"delete",props:a},{default:r(()=>[t(g,{icon:"restore",rounded:"",class:"q-ma-md",onClick:o=>l.restore(a.row)},null,8,["onClick"])]),_:2},1032,["props"]),t(i,{key:"delete",props:a},{default:r(()=>[t(g,{icon:"delete_forever",rounded:"",onClick:D(o=>l.delete_forever(a.row),["prevent"])},null,8,["onClick"])]),_:2},1032,["props"])],64))],64)):x("",!0)]}),_:2},1032,["props"])]),"top-right":r(()=>{var a,v;return[((a=l.auth)==null?void 0:a.role)==="Admin"?(p(),V(ee,{key:0,modelValue:l.usersData,"onUpdate:modelValue":s[2]||(s[2]=o=>l.usersData=o),push:"",glossy:"",class:"q-ma-xs col-md-3","toggle-color":"primary",options:[{label:n.$t("users"),value:"users"},{label:n.$t("Trash"),value:"userTrashed"},{label:n.$t("Deleted"),value:"userDeleted"},{label:n.$t("my_users"),value:"my_users"}]},null,8,["modelValue","options"])):x("",!0),((v=l.auth)==null?void 0:v.role)==="Admin"?(p(),V(g,{key:1,icon:"add_circle_outline",rounded:"",class:"q-ma-xs col-md-3",label:n.$t("add_user"),onClick:s[3]||(s[3]=o=>l.addUser=!0)},null,8,["label"])):x("",!0),t(b,{shareData:l.shareData},null,8,["shareData"]),t(ae,{clearable:"",class:"q-ma-xs col-md-3",borderless:"",dense:"",debounce:"300",modelValue:l.filter,"onUpdate:modelValue":s[4]||(s[4]=o=>l.filter=o),placeholder:n.$t("search")},{append:r(()=>[t(Z,{name:"search"})]),_:1},8,["modelValue","placeholder"])]}),_:1},8,["style","title","rows","columns","filter","loading","pagination","onVirtualScroll"])])],64)}var Me=ie(ue,[["render",ce]]);export{Me as default};
