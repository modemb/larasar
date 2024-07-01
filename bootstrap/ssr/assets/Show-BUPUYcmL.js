import { mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './AppLayout-vAVHwAbW.js';
import _sfc_main$4 from './DeleteTeamForm-CBFOj0mL.js';
import { S as SectionBorder } from './SectionBorder-DyqoGRve.js';
import _sfc_main$3 from './TeamMemberManager-CqGE9Fq4.js';
import _sfc_main$2 from './UpdateTeamNameForm-BHzGQQ-w.js';
import '@inertiajs/vue3';
import './_plugin-vue_export-helper-1tPrXgE0.js';
import './Modal-DjTyZJG3.js';
import './SectionTitle-DsKZJEmq.js';
import './ConfirmationModal-BuUXITCv.js';
import './DangerButton-s5hiF3bK.js';
import './SecondaryButton-CuwfkeiC.js';
import './ActionMessage-CMRC4Q_0.js';
import './DialogModal-xsy0v24U.js';
import './FormSection-Cf0LXcE6.js';
import './TextInput-B0hF2b1y.js';
import './InputLabel-Do1v5jZF.js';
import './PrimaryButton-DzU40Tsu.js';
const _sfc_main = {
  __name: 'Show',
  __ssrInlineRender: true,
  props: {
    team: Object,
    availableRoles: Array,
    permissions: Object
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: 'Team Settings' }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 class="font-semibold text-xl text-gray-800 leading-tight"${_scopeId}> Team Settings </h2>`);
          } else {
            return [
              createVNode('h2', { class: 'font-semibold text-xl text-gray-800 leading-tight' }, ' Team Settings ')
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              team: __props.team,
              permissions: __props.permissions
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              class: 'mt-10 sm:mt-0',
              team: __props.team,
              'available-roles': __props.availableRoles,
              'user-permissions': __props.permissions
            }, null, _parent2, _scopeId));
            if (__props.permissions.canDeleteTeam && !__props.team.personal_team) {
              _push2('<!--[-->');
              _push2(ssrRenderComponent(SectionBorder, null, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$4, {
                class: 'mt-10 sm:mt-0',
                team: __props.team
              }, null, _parent2, _scopeId));
              _push2('<!--]-->');
            } else {
              _push2('<!---->');
            }
            _push2('</div></div>');
          } else {
            return [
              createVNode('div', null, [
                createVNode('div', { class: 'max-w-7xl mx-auto py-10 sm:px-6 lg:px-8' }, [
                  createVNode(_sfc_main$2, {
                    team: __props.team,
                    permissions: __props.permissions
                  }, null, 8, ['team', 'permissions']),
                  createVNode(_sfc_main$3, {
                    class: 'mt-10 sm:mt-0',
                    team: __props.team,
                    'available-roles': __props.availableRoles,
                    'user-permissions': __props.permissions
                  }, null, 8, ['team', 'available-roles', 'user-permissions']),
                  __props.permissions.canDeleteTeam && !__props.team.personal_team ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createVNode(SectionBorder),
                    createVNode(_sfc_main$4, {
                      class: 'mt-10 sm:mt-0',
                      team: __props.team
                    }, null, 8, ['team'])
                  ], 64)) : createCommentVNode('', true)
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('resources/js/Pages/Teams/Show.vue');
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
