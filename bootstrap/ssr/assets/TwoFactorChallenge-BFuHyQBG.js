import { ref, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, Fragment, withModifiers, useSSRContext, nextTick } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { useForm, Head } from '@inertiajs/vue3';
import { A as AuthenticationCard } from './AuthenticationCard-C9mEk27i.js';
import { _ as _sfc_main$1 } from './AuthenticationCardLogo-BE7wXEGb.js';
import { _ as _sfc_main$3, a as _sfc_main$4 } from './TextInput-B0hF2b1y.js';
import { _ as _sfc_main$2 } from './InputLabel-Do1v5jZF.js';
import { _ as _sfc_main$5 } from './PrimaryButton-DzU40Tsu.js';
import './_plugin-vue_export-helper-1tPrXgE0.js';
const _sfc_main = {
  __name: 'TwoFactorChallenge',
  __ssrInlineRender: true,
  setup(__props) {
    const recovery = ref(false);
    const form = useForm({
      code: '',
      recovery_code: ''
    });
    const recoveryCodeInput = ref(null);
    const codeInput = ref(null);
    const toggleRecovery = async () => {
      recovery.value ^= true;
      await nextTick();
      if (recovery.value) {
        recoveryCodeInput.value.focus();
        form.code = '';
      } else {
        codeInput.value.focus();
        form.recovery_code = '';
      }
    };
    const submit = () => {
      form.post(route('two-factor.login'));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push('<!--[-->');
      _push(ssrRenderComponent(unref(Head), { title: 'Two-factor Confirmation' }, null, _parent));
      _push(ssrRenderComponent(AuthenticationCard, null, {
        logo: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$1)
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-4 text-sm text-gray-600"${_scopeId}>`);
            if (!recovery.value) {
              _push2('<!--[--> Please confirm access to your account by entering the authentication code provided by your authenticator application. <!--]-->');
            } else {
              _push2('<!--[--> Please confirm access to your account by entering one of your emergency recovery codes. <!--]-->');
            }
            _push2(`</div><form${_scopeId}>`);
            if (!recovery.value) {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                for: 'code',
                value: 'Code'
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$3, {
                id: 'code',
                ref_key: 'codeInput',
                ref: codeInput,
                modelValue: unref(form).code,
                'onUpdate:modelValue': ($event) => unref(form).code = $event,
                type: 'text',
                inputmode: 'numeric',
                class: 'mt-1 block w-full',
                autofocus: '',
                autocomplete: 'one-time-code'
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$4, {
                class: 'mt-2',
                message: unref(form).errors.code
              }, null, _parent2, _scopeId));
              _push2('</div>');
            } else {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                for: 'recovery_code',
                value: 'Recovery Code'
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$3, {
                id: 'recovery_code',
                ref_key: 'recoveryCodeInput',
                ref: recoveryCodeInput,
                modelValue: unref(form).recovery_code,
                'onUpdate:modelValue': ($event) => unref(form).recovery_code = $event,
                type: 'text',
                class: 'mt-1 block w-full',
                autocomplete: 'one-time-code'
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$4, {
                class: 'mt-2',
                message: unref(form).errors.recovery_code
              }, null, _parent2, _scopeId));
              _push2('</div>');
            }
            _push2(`<div class="flex items-center justify-end mt-4"${_scopeId}><button type="button" class="text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer"${_scopeId}>`);
            if (!recovery.value) {
              _push2('<!--[--> Use a recovery code <!--]-->');
            } else {
              _push2('<!--[--> Use an authentication code <!--]-->');
            }
            _push2('</button>');
            _push2(ssrRenderComponent(_sfc_main$5, {
              class: ['ms-4', { 'opacity-25': unref(form).processing }],
              disabled: unref(form).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Log in ');
                } else {
                  return [
                    createTextVNode(' Log in ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2('</div></form>');
          } else {
            return [
              createVNode('div', { class: 'mb-4 text-sm text-gray-600' }, [
                !recovery.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                  createTextVNode(' Please confirm access to your account by entering the authentication code provided by your authenticator application. ')
                ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                  createTextVNode(' Please confirm access to your account by entering one of your emergency recovery codes. ')
                ], 64))
              ]),
              createVNode('form', {
                onSubmit: withModifiers(submit, ['prevent'])
              }, [
                !recovery.value ? (openBlock(), createBlock('div', { key: 0 }, [
                  createVNode(_sfc_main$2, {
                    for: 'code',
                    value: 'Code'
                  }),
                  createVNode(_sfc_main$3, {
                    id: 'code',
                    ref_key: 'codeInput',
                    ref: codeInput,
                    modelValue: unref(form).code,
                    'onUpdate:modelValue': ($event) => unref(form).code = $event,
                    type: 'text',
                    inputmode: 'numeric',
                    class: 'mt-1 block w-full',
                    autofocus: '',
                    autocomplete: 'one-time-code'
                  }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                  createVNode(_sfc_main$4, {
                    class: 'mt-2',
                    message: unref(form).errors.code
                  }, null, 8, ['message'])
                ])) : (openBlock(), createBlock('div', { key: 1 }, [
                  createVNode(_sfc_main$2, {
                    for: 'recovery_code',
                    value: 'Recovery Code'
                  }),
                  createVNode(_sfc_main$3, {
                    id: 'recovery_code',
                    ref_key: 'recoveryCodeInput',
                    ref: recoveryCodeInput,
                    modelValue: unref(form).recovery_code,
                    'onUpdate:modelValue': ($event) => unref(form).recovery_code = $event,
                    type: 'text',
                    class: 'mt-1 block w-full',
                    autocomplete: 'one-time-code'
                  }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                  createVNode(_sfc_main$4, {
                    class: 'mt-2',
                    message: unref(form).errors.recovery_code
                  }, null, 8, ['message'])
                ])),
                createVNode('div', { class: 'flex items-center justify-end mt-4' }, [
                  createVNode('button', {
                    type: 'button',
                    class: 'text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer',
                    onClick: withModifiers(toggleRecovery, ['prevent'])
                  }, [
                    !recovery.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createTextVNode(' Use a recovery code ')
                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createTextVNode(' Use an authentication code ')
                    ], 64))
                  ]),
                  createVNode(_sfc_main$5, {
                    class: ['ms-4', { 'opacity-25': unref(form).processing }],
                    disabled: unref(form).processing
                  }, {
                    default: withCtx(() => [
                      createTextVNode(' Log in ')
                    ]),
                    _: 1
                  }, 8, ['class', 'disabled'])
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push('<!--]-->');
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Pages/Auth/TwoFactorChallenge.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
