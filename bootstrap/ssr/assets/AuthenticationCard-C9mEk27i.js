import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.js';
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: 'min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100' }, _attrs))}><div>`);
  ssrRenderSlot(_ctx.$slots, 'logo', {}, null, _push, _parent);
  _push('</div><div class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">');
  ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
  _push('</div></div>');
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/AuthenticationCard.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AuthenticationCard = /* @__PURE__ */ _export_sfc(_sfc_main, [['ssrRender', _sfc_ssrRender]]);
export {
  AuthenticationCard as A
};
