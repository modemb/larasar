import { ref, withCtx, createTextVNode, unref, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { useForm } from '@inertiajs/vue3';
import { _ as _sfc_main$6 } from './ActionMessage-CMRC4Q_0.js';
import { _ as _sfc_main$8 } from './Modal-DjTyZJG3.js';
import { _ as _sfc_main$5 } from './Checkbox-BBcrr1ex.js';
import { _ as _sfc_main$b } from './ConfirmationModal-BuUXITCv.js';
import { _ as _sfc_main$c } from './DangerButton-s5hiF3bK.js';
import { _ as _sfc_main$9 } from './DialogModal-xsy0v24U.js';
import { _ as _sfc_main$1 } from './FormSection-Cf0LXcE6.js';
import { _ as _sfc_main$3, a as _sfc_main$4 } from './TextInput-B0hF2b1y.js';
import { _ as _sfc_main$2 } from './InputLabel-Do1v5jZF.js';
import { _ as _sfc_main$7 } from './PrimaryButton-DzU40Tsu.js';
import { _ as _sfc_main$a } from './SecondaryButton-CuwfkeiC.js';
import { S as SectionBorder } from './SectionBorder-DyqoGRve.js';
import './SectionTitle-DsKZJEmq.js';
import './_plugin-vue_export-helper-1tPrXgE0.js';
const _sfc_main = {
  __name: 'ApiTokenManager',
  __ssrInlineRender: true,
  props: {
    tokens: Array,
    availablePermissions: Array,
    defaultPermissions: Array
  },
  setup(__props) {
    const props = __props;
    const createApiTokenForm = useForm({
      name: '',
      permissions: props.defaultPermissions
    });
    const updateApiTokenForm = useForm({
      permissions: []
    });
    const deleteApiTokenForm = useForm({});
    const displayingToken = ref(false);
    const managingPermissionsFor = ref(null);
    const apiTokenBeingDeleted = ref(null);
    const createApiToken = () => {
      createApiTokenForm.post(route('api-tokens.store'), {
        preserveScroll: true,
        onSuccess: () => {
          displayingToken.value = true;
          createApiTokenForm.reset();
        }
      });
    };
    const manageApiTokenPermissions = (token) => {
      updateApiTokenForm.permissions = token.abilities;
      managingPermissionsFor.value = token;
    };
    const updateApiToken = () => {
      updateApiTokenForm.put(route('api-tokens.update', managingPermissionsFor.value), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => managingPermissionsFor.value = null
      });
    };
    const confirmApiTokenDeletion = (token) => {
      apiTokenBeingDeleted.value = token;
    };
    const deleteApiToken = () => {
      deleteApiTokenForm.delete(route('api-tokens.destroy', apiTokenBeingDeleted.value), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => apiTokenBeingDeleted.value = null
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_sfc_main$1, { onSubmitted: createApiToken }, {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(' Create API Token ');
          } else {
            return [
              createTextVNode(' Create API Token ')
            ];
          }
        }),
        description: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(' API tokens allow third-party services to authenticate with our application on your behalf. ');
          } else {
            return [
              createTextVNode(' API tokens allow third-party services to authenticate with our application on your behalf. ')
            ];
          }
        }),
        form: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="col-span-6 sm:col-span-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: 'name',
              value: 'Name'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: 'name',
              modelValue: unref(createApiTokenForm).name,
              'onUpdate:modelValue': ($event) => unref(createApiTokenForm).name = $event,
              type: 'text',
              class: 'mt-1 block w-full',
              autofocus: ''
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(createApiTokenForm).errors.name,
              class: 'mt-2'
            }, null, _parent2, _scopeId));
            _push2('</div>');
            if (__props.availablePermissions.length > 0) {
              _push2(`<div class="col-span-6"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                for: 'permissions',
                value: 'Permissions'
              }, null, _parent2, _scopeId));
              _push2(`<div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.availablePermissions, (permission) => {
                _push2(`<div${_scopeId}><label class="flex items-center"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$5, {
                  checked: unref(createApiTokenForm).permissions,
                  'onUpdate:checked': ($event) => unref(createApiTokenForm).permissions = $event,
                  value: permission
                }, null, _parent2, _scopeId));
                _push2(`<span class="ms-2 text-sm text-gray-600"${_scopeId}>${ssrInterpolate(permission)}</span></label></div>`);
              });
              _push2('<!--]--></div></div>');
            } else {
              _push2('<!---->');
            }
          } else {
            return [
              createVNode('div', { class: 'col-span-6 sm:col-span-4' }, [
                createVNode(_sfc_main$2, {
                  for: 'name',
                  value: 'Name'
                }),
                createVNode(_sfc_main$3, {
                  id: 'name',
                  modelValue: unref(createApiTokenForm).name,
                  'onUpdate:modelValue': ($event) => unref(createApiTokenForm).name = $event,
                  type: 'text',
                  class: 'mt-1 block w-full',
                  autofocus: ''
                }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                createVNode(_sfc_main$4, {
                  message: unref(createApiTokenForm).errors.name,
                  class: 'mt-2'
                }, null, 8, ['message'])
              ]),
              __props.availablePermissions.length > 0 ? (openBlock(), createBlock('div', {
                key: 0,
                class: 'col-span-6'
              }, [
                createVNode(_sfc_main$2, {
                  for: 'permissions',
                  value: 'Permissions'
                }),
                createVNode('div', { class: 'mt-2 grid grid-cols-1 md:grid-cols-2 gap-4' }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.availablePermissions, (permission) => {
                    return openBlock(), createBlock('div', { key: permission }, [
                      createVNode('label', { class: 'flex items-center' }, [
                        createVNode(_sfc_main$5, {
                          checked: unref(createApiTokenForm).permissions,
                          'onUpdate:checked': ($event) => unref(createApiTokenForm).permissions = $event,
                          value: permission
                        }, null, 8, ['checked', 'onUpdate:checked', 'value']),
                        createVNode('span', { class: 'ms-2 text-sm text-gray-600' }, toDisplayString(permission), 1)
                      ])
                    ]);
                  }), 128))
                ])
              ])) : createCommentVNode('', true)
            ];
          }
        }),
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$6, {
              on: unref(createApiTokenForm).recentlySuccessful,
              class: 'me-3'
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Created. ');
                } else {
                  return [
                    createTextVNode(' Created. ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$7, {
              class: { 'opacity-25': unref(createApiTokenForm).processing },
              disabled: unref(createApiTokenForm).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Create ');
                } else {
                  return [
                    createTextVNode(' Create ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$6, {
                on: unref(createApiTokenForm).recentlySuccessful,
                class: 'me-3'
              }, {
                default: withCtx(() => [
                  createTextVNode(' Created. ')
                ]),
                _: 1
              }, 8, ['on']),
              createVNode(_sfc_main$7, {
                class: { 'opacity-25': unref(createApiTokenForm).processing },
                disabled: unref(createApiTokenForm).processing
              }, {
                default: withCtx(() => [
                  createTextVNode(' Create ')
                ]),
                _: 1
              }, 8, ['class', 'disabled'])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.tokens.length > 0) {
        _push('<div>');
        _push(ssrRenderComponent(SectionBorder, null, null, _parent));
        _push('<div class="mt-10 sm:mt-0">');
        _push(ssrRenderComponent(_sfc_main$8, null, {
          title: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(' Manage API Tokens ');
            } else {
              return [
                createTextVNode(' Manage API Tokens ')
              ];
            }
          }),
          description: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(' You may delete any of your existing tokens if they are no longer needed. ');
            } else {
              return [
                createTextVNode(' You may delete any of your existing tokens if they are no longer needed. ')
              ];
            }
          }),
          content: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-6"${_scopeId}><!--[-->`);
              ssrRenderList(__props.tokens, (token) => {
                _push2(`<div class="flex items-center justify-between"${_scopeId}><div class="break-all"${_scopeId}>${ssrInterpolate(token.name)}</div><div class="flex items-center ms-2"${_scopeId}>`);
                if (token.last_used_ago) {
                  _push2(`<div class="text-sm text-gray-400"${_scopeId}> Last used ${ssrInterpolate(token.last_used_ago)}</div>`);
                } else {
                  _push2('<!---->');
                }
                if (__props.availablePermissions.length > 0) {
                  _push2(`<button class="cursor-pointer ms-6 text-sm text-gray-400 underline"${_scopeId}> Permissions </button>`);
                } else {
                  _push2('<!---->');
                }
                _push2(`<button class="cursor-pointer ms-6 text-sm text-red-500"${_scopeId}> Delete </button></div></div>`);
              });
              _push2('<!--]--></div>');
            } else {
              return [
                createVNode('div', { class: 'space-y-6' }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.tokens, (token) => {
                    return openBlock(), createBlock('div', {
                      key: token.id,
                      class: 'flex items-center justify-between'
                    }, [
                      createVNode('div', { class: 'break-all' }, toDisplayString(token.name), 1),
                      createVNode('div', { class: 'flex items-center ms-2' }, [
                        token.last_used_ago ? (openBlock(), createBlock('div', {
                          key: 0,
                          class: 'text-sm text-gray-400'
                        }, ' Last used ' + toDisplayString(token.last_used_ago), 1)) : createCommentVNode('', true),
                        __props.availablePermissions.length > 0 ? (openBlock(), createBlock('button', {
                          key: 1,
                          class: 'cursor-pointer ms-6 text-sm text-gray-400 underline',
                          onClick: ($event) => manageApiTokenPermissions(token)
                        }, ' Permissions ', 8, ['onClick'])) : createCommentVNode('', true),
                        createVNode('button', {
                          class: 'cursor-pointer ms-6 text-sm text-red-500',
                          onClick: ($event) => confirmApiTokenDeletion(token)
                        }, ' Delete ', 8, ['onClick'])
                      ])
                    ]);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push('</div></div>');
      } else {
        _push('<!---->');
      }
      _push(ssrRenderComponent(_sfc_main$9, {
        show: displayingToken.value,
        onClose: ($event) => displayingToken.value = false
      }, {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(' API Token ');
          } else {
            return [
              createTextVNode(' API Token ')
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}> Please copy your new API token. For your security, it won&#39;t be shown again. </div>`);
            if (_ctx.$page.props.jetstream.flash.token) {
              _push2(`<div class="mt-4 bg-gray-100 px-4 py-2 rounded font-mono text-sm text-gray-500 break-all"${_scopeId}>${ssrInterpolate(_ctx.$page.props.jetstream.flash.token)}</div>`);
            } else {
              _push2('<!---->');
            }
          } else {
            return [
              createVNode('div', null, " Please copy your new API token. For your security, it won't be shown again. "),
              _ctx.$page.props.jetstream.flash.token ? (openBlock(), createBlock('div', {
                key: 0,
                class: 'mt-4 bg-gray-100 px-4 py-2 rounded font-mono text-sm text-gray-500 break-all'
              }, toDisplayString(_ctx.$page.props.jetstream.flash.token), 1)) : createCommentVNode('', true)
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$a, {
              onClick: ($event) => displayingToken.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Close ');
                } else {
                  return [
                    createTextVNode(' Close ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$a, {
                onClick: ($event) => displayingToken.value = false
              }, {
                default: withCtx(() => [
                  createTextVNode(' Close ')
                ]),
                _: 1
              }, 8, ['onClick'])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$9, {
        show: managingPermissionsFor.value != null,
        onClose: ($event) => managingPermissionsFor.value = null
      }, {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(' API Token Permissions ');
          } else {
            return [
              createTextVNode(' API Token Permissions ')
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><!--[-->`);
            ssrRenderList(__props.availablePermissions, (permission) => {
              _push2(`<div${_scopeId}><label class="flex items-center"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$5, {
                checked: unref(updateApiTokenForm).permissions,
                'onUpdate:checked': ($event) => unref(updateApiTokenForm).permissions = $event,
                value: permission
              }, null, _parent2, _scopeId));
              _push2(`<span class="ms-2 text-sm text-gray-600"${_scopeId}>${ssrInterpolate(permission)}</span></label></div>`);
            });
            _push2('<!--]--></div>');
          } else {
            return [
              createVNode('div', { class: 'grid grid-cols-1 md:grid-cols-2 gap-4' }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.availablePermissions, (permission) => {
                  return openBlock(), createBlock('div', { key: permission }, [
                    createVNode('label', { class: 'flex items-center' }, [
                      createVNode(_sfc_main$5, {
                        checked: unref(updateApiTokenForm).permissions,
                        'onUpdate:checked': ($event) => unref(updateApiTokenForm).permissions = $event,
                        value: permission
                      }, null, 8, ['checked', 'onUpdate:checked', 'value']),
                      createVNode('span', { class: 'ms-2 text-sm text-gray-600' }, toDisplayString(permission), 1)
                    ])
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$a, {
              onClick: ($event) => managingPermissionsFor.value = null
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Cancel ');
                } else {
                  return [
                    createTextVNode(' Cancel ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$7, {
              class: ['ms-3', { 'opacity-25': unref(updateApiTokenForm).processing }],
              disabled: unref(updateApiTokenForm).processing,
              onClick: updateApiToken
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
              createVNode(_sfc_main$a, {
                onClick: ($event) => managingPermissionsFor.value = null
              }, {
                default: withCtx(() => [
                  createTextVNode(' Cancel ')
                ]),
                _: 1
              }, 8, ['onClick']),
              createVNode(_sfc_main$7, {
                class: ['ms-3', { 'opacity-25': unref(updateApiTokenForm).processing }],
                disabled: unref(updateApiTokenForm).processing,
                onClick: updateApiToken
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
      _push(ssrRenderComponent(_sfc_main$b, {
        show: apiTokenBeingDeleted.value != null,
        onClose: ($event) => apiTokenBeingDeleted.value = null
      }, {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(' Delete API Token ');
          } else {
            return [
              createTextVNode(' Delete API Token ')
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(' Are you sure you would like to delete this API token? ');
          } else {
            return [
              createTextVNode(' Are you sure you would like to delete this API token? ')
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$a, {
              onClick: ($event) => apiTokenBeingDeleted.value = null
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Cancel ');
                } else {
                  return [
                    createTextVNode(' Cancel ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$c, {
              class: ['ms-3', { 'opacity-25': unref(deleteApiTokenForm).processing }],
              disabled: unref(deleteApiTokenForm).processing,
              onClick: deleteApiToken
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(' Delete ');
                } else {
                  return [
                    createTextVNode(' Delete ')
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$a, {
                onClick: ($event) => apiTokenBeingDeleted.value = null
              }, {
                default: withCtx(() => [
                  createTextVNode(' Cancel ')
                ]),
                _: 1
              }, 8, ['onClick']),
              createVNode(_sfc_main$c, {
                class: ['ms-3', { 'opacity-25': unref(deleteApiTokenForm).processing }],
                disabled: unref(deleteApiTokenForm).processing,
                onClick: deleteApiToken
              }, {
                default: withCtx(() => [
                  createTextVNode(' Delete ')
                ]),
                _: 1
              }, 8, ['class', 'disabled'])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push('</div>');
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Pages/API/Partials/ApiTokenManager.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
