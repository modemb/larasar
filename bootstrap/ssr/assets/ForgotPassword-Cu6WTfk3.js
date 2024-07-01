import { unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { useForm, Head } from '@inertiajs/vue3';
import { A as AuthenticationCard } from './AuthenticationCard-C9mEk27i.js';
import { _ as _sfc_main$1 } from './AuthenticationCardLogo-BE7wXEGb.js';
import { _ as _sfc_main$3, a as _sfc_main$4 } from './TextInput-B0hF2b1y.js';
import { _ as _sfc_main$2 } from './InputLabel-Do1v5jZF.js';
import { _ as _sfc_main$5 } from './PrimaryButton-DzU40Tsu.js';
import './_plugin-vue_export-helper-1tPrXgE0.js';
const _sfc_main = {
  __name: 'ForgotPassword',
  __ssrInlineRender: true,
  props: {
    status: String
  },
  setup(__props) {
    const form = useForm({
      email: ''
    });
    const submit = () => {
      form.post(route('password.email'));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push('<!--[-->');
      _push(ssrRenderComponent(unref(Head), { title: 'Forgot Password' }, null, _parent));
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
            _push2(`<div class="mb-4 text-sm text-gray-600"${_scopeId}> Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one. </div>`);
            if (__props.status) {
              _push2(`<div class="mb-4 font-medium text-sm text-green-600"${_scopeId}>${ssrInterpolate(__props.status)}</div>`);
            } else {
              _push2('<!---->');
            }
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
            _push2(`</div><div class="flex items-center justify-end mt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$5, {
              class: { 'opacity-25': unref(form).processing },
              disabled: unref(form).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Email Password Reset Link ');
                } else {
                  return [
                    createTextVNode(' Email Password Reset Link ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2('</div></form>');
          } else {
            return [
              createVNode('div', { class: 'mb-4 text-sm text-gray-600' }, ' Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one. '),
              __props.status ? (openBlock(), createBlock('div', {
                key: 0,
                class: 'mb-4 font-medium text-sm text-green-600'
              }, toDisplayString(__props.status), 1)) : createCommentVNode('', true),
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
                createVNode('div', { class: 'flex items-center justify-end mt-4' }, [
                  createVNode(_sfc_main$5, {
                    class: { 'opacity-25': unref(form).processing },
                    disabled: unref(form).processing
                  }, {
                    default: withCtx(() => [
                      createTextVNode(' Email Password Reset Link ')
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Pages/Auth/ForgotPassword.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
