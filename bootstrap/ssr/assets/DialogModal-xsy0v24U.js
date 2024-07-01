import { mergeProps, withCtx, createVNode, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { a as _sfc_main$1 } from './Modal-DjTyZJG3.js';
const _sfc_main = {
  __name: 'DialogModal',
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: '2xl'
    },
    closeable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const close = () => {
      emit('close');
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        show: __props.show,
        'max-width': __props.maxWidth,
        closeable: __props.closeable,
        onClose: close
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-6 py-4"${_scopeId}><div class="text-lg font-medium text-gray-900"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, 'title', {}, null, _push2, _parent2, _scopeId);
            _push2(`</div><div class="mt-4 text-sm text-gray-600"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, 'content', {}, null, _push2, _parent2, _scopeId);
            _push2(`</div></div><div class="flex flex-row justify-end px-6 py-4 bg-gray-100 text-end"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, 'footer', {}, null, _push2, _parent2, _scopeId);
            _push2('</div>');
          } else {
            return [
              createVNode('div', { class: 'px-6 py-4' }, [
                createVNode('div', { class: 'text-lg font-medium text-gray-900' }, [
                  renderSlot(_ctx.$slots, 'title')
                ]),
                createVNode('div', { class: 'mt-4 text-sm text-gray-600' }, [
                  renderSlot(_ctx.$slots, 'content')
                ])
              ]),
              createVNode('div', { class: 'flex flex-row justify-end px-6 py-4 bg-gray-100 text-end' }, [
                renderSlot(_ctx.$slots, 'footer')
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/DialogModal.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
