import { ssrRenderAttrs, ssrRenderStyle, ssrRenderSlot } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
const _sfc_main = {
  __name: 'ActionMessage',
  __ssrInlineRender: true,
  props: {
    on: Boolean
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle(__props.on ? null : { display: 'none' })}" class="text-sm text-gray-600">`);
      ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
      _push('</div></div>');
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/ActionMessage.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
