import { ref, withCtx, createTextVNode, unref, createVNode, withKeys, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { useForm } from '@inertiajs/vue3';
import { _ as _sfc_main$1 } from './Modal-DjTyZJG3.js';
import { _ as _sfc_main$2 } from './DangerButton-s5hiF3bK.js';
import { _ as _sfc_main$3 } from './DialogModal-xsy0v24U.js';
import { _ as _sfc_main$4, a as _sfc_main$5 } from './TextInput-B0hF2b1y.js';
import { _ as _sfc_main$6 } from './SecondaryButton-CuwfkeiC.js';
import './SectionTitle-DsKZJEmq.js';
import './_plugin-vue_export-helper-1tPrXgE0.js';
const _sfc_main = {
  __name: 'DeleteUserForm',
  __ssrInlineRender: true,
  setup(__props) {
    const confirmingUserDeletion = ref(false);
    const passwordInput = ref(null);
    const form = useForm({
      password: ''
    });
    const confirmUserDeletion = () => {
      confirmingUserDeletion.value = true;
      setTimeout(() => passwordInput.value.focus(), 250);
    };
    const deleteUser = () => {
      form.delete(route('current-user.destroy'), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value.focus(),
        onFinish: () => form.reset()
      });
    };
    const closeModal = () => {
      confirmingUserDeletion.value = false;
      form.reset();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(' Delete Account ');
          } else {
            return [
              createTextVNode(' Delete Account ')
            ];
          }
        }),
        description: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(' Permanently delete your account. ');
          } else {
            return [
              createTextVNode(' Permanently delete your account. ')
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-xl text-sm text-gray-600"${_scopeId}> Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain. </div><div class="mt-5"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, { onClick: confirmUserDeletion }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Delete Account ');
                } else {
                  return [
                    createTextVNode(' Delete Account ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2('</div>');
            _push2(ssrRenderComponent(_sfc_main$3, {
              show: confirmingUserDeletion.value,
              onClose: closeModal
            }, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Delete Account ');
                } else {
                  return [
                    createTextVNode(' Delete Account ')
                  ];
                }
              }),
              content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. <div class="mt-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$4, {
                    ref_key: 'passwordInput',
                    ref: passwordInput,
                    modelValue: unref(form).password,
                    'onUpdate:modelValue': ($event) => unref(form).password = $event,
                    type: 'password',
                    class: 'mt-1 block w-3/4',
                    placeholder: 'Password',
                    autocomplete: 'current-password',
                    onKeyup: deleteUser
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$5, {
                    message: unref(form).errors.password,
                    class: 'mt-2'
                  }, null, _parent3, _scopeId2));
                  _push3('</div>');
                } else {
                  return [
                    createTextVNode(' Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. '),
                    createVNode('div', { class: 'mt-4' }, [
                      createVNode(_sfc_main$4, {
                        ref_key: 'passwordInput',
                        ref: passwordInput,
                        modelValue: unref(form).password,
                        'onUpdate:modelValue': ($event) => unref(form).password = $event,
                        type: 'password',
                        class: 'mt-1 block w-3/4',
                        placeholder: 'Password',
                        autocomplete: 'current-password',
                        onKeyup: withKeys(deleteUser, ['enter'])
                      }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                      createVNode(_sfc_main$5, {
                        message: unref(form).errors.password,
                        class: 'mt-2'
                      }, null, 8, ['message'])
                    ])
                  ];
                }
              }),
              footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$6, { onClick: closeModal }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(' Cancel ');
                      } else {
                        return [
                          createTextVNode(' Cancel ')
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$2, {
                    class: ['ms-3', { 'opacity-25': unref(form).processing }],
                    disabled: unref(form).processing,
                    onClick: deleteUser
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(' Delete Account ');
                      } else {
                        return [
                          createTextVNode(' Delete Account ')
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$6, { onClick: closeModal }, {
                      default: withCtx(() => [
                        createTextVNode(' Cancel ')
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$2, {
                      class: ['ms-3', { 'opacity-25': unref(form).processing }],
                      disabled: unref(form).processing,
                      onClick: deleteUser
                    }, {
                      default: withCtx(() => [
                        createTextVNode(' Delete Account ')
                      ]),
                      _: 1
                    }, 8, ['class', 'disabled'])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode('div', { class: 'max-w-xl text-sm text-gray-600' }, ' Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain. '),
              createVNode('div', { class: 'mt-5' }, [
                createVNode(_sfc_main$2, { onClick: confirmUserDeletion }, {
                  default: withCtx(() => [
                    createTextVNode(' Delete Account ')
                  ]),
                  _: 1
                })
              ]),
              createVNode(_sfc_main$3, {
                show: confirmingUserDeletion.value,
                onClose: closeModal
              }, {
                title: withCtx(() => [
                  createTextVNode(' Delete Account ')
                ]),
                content: withCtx(() => [
                  createTextVNode(' Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. '),
                  createVNode('div', { class: 'mt-4' }, [
                    createVNode(_sfc_main$4, {
                      ref_key: 'passwordInput',
                      ref: passwordInput,
                      modelValue: unref(form).password,
                      'onUpdate:modelValue': ($event) => unref(form).password = $event,
                      type: 'password',
                      class: 'mt-1 block w-3/4',
                      placeholder: 'Password',
                      autocomplete: 'current-password',
                      onKeyup: withKeys(deleteUser, ['enter'])
                    }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                    createVNode(_sfc_main$5, {
                      message: unref(form).errors.password,
                      class: 'mt-2'
                    }, null, 8, ['message'])
                  ])
                ]),
                footer: withCtx(() => [
                  createVNode(_sfc_main$6, { onClick: closeModal }, {
                    default: withCtx(() => [
                      createTextVNode(' Cancel ')
                    ]),
                    _: 1
                  }),
                  createVNode(_sfc_main$2, {
                    class: ['ms-3', { 'opacity-25': unref(form).processing }],
                    disabled: unref(form).processing,
                    onClick: deleteUser
                  }, {
                    default: withCtx(() => [
                      createTextVNode(' Delete Account ')
                    ]),
                    _: 1
                  }, 8, ['class', 'disabled'])
                ]),
                _: 1
              }, 8, ['show'])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Pages/Profile/Partials/DeleteUserForm.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
