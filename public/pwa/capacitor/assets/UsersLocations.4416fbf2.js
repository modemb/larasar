import{r as f,c as C,o as B,w as F,X as P,R as Q,S as L,f as a,Y as s,a0 as b,bd as E,F as T,J as x,U as i,a1 as u,$ as _,a7 as c,Q as G}from"./index.08e86ffb.js";import{Q as N}from"./QCardSection.3d25e11d.js";import{Q as v,C as I}from"./ClosePopup.71a35b4b.js";import{Q as W}from"./QCard.ec410a0e.js";import{Q as M}from"./QCheckbox.b8d0cf70.js";import{Q as J,a as n}from"./QTr.5fbb2c40.js";import{b as O,c as R}from"./QTable.7b2293dc.js";import{Q as X}from"./QPopupProxy.40be37ab.js";import{u as j,a as U,m as q}from"./axios.dd0a7574.js";import{G as H}from"./GoogleAutocomplete.1506f244.js";import{_ as K}from"./plugin-vue_export-helper.21dcd24c.js";import{i18n as Z}from"./i18n.a0f971c3.js";import"./use-dark.09fea322.js";import"./QSeparator.e65deedb.js";const $={components:{GoogleAutocomplete:H},setup(){const r=Z.global.t,o=j(),{crudAction:h,notifyAction:t}=o,m=f(!1),k=f(!1),g=f("locations"),e=f(),p=f(""),w=f(0),D=f(0),V=f(0),A=C(()=>o.authGetter);B(()=>y({locationsData:"locations"})),F(g,l=>y({locationsData:l}));const Y=(l=>l==null?void 0:l.filter((d,z)=>l.indexOf(d)!==z))(o.locationsGetter);console.log(Y);function y(l){h({...l,mutate:g.value,url:"api/users/locations",method:"get"}).catch(d=>t({error:"locationsAction",e:d})).then(()=>m.value=!1)}function S(l){A.value&&confirm("Are You Sure You Want To "+(l!=null&&l.forever?"Delete Forever":"Delete")+" Location "+(l==null?void 0:l.place))===!0&&h({url:`/api/users/${l==null?void 0:l.id}`,method:"delete",location:!0,refresh:["reloadApp"]}).then(()=>y({locationsData:g.value})).catch(d=>t({error:"deleteAction",e:d}))}return{height:screen.height/1.4,editLocation:k,locationsData:g,loader:m,filter:f(""),place:p,latitude:w,longitude:D,utc_offset:V,Location:e,pagination:{sortBy:"asc",descending:!1,page:1,rowsPerPage:0,rowsNumber:10},update(l){m.value=!0,h({success:"Location Updated Successfully",url:"api/users/location",method:"put",place:p.value||(l==null?void 0:l.place)||"",latitude:w.value||(l==null?void 0:l.latitude)||"",longitude:D.value||(l==null?void 0:l.longitude)||"",utc_offset:V.value||(l==null?void 0:l.utc_offset)||"",refresh:["reloadApp"]}).then(()=>y({locationsData:g.value})).catch(d=>t({error:"updateLocation",e:d}))},Edit(l){k.value=!0,p.value=(l==null?void 0:l.place)||"",w.value=(l==null?void 0:l.latitude)||0,D.value=(l==null?void 0:l.longitude)||0,V.value=(l==null?void 0:l.utc_offset)||0,e.value=l},Delete:S,delete_forever(l){S({...l,forever:!0})},restore(l){U.post("api/users",{location_id:l==null?void 0:l.id}).then(()=>{q(["reloadApp"]),y({locationsData:"locTrashed"})}).catch(d=>t({error:"restoreLocation",e:d}))},fromAnalytics(){if(A.value&&confirm("Are You Sure You Want To Add Locations From Analytics")===!0)m.value=!0;else return;U.post("api/users",{fromAnalytics:!0}).then(()=>{q(["reloadApp"]),y({locationsData:"locations"}),m.value=!1}).catch(l=>t({error:"fromAnalytics",e:l}))},truncate(){const l=prompt("Please enter your password:");if(A.value&&confirm("Are You Sure You Want To Truncate Locations")===!0)m.value=!0;else return;l&&U.delete("api/users/truncate",{data:{truncate:!0,password_confirmation:l}}).then(({data:d})=>{q(["reloadApp"]),y({locationsData:"locations"}),m.value=!1,t(d)}).catch(d=>t({error:"truncate",e:d}))},columns:C(()=>[{name:"id",align:"center",label:r("ID"),field:"id",sortable:!0},{name:"city",align:"center",label:r("city"),field:"city",sortable:!0},{name:"region",align:"center",label:r("region"),field:"region",sortable:!0},{name:"country",align:"center",label:r("country"),field:"country",sortable:!0},{name:"place",align:"center",label:r("place"),field:"place",sortable:!0},{name:"currency",align:"center",label:r("currency"),field:"currency",sortable:!0},{name:"currency_name",align:"center",label:r("currency_name"),field:"currency_name",sortable:!0},{name:"latitude",align:"center",label:r("latitude"),field:"latitude",sortable:!0},{name:"longitude",align:"center",label:r("longitude"),field:"longitude",sortable:!0},{name:"utc_offset",align:"center",label:r("utc_offset"),field:"utc_offset",sortable:!0},{name:"edit",align:"center",label:r("edit/restore"),field:"edit",sortable:!1},{name:"delete",align:"center",label:r("delete/forever"),field:"delete",sortable:!1}]),rows:C(()=>o[g.value]||[])}}},ee={class:"text-h6"},le={class:"q-pa-sm"},te={class:"row"},ae={class:"q-pa-md"},re={class:"q-pa-md"};function oe(r,o,h,t,m,k){const g=P("google-autocomplete");return Q(),L(T,null,[a(M,{modelValue:t.editLocation,"onUpdate:modelValue":o[6]||(o[6]=e=>t.editLocation=e)},{default:s(()=>[a(W,{class:"my-card text-white",style:{width:"800px"}},{default:s(()=>[a(N,{class:"bg-primary"},{default:s(()=>[x(a(i,{dense:"",round:"",class:"float-right",icon:"close"},null,512),[[I]]),b("div",ee,u(t.place?r.$t("Update Location"):r.$t("Add Location")),1)]),_:1}),b("div",le,[b("div",te,[a(v,{filled:"",type:"text",modelValue:t.place,"onUpdate:modelValue":o[0]||(o[0]=e=>t.place=e),label:r.$t("place"),"lazy-rules":"",class:"col-8","_:error":"place_data ? true : false","_:error-message":"place_data",clearable:"",rules:[e=>e&&e.length>0||r.$t("add_place")]},null,8,["modelValue","label","rules"]),a(v,{filled:"","lazy-rules":"",type:"text",modelValue:t.utc_offset,"onUpdate:modelValue":o[1]||(o[1]=e=>t.utc_offset=e),label:r.$t("utc_offset"),class:"col-4","_:error":"utc_offset_data ? true : false","_:error-message":"utc_offset_data",clearable:"",rules:[e=>e&&e.length>0||r.$t("add_utc_offset")]},null,8,["modelValue","label","rules"]),a(v,{filled:"",type:"text",modelValue:t.latitude,"onUpdate:modelValue":o[2]||(o[2]=e=>t.latitude=e),label:r.$t("latitude"),"lazy-rules":"",class:"col-6","_:error":"latitude_data ? true : false","_:error-message":"latitude_data",clearable:"",rules:[e=>e&&e.length>0||r.$t("add_latitude")]},null,8,["modelValue","label","rules"]),a(v,{filled:"",type:"text",modelValue:t.longitude,"onUpdate:modelValue":o[3]||(o[3]=e=>t.longitude=e),label:r.$t("longitude"),"lazy-rules":"",class:"col-6","_:error":"longitude_data ? true : false","_:error-message":"longitude_data",clearable:"",rules:[e=>e&&e.length>0||r.$t("add_longitude")]},null,8,["modelValue","label","rules"])]),b("div",ae,[a(i,{color:"primary",loading:t.loader,onClick:o[4]||(o[4]=_(e=>t.update(t.Location),["prevent"])),label:t.place?r.$t("Update Location"):r.$t("Add Location")},null,8,["loading","label"]),a(i,{round:"",icon:"fas fa-sync",color:"primary",class:"float-right",onClick:o[5]||(o[5]=_(e=>t.Edit({place:"",latitude:0,longitude:0,utc_offset:0}),["prevent"]))})])])]),_:1})]),_:1},8,["modelValue"]),b("div",re,[a(O,{style:E("height:"+t.height+"px"),class:"my-sticky-virtscroll-table",ref:"table",title:r.$t("locations_list"),rows:t.rows,columns:t.columns,"row-key":"name","virtual-scroll":"","virtual-scroll-item-size":48,"rows-per-page-options":[0],filter:t.filter,"binary-state-sort":""},{body:s(e=>[a(J,{props:e},{default:s(()=>[a(n,{key:"id",props:e},{default:s(()=>[c(u(e.row.id),1)]),_:2},1032,["props"]),a(n,{key:"city",props:e},{default:s(()=>[c(u(e.row.city),1)]),_:2},1032,["props"]),a(n,{key:"region",props:e},{default:s(()=>[c(u(e.row.region),1)]),_:2},1032,["props"]),a(n,{key:"country",props:e},{default:s(()=>[c(u(e.row.country),1)]),_:2},1032,["props"]),a(n,{key:"place",props:e},{default:s(()=>[c(u(e.row.place),1)]),_:2},1032,["props"]),a(n,{key:"currency",props:e},{default:s(()=>[c(u(e.row.currency),1)]),_:2},1032,["props"]),a(n,{key:"currency_name",props:e},{default:s(()=>[c(u(e.row.currency_name),1)]),_:2},1032,["props"]),a(n,{key:"latitude",props:e},{default:s(()=>[c(u(e.row.latitude),1)]),_:2},1032,["props"]),a(n,{key:"longitude",props:e},{default:s(()=>[c(u(e.row.longitude),1)]),_:2},1032,["props"]),a(n,{key:"utc_offset",props:e},{default:s(()=>[c(u(e.row.utc_offset),1)]),_:2},1032,["props"]),t.locationsData=="locations"||t.locationsData=="locDuplicated"?(Q(),L(T,{key:0},[a(n,{key:"edit",props:e},{default:s(()=>[a(i,{icon:"edit",rounded:"",class:"q-ma-md",onClick:_(p=>t.Edit(e.row),["prevent"])},null,8,["onClick"])]),_:2},1032,["props"]),a(n,{key:"delete",props:e},{default:s(()=>[a(i,{icon:"delete",rounded:"",onClick:_(p=>t.Delete(e.row),["prevent"])},null,8,["onClick"])]),_:2},1032,["props"])],64)):(Q(),L(T,{key:1},[a(n,{key:"edit",props:e},{default:s(()=>[a(i,{icon:"restore",rounded:"",class:"q-ma-md",onClick:p=>t.restore(e.row)},null,8,["onClick"])]),_:2},1032,["props"]),a(n,{key:"delete",props:e},{default:s(()=>[a(i,{icon:"delete_forever",rounded:"",onClick:_(p=>t.delete_forever(e.row),["prevent"])},null,8,["onClick"])]),_:2},1032,["props"])],64))]),_:2},1032,["props"])]),"top-right":s(()=>[a(R,{modelValue:t.locationsData,"onUpdate:modelValue":o[7]||(o[7]=e=>t.locationsData=e),push:"","toggle-color":"primary",glossy:"",class:"q-ma-xs col-md-3",options:[{label:r.$t("locations"),value:"locations"},{label:r.$t("duplicated"),value:"locDuplicated"},{label:r.$t("Trash"),value:"locTrashed"}]},null,8,["modelValue","options"]),a(i,{color:"primary",class:"q-ma-xs",icon:"fas fa-plus"},{default:s(()=>[a(X,{"transition-show":"scale","transition-hide":"scale"},{default:s(()=>[a(g)]),_:1})]),_:1}),a(i,{color:"primary",class:"q-ma-xs",icon:"fas fa-cut",loading:t.loader,onClick:t.truncate},null,8,["loading","onClick"]),a(i,{icon:"add","icon-right":"place",color:"primary",class:"q-ma-xs *col-md-1",onClick:o[8]||(o[8]=e=>t.editLocation=!0)}),a(i,{color:"primary",class:"q-ma-xs",icon:"add","icon-right":"fas fa-chart-bar",loading:t.loader,onClick:t.fromAnalytics},null,8,["loading","onClick"]),a(v,{clearable:"",class:"q-ma-xs col-md-3",borderless:"",dense:"",debounce:"300",modelValue:t.filter,"onUpdate:modelValue":o[9]||(o[9]=e=>t.filter=e),placeholder:r.$t("search")},{append:s(()=>[a(G,{name:"search"})]),_:1},8,["modelValue","placeholder"])]),_:1},8,["style","title","rows","columns","filter"])])],64)}var ke=K($,[["render",oe]]);export{ke as default};
