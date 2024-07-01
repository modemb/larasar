import { ref, mergeProps, withCtx, createTextVNode, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { useForm } from '@inertiajs/vue3';
import { _ as _sfc_main$5 } from './ActionMessage-CMRC4Q_0.js';
import { _ as _sfc_main$1 } from './FormSection-Cf0LXcE6.js';
import { _ as _sfc_main$3, a as _sfc_main$4 } from './TextInput-B0hF2b1y.js';
import { _ as _sfc_main$2 } from './InputLabel-Do1v5jZF.js';
import { _ as _sfc_main$6 } from './PrimaryButton-DzU40Tsu.js';
import './SectionTitle-DsKZJEmq.js';
import './_plugin-vue_export-helper-1tPrXgE0.js';
const _sfc_main = {
  __name: 'UpdatePasswordForm',
  __ssrInlineRender: true,
  setup(__props) {
    const passwordInput = ref(null);
    const currentPasswordInput = ref(null);
    const form = useForm({
      current_password: '',
      password: '',
      password_confirmation: ''
    });
    const updatePassword = () => {
      form.put(route('user-password.update'), {
        errorBag: 'updatePassword',
        preserveScroll: true,
        onSuccess: () => form.reset(),
        onError: () => {
          if (form.errors.password) {
            form.reset('password', 'password_confirmation');
            passwordInput.value.focus();
          }
          if (form.errors.current_password) {
            form.reset('current_password');
            currentPasswordInput.value.focus();
          }
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ onSubmitted: updatePassword }, _attrs), {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(' Update Password ');
          } else {
            return [
              createTextVNode(' Update Password ')
            ];
          }
        }),
        description: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(' Ensure your account is using a long, random password to stay secure. ');
          } else {
            return [
              createTextVNode(' Ensure your account is using a long, random password to stay secure. ')
            ];
          }
        }),
        form: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="col-span-6 sm:col-span-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: 'current_password',
              value: 'Current Password'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: 'current_password',
              ref_key: 'currentPasswordInput',
              ref: currentPasswordInput,
              modelValue: unref(form).current_password,
              'onUpdate:modelValue': ($event) => unref(form).current_password = $event,
              type: 'password',
              class: 'mt-1 block w-full',
              autocomplete: 'current-password'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.current_password,
              class: 'mt-2'
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-span-6 sm:col-span-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: 'password',
              value: 'New Password'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: 'password',
              ref_key: 'passwordInput',
              ref: passwordInput,
              modelValue: unref(form).password,
              'onUpdate:modelValue': ($event) => unref(form).password = $event,
              type: 'password',
              class: 'mt-1 block w-full',
              autocomplete: 'new-password'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.password,
              class: 'mt-2'
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-span-6 sm:col-span-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: 'password_confirmation',
              value: 'Confirm Password'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: 'password_confirmation',
              modelValue: unref(form).password_confirmation,
              'onUpdate:modelValue': ($event) => unref(form).password_confirmation = $event,
              type: 'password',
              class: 'mt-1 block w-full',
              autocomplete: 'new-password'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.password_confirmation,
              class: 'mt-2'
            }, null, _parent2, _scopeId));
            _push2('</div>');
          } else {
            return [
              createVNode('div', { class: 'col-span-6 sm:col-span-4' }, [
                createVNode(_sfc_main$2, {
                  for: 'current_password',
                  value: 'Current Password'
                }),
                createVNode(_sfc_main$3, {
                  id: 'current_password',
                  ref_key: 'currentPasswordInput',
                  ref: currentPasswordInput,
                  modelValue: unref(form).current_password,
                  'onUpdate:modelValue': ($event) => unref(form).current_password = $event,
                  type: 'password',
                  class: 'mt-1 block w-full',
                  autocomplete: 'current-password'
                }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                createVNode(_sfc_main$4, {
                  message: unref(form).errors.current_password,
                  class: 'mt-2'
                }, null, 8, ['message'])
              ]),
              createVNode('div', { class: 'col-span-6 sm:col-span-4' }, [
                createVNode(_sfc_main$2, {
                  for: 'password',
                  value: 'New Password'
                }),
                createVNode(_sfc_main$3, {
                  id: 'password',
                  ref_key: 'passwordInput',
                  ref: passwordInput,
                  modelValue: unref(form).password,
                  'onUpdate:modelValue': ($event) => unref(form).password = $event,
                  type: 'password',
                  class: 'mt-1 block w-full',
                  autocomplete: 'new-password'
                }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                createVNode(_sfc_main$4, {
                  message: unref(form).errors.password,
                  class: 'mt-2'
                }, null, 8, ['message'])
              ]),
              createVNode('div', { class: 'col-span-6 sm:col-span-4' }, [
                createVNode(_sfc_main$2, {
                  for: 'password_confirmation',
                  value: 'Confirm Password'
                }),
                createVNode(_sfc_main$3, {
                  id: 'password_confirmation',
                  modelValue: unref(form).password_confirmation,
                  'onUpdate:modelValue': ($event) => unref(form).password_confirmation = $event,
                  type: 'password',
                  class: 'mt-1 block w-full',
                  autocomplete: 'new-password'
                }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                createVNode(_sfc_main$4, {
                  message: unref(form).errors.password_confirmation,
                  class: 'mt-2'
                }, null, 8, ['message'])
              ])
            ];
          }
        }),
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$5, {
              on: unref(form).recentlySuccessful,
              class: 'me-3'
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Saved. ');
                } else {
                  return [
                    createTextVNode(' Saved. ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$6, {
              class: { 'opacity-25': unref(form).processing },
              disabled: unref(form).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Save ');
                } else {
                  return [
                    createTextVNode(' Save ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$5, {
                on: unref(form).recentlySuccessful,
                class: 'me-3'
              }, {
                default: withCtx(() => [
                  createTextVNode(' Saved. ')
                ]),
                _: 1
              }, 8, ['on']),
              createVNode(_sfc_main$6, {
                class: { 'opacity-25': unref(form).processing },
                disabled: unref(form).processing
              }, {
                default: withCtx(() => [
                  createTextVNode(' Save ')
                ]),
                _: 1
              }, 8, ['class', 'disabled'])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Pages/Profile/Partials/UpdatePasswordForm.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
