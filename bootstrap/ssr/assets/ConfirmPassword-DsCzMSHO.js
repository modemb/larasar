import { ref, unref, withCtx, createVNode, createTextVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { useForm, Head } from '@inertiajs/vue3';
import { A as AuthenticationCard } from './AuthenticationCard-C9mEk27i.js';
import { _ as _sfc_main$1 } from './AuthenticationCardLogo-BE7wXEGb.js';
import { _ as _sfc_main$3, a as _sfc_main$4 } from './TextInput-B0hF2b1y.js';
import { _ as _sfc_main$2 } from './InputLabel-Do1v5jZF.js';
import { _ as _sfc_main$5 } from './PrimaryButton-DzU40Tsu.js';
import './_plugin-vue_export-helper-1tPrXgE0.js';
const _sfc_main = {
  __name: 'ConfirmPassword',
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      password: ''
    });
    const passwordInput = ref(null);
    const submit = () => {
      form.post(route('password.confirm'), {
        onFinish: () => {
          form.reset();
          passwordInput.value.focus();
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push('<!--[-->');
      _push(ssrRenderComponent(unref(Head), { title: 'Secure Area' }, null, _parent));
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
            _push2(`<div class="mb-4 text-sm text-gray-600"${_scopeId}> This is a secure area of the application. Please confirm your password before continuing. </div><form${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: 'password',
              value: 'Password'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: 'password',
              ref_key: 'passwordInput',
              ref: passwordInput,
              modelValue: unref(form).password,
              'onUpdate:modelValue': ($event) => unref(form).password = $event,
              type: 'password',
              class: 'mt-1 block w-full',
              required: '',
              autocomplete: 'current-password',
              autofocus: ''
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: 'mt-2',
              message: unref(form).errors.password
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex justify-end mt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$5, {
              class: ['ms-4', { 'opacity-25': unref(form).processing }],
              disabled: unref(form).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Confirm ');
                } else {
                  return [
                    createTextVNode(' Confirm ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2('</div></form>');
          } else {
            return [
              createVNode('div', { class: 'mb-4 text-sm text-gray-600' }, ' This is a secure area of the application. Please confirm your password before continuing. '),
              createVNode('form', {
                onSubmit: withModifiers(submit, ['prevent'])
              }, [
                createVNode('div', null, [
                  createVNode(_sfc_main$2, {
                    for: 'password',
                    value: 'Password'
                  }),
                  createVNode(_sfc_main$3, {
                    id: 'password',
                    ref_key: 'passwordInput',
                    ref: passwordInput,
                    modelValue: unref(form).password,
                    'onUpdate:modelValue': ($event) => unref(form).password = $event,
                    type: 'password',
                    class: 'mt-1 block w-full',
                    required: '',
                    autocomplete: 'current-password',
                    autofocus: ''
                  }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                  createVNode(_sfc_main$4, {
                    class: 'mt-2',
                    message: unref(form).errors.password
                  }, null, 8, ['message'])
                ]),
                createVNode('div', { class: 'flex justify-end mt-4' }, [
                  createVNode(_sfc_main$5, {
                    class: ['ms-4', { 'opacity-25': unref(form).processing }],
                    disabled: unref(form).processing
                  }, {
                    default: withCtx(() => [
                      createTextVNode(' Confirm ')
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Pages/Auth/ConfirmPassword.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
