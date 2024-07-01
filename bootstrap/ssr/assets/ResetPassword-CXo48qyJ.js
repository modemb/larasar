import { unref, withCtx, createVNode, createTextVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { useForm, Head } from '@inertiajs/vue3';
import { A as AuthenticationCard } from './AuthenticationCard-C9mEk27i.js';
import { _ as _sfc_main$1 } from './AuthenticationCardLogo-BE7wXEGb.js';
import { _ as _sfc_main$3, a as _sfc_main$4 } from './TextInput-B0hF2b1y.js';
import { _ as _sfc_main$2 } from './InputLabel-Do1v5jZF.js';
import { _ as _sfc_main$5 } from './PrimaryButton-DzU40Tsu.js';
import './_plugin-vue_export-helper-1tPrXgE0.js';
const _sfc_main = {
  __name: 'ResetPassword',
  __ssrInlineRender: true,
  props: {
    email: String,
    token: String
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      token: props.token,
      email: props.email,
      password: '',
      password_confirmation: ''
    });
    const submit = () => {
      form.post(route('password.update'), {
        onFinish: () => form.reset('password', 'password_confirmation')
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push('<!--[-->');
      _push(ssrRenderComponent(unref(Head), { title: 'Reset Password' }, null, _parent));
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
            _push2(`<form${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: 'email',
              value: 'Email'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: 'email',
              modelValue: unref(form).email,
              'onUpdate:modelValue': ($event) => unref(form).email = $event,
              type: 'email',
              class: 'mt-1 block w-full',
              required: '',
              autofocus: '',
              autocomplete: 'username'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: 'mt-2',
              message: unref(form).errors.email
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: 'password',
              value: 'Password'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: 'password',
              modelValue: unref(form).password,
              'onUpdate:modelValue': ($event) => unref(form).password = $event,
              type: 'password',
              class: 'mt-1 block w-full',
              required: '',
              autocomplete: 'new-password'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: 'mt-2',
              message: unref(form).errors.password
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-4"${_scopeId}>`);
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
              required: '',
              autocomplete: 'new-password'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: 'mt-2',
              message: unref(form).errors.password_confirmation
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center justify-end mt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$5, {
              class: { 'opacity-25': unref(form).processing },
              disabled: unref(form).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Reset Password ');
                } else {
                  return [
                    createTextVNode(' Reset Password ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2('</div></form>');
          } else {
            return [
              createVNode('form', {
                onSubmit: withModifiers(submit, ['prevent'])
              }, [
                createVNode('div', null, [
                  createVNode(_sfc_main$2, {
                    for: 'email',
                    value: 'Email'
                  }),
                  createVNode(_sfc_main$3, {
                    id: 'email',
                    modelValue: unref(form).email,
                    'onUpdate:modelValue': ($event) => unref(form).email = $event,
                    type: 'email',
                    class: 'mt-1 block w-full',
                    required: '',
                    autofocus: '',
                    autocomplete: 'username'
                  }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                  createVNode(_sfc_main$4, {
                    class: 'mt-2',
                    message: unref(form).errors.email
                  }, null, 8, ['message'])
                ]),
                createVNode('div', { class: 'mt-4' }, [
                  createVNode(_sfc_main$2, {
                    for: 'password',
                    value: 'Password'
                  }),
                  createVNode(_sfc_main$3, {
                    id: 'password',
                    modelValue: unref(form).password,
                    'onUpdate:modelValue': ($event) => unref(form).password = $event,
                    type: 'password',
                    class: 'mt-1 block w-full',
                    required: '',
                    autocomplete: 'new-password'
                  }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                  createVNode(_sfc_main$4, {
                    class: 'mt-2',
                    message: unref(form).errors.password
                  }, null, 8, ['message'])
                ]),
                createVNode('div', { class: 'mt-4' }, [
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
                    required: '',
                    autocomplete: 'new-password'
                  }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                  createVNode(_sfc_main$4, {
                    class: 'mt-2',
                    message: unref(form).errors.password_confirmation
                  }, null, 8, ['message'])
                ]),
                createVNode('div', { class: 'flex items-center justify-end mt-4' }, [
                  createVNode(_sfc_main$5, {
                    class: { 'opacity-25': unref(form).processing },
                    disabled: unref(form).processing
                  }, {
                    default: withCtx(() => [
                      createTextVNode(' Reset Password ')
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Pages/Auth/ResetPassword.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
