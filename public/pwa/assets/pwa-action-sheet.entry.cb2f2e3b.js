import{h as i,g as s,r as p,c as a}from"./MainLayout.19e14895.js";import"./index.a0547624.js";import"./QCardSection.f50f26ff.js";import"./QCard.0993d832.js";import"./use-dark.8f226bc0.js";import"./QCheckbox.b19fbb11.js";import"./ClosePopup.80a36c56.js";import"./QLayout.744b3411.js";import"./QFooter.d14f749b.js";import"./QImg.2907b5d4.js";import"./QToggle.9c4a91bf.js";import"./QSeparator.bdc2a422.js";import"./QTable.1f996658.js";import"./LocaleDropdown.1d6a1a00.js";import"./axios.f7466c17.js";import"./i18n.184d27f4.js";import"./plugin-vue_export-helper.21dcd24c.js";import"./QPageContainer.80b08606.js";import"./use-quasar.ae366b6a.js";import"./Functions.1e50194a.js";import"./export-file.878e87fb.js";import"./QForm.a37ec1ca.js";import"./GoogleAutocomplete.cddb9345.js";import"./UserReports.2b986031.js";import"./QPopupProxy.e0979337.js";import"./QTooltip.9359b4e9.js";import"./QTr.20580798.js";import"./UserShare.b2ea7ec7.js";var c=':host{z-index:1000;position:fixed;top:0;left:0;width:100%;height:100%;display:-ms-flexbox;display:flex;contain:strict;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;font-family:-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif}.wrapper{-ms-flex:1;flex:1;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;background-color:rgba(0, 0, 0, 0);-webkit-transition:400ms background-color cubic-bezier(.36,.66,.04,1);transition:400ms background-color cubic-bezier(.36,.66,.04,1)}.wrapper.open{background-color:rgba(0, 0, 0, 0.32)}.title{color:#999;height:23px;line-height:23px;padding-bottom:17px;-webkit-padding-end:16px;padding-inline-end:16px;-webkit-padding-start:16px;padding-inline-start:16px;padding-left:16px;padding-right:16px;padding-top:20px}.content{width:568px;-ms-flex-item-align:end;align-self:flex-end;background-color:#fff;-webkit-transition:400ms -webkit-transform cubic-bezier(.36,.66,.04,1);transition:400ms -webkit-transform cubic-bezier(.36,.66,.04,1);transition:400ms transform cubic-bezier(.36,.66,.04,1);transition:400ms transform cubic-bezier(.36,.66,.04,1), 400ms -webkit-transform cubic-bezier(.36,.66,.04,1);-webkit-transform:translateY(100%);transform:translateY(100%)}.wrapper.open .content{-webkit-transform:translateY(0%);transform:translateY(0%)}@media only screen and (max-width: 568px){.content{width:100%}}.action-sheet-option{cursor:pointer;height:52px;line-height:52px}.action-sheet-button{color:rgb(38, 38, 38);font-size:16px;-webkit-padding-end:16px;padding-inline-end:16px;-webkit-padding-start:16px;padding-inline-start:16px;padding-left:16px;padding-right:16px;padding-top:0px}.action-sheet-button:hover{background-color:#F6F6F6}',l=function(){function e(t){p(this,t),this.onSelection=a(this,"onSelection",7),this.header=void 0,this.cancelable=!0,this.options=[],this.open=!1}return e.prototype.componentDidLoad=function(){var t=this;requestAnimationFrame(function(){t.open=!0})},e.prototype.dismiss=function(){this.cancelable&&this.close()},e.prototype.close=function(){var t=this;this.open=!1,setTimeout(function(){t.el.parentNode.removeChild(t.el)},500)},e.prototype.handleOptionClick=function(t,n){t.stopPropagation(),this.onSelection.emit(n),this.close()},e.prototype.render=function(){var t=this;return i("div",{class:"wrapper".concat(this.open?" open":""),onClick:function(){return t.dismiss()}},i("div",{class:"content"},i("div",{class:"title"},this.header),this.options.map(function(n,o){return i("div",{class:"action-sheet-option",onClick:function(r){return t.handleOptionClick(r,o)}},i("div",{class:"action-sheet-button"},n.title))})))},Object.defineProperty(e.prototype,"el",{get:function(){return s(this)},enumerable:!1,configurable:!0}),e}();l.style=c;export{l as pwa_action_sheet};