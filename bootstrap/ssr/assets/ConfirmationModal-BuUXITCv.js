import { mergeProps, withCtx, createVNode, openBlock, createBlock, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { a as _sfc_main$1 } from './Modal-DjTyZJG3.js';
const _sfc_main = {
  __name: 'ConfirmationModal',
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
            _push2(`<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"${_scopeId}><div class="sm:flex sm:items-start"${_scopeId}><div class="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"${_scopeId}><svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"${_scopeId}></path></svg></div><div class="mt-3 text-center sm:mt-0 sm:ms-4 sm:text-start"${_scopeId}><h3 class="text-lg font-medium text-gray-900"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, 'title', {}, null, _push2, _parent2, _scopeId);
            _push2(`</h3><div class="mt-4 text-sm text-gray-600"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, 'content', {}, null, _push2, _parent2, _scopeId);
            _push2(`</div></div></div></div><div class="flex flex-row justify-end px-6 py-4 bg-gray-100 text-end"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, 'footer', {}, null, _push2, _parent2, _scopeId);
            _push2('</div>');
          } else {
            return [
              createVNode('div', { class: 'bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4' }, [
                createVNode('div', { class: 'sm:flex sm:items-start' }, [
                  createVNode('div', { class: 'mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10' }, [
                    (openBlock(), createBlock('svg', {
                      class: 'h-6 w-6 text-red-600',
                      xmlns: 'http://www.w3.org/2000/svg',
                      fill: 'none',
                      viewBox: '0 0 24 24',
                      'stroke-width': '1.5',
                      stroke: 'currentColor'
                    }, [
                      createVNode('path', {
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        d: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
                      })
                    ]))
                  ]),
                  createVNode('div', { class: 'mt-3 text-center sm:mt-0 sm:ms-4 sm:text-start' }, [
                    createVNode('h3', { class: 'text-lg font-medium text-gray-900' }, [
                      renderSlot(_ctx.$slots, 'title')
                    ]),
                    createVNode('div', { class: 'mt-4 text-sm text-gray-600' }, [
                      renderSlot(_ctx.$slots, 'content')
                    ])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/ConfirmationModal.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
