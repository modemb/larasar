import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.js';
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: 'hidden sm:block' }, _attrs))}><div class="py-8"><div class="border-t border-gray-200"></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/SectionBorder.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SectionBorder = /* @__PURE__ */ _export_sfc(_sfc_main, [['ssrRender', _sfc_ssrRender]]);
export {
  SectionBorder as S
};
