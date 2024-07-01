import { mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import _sfc_main$2 from './ApiTokenManager-D88Qt-PO.js';
import { _ as _sfc_main$1 } from './AppLayout-vAVHwAbW.js';
import '@inertiajs/vue3';
import './ActionMessage-CMRC4Q_0.js';
import './Modal-DjTyZJG3.js';
import './SectionTitle-DsKZJEmq.js';
import './_plugin-vue_export-helper-1tPrXgE0.js';
import './Checkbox-BBcrr1ex.js';
import './ConfirmationModal-BuUXITCv.js';
import './DangerButton-s5hiF3bK.js';
import './DialogModal-xsy0v24U.js';
import './FormSection-Cf0LXcE6.js';
import './TextInput-B0hF2b1y.js';
import './InputLabel-Do1v5jZF.js';
import './PrimaryButton-DzU40Tsu.js';
import './SecondaryButton-CuwfkeiC.js';
import './SectionBorder-DyqoGRve.js';
const _sfc_main = {
  __name: 'Index',
  __ssrInlineRender: true,
  props: {
    tokens: Array,
    availablePermissions: Array,
    defaultPermissions: Array
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: 'API Tokens' }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 class="font-semibold text-xl text-gray-800 leading-tight"${_scopeId}> API Tokens </h2>`);
          } else {
            return [
              createVNode('h2', { class: 'font-semibold text-xl text-gray-800 leading-tight' }, ' API Tokens ')
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              tokens: __props.tokens,
              'available-permissions': __props.availablePermissions,
              'default-permissions': __props.defaultPermissions
            }, null, _parent2, _scopeId));
            _push2('</div></div>');
          } else {
            return [
              createVNode('div', null, [
                createVNode('div', { class: 'max-w-7xl mx-auto py-10 sm:px-6 lg:px-8' }, [
                  createVNode(_sfc_main$2, {
                    tokens: __props.tokens,
                    'available-permissions': __props.availablePermissions,
                    'default-permissions': __props.defaultPermissions
                  }, null, 8, ['tokens', 'available-permissions', 'default-permissions'])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Pages/API/Index.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
