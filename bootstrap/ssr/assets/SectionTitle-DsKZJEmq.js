import { useSSRContext, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.js';
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: 'md:col-span-1 flex justify-between' }, _attrs))}><div class="px-4 sm:px-0"><h3 class="text-lg font-medium text-gray-900">`);
  ssrRenderSlot(_ctx.$slots, 'title', {}, null, _push, _parent);
  _push('</h3><p class="mt-1 text-sm text-gray-600">');
  ssrRenderSlot(_ctx.$slots, 'description', {}, null, _push, _parent);
  _push('</p></div><div class="px-4 sm:px-0">');
  ssrRenderSlot(_ctx.$slots, 'aside', {}, null, _push, _parent);
  _push('</div></div>');
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/SectionTitle.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SectionTitle = /* @__PURE__ */ _export_sfc(_sfc_main, [['ssrRender', _sfc_ssrRender]]);
export {
  SectionTitle as S
};
