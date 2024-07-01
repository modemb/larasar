import { unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { useForm, Head, Link } from '@inertiajs/vue3';
import { A as AuthenticationCard } from './AuthenticationCard-C9mEk27i.js';
import { _ as _sfc_main$1 } from './AuthenticationCardLogo-BE7wXEGb.js';
import { _ as _sfc_main$5 } from './Checkbox-BBcrr1ex.js';
import { _ as _sfc_main$3, a as _sfc_main$4 } from './TextInput-B0hF2b1y.js';
import { _ as _sfc_main$2 } from './InputLabel-Do1v5jZF.js';
import { _ as _sfc_main$6 } from './PrimaryButton-DzU40Tsu.js';
import './_plugin-vue_export-helper-1tPrXgE0.js';
const _sfc_main = {
  __name: 'Login',
  __ssrInlineRender: true,
  props: {
    canResetPassword: Boolean,
    status: String
  },
  setup(__props) {
    const form = useForm({
      email: '',
      password: '',
      remember: false
    });
    const submit = () => {
      form.transform((data) => ({
        ...data,
        remember: form.remember ? 'on' : ''
      })).post(route('login'), {
        onFinish: () => form.reset('password')
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push('<!--[-->');
      _push(ssrRenderComponent(unref(Head), { title: 'Log in' }, null, _parent));
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
              autocomplete: 'current-password'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: 'mt-2',
              message: unref(form).errors.password
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="block mt-4"${_scopeId}><label class="flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$5, {
              checked: unref(form).remember,
              'onUpdate:checked': ($event) => unref(form).remember = $event,
              name: 'remember'
            }, null, _parent2, _scopeId));
            _push2(`<span class="ms-2 text-sm text-gray-600"${_scopeId}>Remember me</span></label></div><div class="flex items-center justify-end mt-4"${_scopeId}>`);
            if (__props.canResetPassword) {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route('password.request'),
                class: 'underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(' Forgot your password? ');
                  } else {
                    return [
                      createTextVNode(' Forgot your password? ')
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2('<!---->');
            }
            _push2(ssrRenderComponent(_sfc_main$6, {
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
                    autocomplete: 'current-password'
                  }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                  createVNode(_sfc_main$4, {
                    class: 'mt-2',
                    message: unref(form).errors.password
                  }, null, 8, ['message'])
                ]),
                createVNode('div', { class: 'block mt-4' }, [
                  createVNode('label', { class: 'flex items-center' }, [
                    createVNode(_sfc_main$5, {
                      checked: unref(form).remember,
                      'onUpdate:checked': ($event) => unref(form).remember = $event,
                      name: 'remember'
                    }, null, 8, ['checked', 'onUpdate:checked']),
                    createVNode('span', { class: 'ms-2 text-sm text-gray-600' }, 'Remember me')
                  ])
                ]),
                createVNode('div', { class: 'flex items-center justify-end mt-4' }, [
                  __props.canResetPassword ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: _ctx.route('password.request'),
                    class: 'underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }, {
                    default: withCtx(() => [
                      createTextVNode(' Forgot your password? ')
                    ]),
                    _: 1
                  }, 8, ['href'])) : createCommentVNode('', true),
                  createVNode(_sfc_main$6, {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Pages/Auth/Login.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
