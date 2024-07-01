import { mergeProps, withCtx, renderSlot, useSSRContext, ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';
import { S as SectionTitle } from './SectionTitle-DsKZJEmq.js';
const _sfc_main$1 = {
  __name: 'ActionSection',
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'md:grid md:grid-cols-3 md:gap-6' }, _attrs))}>`);
      _push(ssrRenderComponent(SectionTitle, null, {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, 'title', {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, 'title')
            ];
          }
        }),
        description: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, 'description', {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, 'description')
            ];
          }
        }),
        _: 3
      }, _parent));
      _push('<div class="mt-5 md:mt-0 md:col-span-2"><div class="px-4 py-5 sm:p-6 bg-white shadow sm:rounded-lg">');
      ssrRenderSlot(_ctx.$slots, 'content', {}, null, _push, _parent);
      _push('</div></div></div>');
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/ActionSection.vue');
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: 'Modal',
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
    const props = __props;
    const emit = __emit;
    const dialog = ref();
    const showSlot = ref(props.show);
    watch(() => props.show, () => {
      var _a;
      if (props.show) {
        document.body.style.overflow = 'hidden';
        showSlot.value = true;
        (_a = dialog.value) == null ? void 0 : _a.showModal();
      } else {
        document.body.style.overflow = null;
        setTimeout(() => {
          var _a2;
          (_a2 = dialog.value) == null ? void 0 : _a2.close();
          showSlot.value = false;
        }, 200);
      }
    });
    const close = () => {
      if (props.closeable) {
        emit('close');
      }
    };
    const closeOnEscape = (e) => {
      if (e.key === 'Escape' && props.show) {
        close();
      }
    };
    onMounted(() => document.addEventListener('keydown', closeOnEscape));
    onUnmounted(() => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = null;
    });
    const maxWidthClass = computed(() => {
      return {
        'sm': 'sm:max-w-sm',
        'md': 'sm:max-w-md',
        'lg': 'sm:max-w-lg',
        'xl': 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl'
      }[props.maxWidth];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<dialog${ssrRenderAttrs(mergeProps({
        class: 'z-50 m-0 min-h-full min-w-full overflow-y-auto bg-transparent backdrop:bg-transparent',
        ref_key: 'dialog',
        ref: dialog
      }, _attrs))}><div class="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50" scroll-region><div style="${ssrRenderStyle(__props.show ? null : { display: 'none' })}" class="fixed inset-0 transform transition-all"><div class="absolute inset-0 bg-gray-500 opacity-75"></div></div><div style="${ssrRenderStyle(__props.show ? null : { display: 'none' })}" class="${ssrRenderClass([maxWidthClass.value, 'mb-6 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:mx-auto'])}">`);
      if (showSlot.value) {
        ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
      } else {
        _push('<!---->');
      }
      _push('</div></div></dialog>');
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Components/Modal.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main$1 as _,
  _sfc_main as a
};
