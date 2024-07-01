import { ref, mergeProps, withCtx, createTextVNode, unref, openBlock, createBlock, createVNode, withDirectives, vShow, withModifiers, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
import { useForm, Link, router } from '@inertiajs/vue3';
import { _ as _sfc_main$6 } from './ActionMessage-CMRC4Q_0.js';
import { _ as _sfc_main$1 } from './FormSection-Cf0LXcE6.js';
import { a as _sfc_main$4, _ as _sfc_main$5 } from './TextInput-B0hF2b1y.js';
import { _ as _sfc_main$2 } from './InputLabel-Do1v5jZF.js';
import { _ as _sfc_main$7 } from './PrimaryButton-DzU40Tsu.js';
import { _ as _sfc_main$3 } from './SecondaryButton-CuwfkeiC.js';
import './SectionTitle-DsKZJEmq.js';
import './_plugin-vue_export-helper-1tPrXgE0.js';
const _sfc_main = {
  __name: 'UpdateProfileInformationForm',
  __ssrInlineRender: true,
  props: {
    user: Object
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      _method: 'PUT',
      name: props.user.name,
      email: props.user.email,
      photo: null
    });
    const verificationLinkSent = ref(null);
    const photoPreview = ref(null);
    const photoInput = ref(null);
    const updateProfileInformation = () => {
      if (photoInput.value) {
        form.photo = photoInput.value.files[0];
      }
      form.post(route('user-profile-information.update'), {
        errorBag: 'updateProfileInformation',
        preserveScroll: true,
        onSuccess: () => clearPhotoFileInput()
      });
    };
    const sendEmailVerification = () => {
      verificationLinkSent.value = true;
    };
    const selectNewPhoto = () => {
      photoInput.value.click();
    };
    const updatePhotoPreview = () => {
      const photo = photoInput.value.files[0];
      if (!photo)
        return;
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview.value = e.target.result;
      };
      reader.readAsDataURL(photo);
    };
    const deletePhoto = () => {
      router.delete(route('current-user-photo.destroy'), {
        preserveScroll: true,
        onSuccess: () => {
          photoPreview.value = null;
          clearPhotoFileInput();
        }
      });
    };
    const clearPhotoFileInput = () => {
      var _a;
      if ((_a = photoInput.value) == null ? void 0 : _a.value) {
        photoInput.value.value = null;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ onSubmitted: updateProfileInformation }, _attrs), {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(' Profile Information ');
          } else {
            return [
              createTextVNode(' Profile Information ')
            ];
          }
        }),
        description: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(' Update your account&#39;s profile information and email address. ');
          } else {
            return [
              createTextVNode(" Update your account's profile information and email address. ")
            ];
          }
        }),
        form: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (_ctx.$page.props.jetstream.managesProfilePhotos) {
              _push2(`<div class="col-span-6 sm:col-span-4"${_scopeId}><input id="photo" type="file" class="hidden"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                for: 'photo',
                value: 'Photo'
              }, null, _parent2, _scopeId));
              _push2(`<div style="${ssrRenderStyle(!photoPreview.value ? null : { display: 'none' })}" class="mt-2"${_scopeId}><img${ssrRenderAttr('src', __props.user.profile_photo_url)}${ssrRenderAttr('alt', __props.user.name)} class="rounded-full h-20 w-20 object-cover"${_scopeId}></div><div style="${ssrRenderStyle(photoPreview.value ? null : { display: 'none' })}" class="mt-2"${_scopeId}><span class="block rounded-full w-20 h-20 bg-cover bg-no-repeat bg-center" style="${ssrRenderStyle("background-image: url('" + photoPreview.value + "');")}"${_scopeId}></span></div>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                class: 'mt-2 me-2',
                type: 'button',
                onClick: selectNewPhoto
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(' Select A New Photo ');
                  } else {
                    return [
                      createTextVNode(' Select A New Photo ')
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (__props.user.profile_photo_path) {
                _push2(ssrRenderComponent(_sfc_main$3, {
                  type: 'button',
                  class: 'mt-2',
                  onClick: deletePhoto
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(' Remove Photo ');
                    } else {
                      return [
                        createTextVNode(' Remove Photo ')
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2('<!---->');
              }
              _push2(ssrRenderComponent(_sfc_main$4, {
                message: unref(form).errors.photo,
                class: 'mt-2'
              }, null, _parent2, _scopeId));
              _push2('</div>');
            } else {
              _push2('<!---->');
            }
            _push2(`<div class="col-span-6 sm:col-span-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: 'name',
              value: 'Name'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              id: 'name',
              modelValue: unref(form).name,
              'onUpdate:modelValue': ($event) => unref(form).name = $event,
              type: 'text',
              class: 'mt-1 block w-full',
              required: '',
              autocomplete: 'name'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.name,
              class: 'mt-2'
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-span-6 sm:col-span-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: 'email',
              value: 'Email'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              id: 'email',
              modelValue: unref(form).email,
              'onUpdate:modelValue': ($event) => unref(form).email = $event,
              type: 'email',
              class: 'mt-1 block w-full',
              required: '',
              autocomplete: 'username'
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.email,
              class: 'mt-2'
            }, null, _parent2, _scopeId));
            if (_ctx.$page.props.jetstream.hasEmailVerification && __props.user.email_verified_at === null) {
              _push2(`<div${_scopeId}><p class="text-sm mt-2"${_scopeId}> Your email address is unverified. `);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route('verification.send'),
                method: 'post',
                as: 'button',
                class: 'underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                onClick: sendEmailVerification
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(' Click here to re-send the verification email. ');
                  } else {
                    return [
                      createTextVNode(' Click here to re-send the verification email. ')
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</p><div style="${ssrRenderStyle(verificationLinkSent.value ? null : { display: 'none' })}" class="mt-2 font-medium text-sm text-green-600"${_scopeId}> A new verification link has been sent to your email address. </div></div>`);
            } else {
              _push2('<!---->');
            }
            _push2('</div>');
          } else {
            return [
              _ctx.$page.props.jetstream.managesProfilePhotos ? (openBlock(), createBlock('div', {
                key: 0,
                class: 'col-span-6 sm:col-span-4'
              }, [
                createVNode('input', {
                  id: 'photo',
                  ref_key: 'photoInput',
                  ref: photoInput,
                  type: 'file',
                  class: 'hidden',
                  onChange: updatePhotoPreview
                }, null, 544),
                createVNode(_sfc_main$2, {
                  for: 'photo',
                  value: 'Photo'
                }),
                withDirectives(createVNode('div', { class: 'mt-2' }, [
                  createVNode('img', {
                    src: __props.user.profile_photo_url,
                    alt: __props.user.name,
                    class: 'rounded-full h-20 w-20 object-cover'
                  }, null, 8, ['src', 'alt'])
                ], 512), [
                  [vShow, !photoPreview.value]
                ]),
                withDirectives(createVNode('div', { class: 'mt-2' }, [
                  createVNode('span', {
                    class: 'block rounded-full w-20 h-20 bg-cover bg-no-repeat bg-center',
                    style: "background-image: url('" + photoPreview.value + "');"
                  }, null, 4)
                ], 512), [
                  [vShow, photoPreview.value]
                ]),
                createVNode(_sfc_main$3, {
                  class: 'mt-2 me-2',
                  type: 'button',
                  onClick: withModifiers(selectNewPhoto, ['prevent'])
                }, {
                  default: withCtx(() => [
                    createTextVNode(' Select A New Photo ')
                  ]),
                  _: 1
                }),
                __props.user.profile_photo_path ? (openBlock(), createBlock(_sfc_main$3, {
                  key: 0,
                  type: 'button',
                  class: 'mt-2',
                  onClick: withModifiers(deletePhoto, ['prevent'])
                }, {
                  default: withCtx(() => [
                    createTextVNode(' Remove Photo ')
                  ]),
                  _: 1
                })) : createCommentVNode('', true),
                createVNode(_sfc_main$4, {
                  message: unref(form).errors.photo,
                  class: 'mt-2'
                }, null, 8, ['message'])
              ])) : createCommentVNode('', true),
              createVNode('div', { class: 'col-span-6 sm:col-span-4' }, [
                createVNode(_sfc_main$2, {
                  for: 'name',
                  value: 'Name'
                }),
                createVNode(_sfc_main$5, {
                  id: 'name',
                  modelValue: unref(form).name,
                  'onUpdate:modelValue': ($event) => unref(form).name = $event,
                  type: 'text',
                  class: 'mt-1 block w-full',
                  required: '',
                  autocomplete: 'name'
                }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                createVNode(_sfc_main$4, {
                  message: unref(form).errors.name,
                  class: 'mt-2'
                }, null, 8, ['message'])
              ]),
              createVNode('div', { class: 'col-span-6 sm:col-span-4' }, [
                createVNode(_sfc_main$2, {
                  for: 'email',
                  value: 'Email'
                }),
                createVNode(_sfc_main$5, {
                  id: 'email',
                  modelValue: unref(form).email,
                  'onUpdate:modelValue': ($event) => unref(form).email = $event,
                  type: 'email',
                  class: 'mt-1 block w-full',
                  required: '',
                  autocomplete: 'username'
                }, null, 8, ['modelValue', 'onUpdate:modelValue']),
                createVNode(_sfc_main$4, {
                  message: unref(form).errors.email,
                  class: 'mt-2'
                }, null, 8, ['message']),
                _ctx.$page.props.jetstream.hasEmailVerification && __props.user.email_verified_at === null ? (openBlock(), createBlock('div', { key: 0 }, [
                  createVNode('p', { class: 'text-sm mt-2' }, [
                    createTextVNode(' Your email address is unverified. '),
                    createVNode(unref(Link), {
                      href: _ctx.route('verification.send'),
                      method: 'post',
                      as: 'button',
                      class: 'underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                      onClick: withModifiers(sendEmailVerification, ['prevent'])
                    }, {
                      default: withCtx(() => [
                        createTextVNode(' Click here to re-send the verification email. ')
                      ]),
                      _: 1
                    }, 8, ['href'])
                  ]),
                  withDirectives(createVNode('div', { class: 'mt-2 font-medium text-sm text-green-600' }, ' A new verification link has been sent to your email address. ', 512), [
                    [vShow, verificationLinkSent.value]
                  ])
                ])) : createCommentVNode('', true)
              ])
            ];
          }
        }),
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$6, {
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
            _push2(ssrRenderComponent(_sfc_main$7, {
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
              createVNode(_sfc_main$6, {
                on: unref(form).recentlySuccessful,
                class: 'me-3'
              }, {
                default: withCtx(() => [
                  createTextVNode(' Saved. ')
                ]),
                _: 1
              }, 8, ['on']),
              createVNode(_sfc_main$7, {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
