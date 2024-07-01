import { mergeProps, withCtx, createVNode, openBlock, createBlock, createCommentVNode, Fragment, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './AppLayout-vAVHwAbW.js';
import _sfc_main$6 from './DeleteUserForm-CoSFEzPJ.js';
import _sfc_main$5 from './LogoutOtherBrowserSessionsForm-COkCYuYz.js';
import { S as SectionBorder } from './SectionBorder-DyqoGRve.js';
import _sfc_main$4 from './TwoFactorAuthenticationForm-D4lOkcly.js';
import _sfc_main$3 from './UpdatePasswordForm-DVX3CHcn.js';
import _sfc_main$2 from './UpdateProfileInformationForm-DCPNO_zT.js';
import '@inertiajs/vue3';
import './_plugin-vue_export-helper-1tPrXgE0.js';
import './Modal-DjTyZJG3.js';
import './SectionTitle-DsKZJEmq.js';
import './DangerButton-s5hiF3bK.js';
import './DialogModal-xsy0v24U.js';
import './TextInput-B0hF2b1y.js';
import './SecondaryButton-CuwfkeiC.js';
import './ActionMessage-CMRC4Q_0.js';
import './PrimaryButton-DzU40Tsu.js';
import './InputLabel-Do1v5jZF.js';
import './FormSection-Cf0LXcE6.js';
const _sfc_main = {
  __name: 'Show',
  __ssrInlineRender: true,
  props: {
    confirmsTwoFactorAuthentication: Boolean,
    sessions: Array
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: 'Profile' }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 class="font-semibold text-xl text-gray-800 leading-tight"${_scopeId}> Profile </h2>`);
          } else {
            return [
              createVNode('h2', { class: 'font-semibold text-xl text-gray-800 leading-tight' }, ' Profile ')
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8"${_scopeId}>`);
            if (_ctx.$page.props.jetstream.canUpdateProfileInformation) {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                user: _ctx.$page.props.auth.user
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(SectionBorder, null, null, _parent2, _scopeId));
              _push2('</div>');
            } else {
              _push2('<!---->');
            }
            if (_ctx.$page.props.jetstream.canUpdatePassword) {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, { class: 'mt-10 sm:mt-0' }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(SectionBorder, null, null, _parent2, _scopeId));
              _push2('</div>');
            } else {
              _push2('<!---->');
            }
            if (_ctx.$page.props.jetstream.canManageTwoFactorAuthentication) {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$4, {
                'requires-confirmation': __props.confirmsTwoFactorAuthentication,
                class: 'mt-10 sm:mt-0'
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(SectionBorder, null, null, _parent2, _scopeId));
              _push2('</div>');
            } else {
              _push2('<!---->');
            }
            _push2(ssrRenderComponent(_sfc_main$5, {
              sessions: __props.sessions,
              class: 'mt-10 sm:mt-0'
            }, null, _parent2, _scopeId));
            if (_ctx.$page.props.jetstream.hasAccountDeletionFeatures) {
              _push2('<!--[-->');
              _push2(ssrRenderComponent(SectionBorder, null, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$6, { class: 'mt-10 sm:mt-0' }, null, _parent2, _scopeId));
              _push2('<!--]-->');
            } else {
              _push2('<!---->');
            }
            _push2('</div></div>');
          } else {
            return [
              createVNode('div', null, [
                createVNode('div', { class: 'max-w-7xl mx-auto py-10 sm:px-6 lg:px-8' }, [
                  _ctx.$page.props.jetstream.canUpdateProfileInformation ? (openBlock(), createBlock('div', { key: 0 }, [
                    createVNode(_sfc_main$2, {
                      user: _ctx.$page.props.auth.user
                    }, null, 8, ['user']),
                    createVNode(SectionBorder)
                  ])) : createCommentVNode('', true),
                  _ctx.$page.props.jetstream.canUpdatePassword ? (openBlock(), createBlock('div', { key: 1 }, [
                    createVNode(_sfc_main$3, { class: 'mt-10 sm:mt-0' }),
                    createVNode(SectionBorder)
                  ])) : createCommentVNode('', true),
                  _ctx.$page.props.jetstream.canManageTwoFactorAuthentication ? (openBlock(), createBlock('div', { key: 2 }, [
                    createVNode(_sfc_main$4, {
                      'requires-confirmation': __props.confirmsTwoFactorAuthentication,
                      class: 'mt-10 sm:mt-0'
                    }, null, 8, ['requires-confirmation']),
                    createVNode(SectionBorder)
                  ])) : createCommentVNode('', true),
                  createVNode(_sfc_main$5, {
                    sessions: __props.sessions,
                    class: 'mt-10 sm:mt-0'
                  }, null, 8, ['sessions']),
                  _ctx.$page.props.jetstream.hasAccountDeletionFeatures ? (openBlock(), createBlock(Fragment, { key: 3 }, [
                    createVNode(SectionBorder),
                    createVNode(_sfc_main$6, { class: 'mt-10 sm:mt-0' })
                  ], 64)) : createCommentVNode('', true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Pages/Profile/Show.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
