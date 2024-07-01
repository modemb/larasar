import { unref, withCtx, createVNode, createTextVNode, withModifiers, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { useForm, Head, Link } from '@inertiajs/vue3';
import { A as AuthenticationCard } from './AuthenticationCard-C9mEk27i.js';
import { _ as _sfc_main$1 } from './AuthenticationCardLogo-BE7wXEGb.js';
import { _ as _sfc_main$5 } from './Checkbox-BBcrr1ex.js';
import { _ as _sfc_main$3, a as _sfc_main$4 } from './TextInput-B0hF2b1y.js';
import { _ as _sfc_main$2 } from './InputLabel-Do1v5jZF.js';
import { _ as _sfc_main$6 } from './PrimaryButton-DzU40Tsu.js';
import './_plugin-vue_export-helper-1tPrXgE0.js';
const _sfc_main = {
  __name: 'Register',
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      terms: false
    });
    const submit = () => {
      form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation')
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push('<!--[-->');
      _push(ssrRenderComponent(unref(Head), { title: 'Register' }, null, _parent));
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
              for: 'name',
              value: 'Name'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: 'name',
              modelValue: unref(form).name,
              'onUpdate:modelValue': ($event) => unref(form).name = $event,
              type: 'text',
              class: 'mt-1 block w-full',
              required: '',
              autofocus: '',
              autocomplete: 'name'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: 'mt-2',
              message: unref(form).errors.name
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-4"${_scopeId}>`);
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
            _push2('</div>');
            if (_ctx.$page.props.jetstream.hasTermsAndPrivacyPolicyFeature) {
              _push2(`<div class="mt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, { for: 'terms' }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$5, {
                      id: 'terms',
                      checked: unref(form).terms,
                      'onUpdate:checked': ($event) => unref(form).terms = $event,
                      name: 'terms',
                      required: ''
                    }, null, _parent3, _scopeId2));
                    _push3(`<div class="ms-2"${_scopeId2}> I agree to the <a target="_blank"${ssrRenderAttr('href', _ctx.route('terms.show'))} class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"${_scopeId2}>Terms of Service</a> and <a target="_blank"${ssrRenderAttr('href', _ctx.route('policy.show'))} class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"${_scopeId2}>Privacy Policy</a></div></div>`);
                    _push3(ssrRenderComponent(_sfc_main$4, {
                      class: 'mt-2',
                      message: unref(form).errors.terms
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode('div', { class: 'flex items-center' }, [
                        createVNode(_sfc_main$5, {
                          id: 'terms',
                          checked: unref(form).terms,
                          'onUpdate:checked': ($event) => unref(form).terms = $event,
                          name: 'terms',
                          required: ''
                        }, null, 8, ['checked', 'onUpdate:checked']),
                        createVNode('div', { class: 'ms-2' }, [
                          createTextVNode(' I agree to the '),
                          createVNode('a', {
                            target: '_blank',
                            href: _ctx.route('terms.show'),
                            class: 'underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          }, 'Terms of Service', 8, ['href']),
                          createTextVNode(' and '),
                          createVNode('a', {
                            target: '_blank',
                            href: _ctx.route('policy.show'),
                            class: 'underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          }, 'Privacy Policy', 8, ['href'])
                        ])
                      ]),
                      createVNode(_sfc_main$4, {
                        class: 'mt-2',
                        message: unref(form).errors.terms
                      }, null, 8, ['message'])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2('</div>');
            } else {
              _push2('<!---->');
            }
            _push2(`<div class="flex items-center justify-end mt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route('login'),
              class: 'underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Already registered? ');
                } else {
                  return [
                    createTextVNode(' Already registered? ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$6, {
              class: ['ms-4', { 'opacity-25': unref(form).processing }],
              disabled: unref(form).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Register ');
                } else {
                  return [
                    createTextVNode(' Register ')
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
                    for: 'name',
                    value: 'Name'
                  }),
                  createVNode(_sfc_main$3, {
                    id: 'name',
                    modelValue: unref(form).name,
                    'onUpdate:modelValue': ($event) => unref(form).name = $event,
                    type: 'text',
                    class: 'mt-1 block w-full',
                    required: '',
                    autofocus: '',
                    autocomplete: 'name'
                  }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                  createVNode(_sfc_main$4, {
                    class: 'mt-2',
                    message: unref(form).errors.name
                  }, null, 8, ['message'])
                ]),
                createVNode('div', { class: 'mt-4' }, [
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
                _ctx.$page.props.jetstream.hasTermsAndPrivacyPolicyFeature ? (openBlock(), createBlock('div', {
                  key: 0,
                  class: 'mt-4'
                }, [
                  createVNode(_sfc_main$2, { for: 'terms' }, {
                    default: withCtx(() => [
                      createVNode('div', { class: 'flex items-center' }, [
                        createVNode(_sfc_main$5, {
                          id: 'terms',
                          checked: unref(form).terms,
                          'onUpdate:checked': ($event) => unref(form).terms = $event,
                          name: 'terms',
                          required: ''
                        }, null, 8, ['checked', 'onUpdate:checked']),
                        createVNode('div', { class: 'ms-2' }, [
                          createTextVNode(' I agree to the '),
                          createVNode('a', {
                            target: '_blank',
                            href: _ctx.route('terms.show'),
                            class: 'underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          }, 'Terms of Service', 8, ['href']),
                          createTextVNode(' and '),
                          createVNode('a', {
                            target: '_blank',
                            href: _ctx.route('policy.show'),
                            class: 'underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          }, 'Privacy Policy', 8, ['href'])
                        ])
                      ]),
                      createVNode(_sfc_main$4, {
                        class: 'mt-2',
                        message: unref(form).errors.terms
                      }, null, 8, ['message'])
                    ]),
                    _: 1
                  })
                ])) : createCommentVNode('', true),
                createVNode('div', { class: 'flex items-center justify-end mt-4' }, [
                  createVNode(unref(Link), {
                    href: _ctx.route('login'),
                    class: 'underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }, {
                    default: withCtx(() => [
                      createTextVNode(' Already registered? ')
                    ]),
                    _: 1
                  }, 8, ['href']),
                  createVNode(_sfc_main$6, {
                    class: ['ms-4', { 'opacity-25': unref(form).processing }],
                    disabled: unref(form).processing
                  }, {
                    default: withCtx(() => [
                      createTextVNode(' Register ')
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Pages/Auth/Register.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
