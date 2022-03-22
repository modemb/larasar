<template>

  <q-dialog v-model="addUser"><!--============ Add Users PopUp ============-->
      <q-card class="my-card text-white" style="width: 100%">
        <add-user :auth="auth" />
      </q-card>
  </q-dialog><!--============================= Add Users PopUp End ========-->

  <q-dialog v-model="editUser"><!--============ Add Update Users PopUp ====-->
    <q-card class="my-card text-black col-1" style="width: 800px">
        <profile :user="user"/><!-- TagProfile v-on:reload="Edit"  -->
    </q-card><!-- TagUser: ProfileModule -->
  </q-dialog><!--============================= Add Update Users PopUp End =-->

  <div class="q-pa-md">

    <q-table
      :style="'height:' + height + 'px'"
      class="my-sticky-virtscroll-table"
      ref="table"
      :title="$t('users_list')"
      :rows="rows"
      :columns="columns"
      row-key="id"
      virtual-scroll
      :virtual-scroll-item-size="48"
      :rows-per-page-options="[0]"

      :filter="filter"

      binary-state-sort
    ><!-- @request="onRequest" :loading="loading"-->

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">{{ props.row.id }}</q-td>
          <q-td key="user_name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="first_name" :props="props">
            {{ props.row.first_name }}
          </q-td>
          <q-td key="last_name" :props="props">
            {{ props.row.last_name }}
          </q-td>
          <q-td key="email" :props="props">
            <div class="text-pre-wrap">{{ props.row.email }}</div>
          </q-td>
          <q-td key="status" :props="props">
            {{ props.row.status }}
          </q-td>
          <q-td key="role" :props="props">{{ props.row.role }}</q-td>
          <template v-if="roles.admins">
            <q-td key="login" :props="props">
              <q-btn icon="fas fa-sign-in-alt" rounded class="*q-mb-md" @click.prevent="login(props.row)"/>
            </q-td>
            <template v-if="usersData=='users'||usersData=='my_users'">
              <q-td key="edit" :props="props"><!-- TagEdit: UserModule -->
                <q-btn icon="edit" rounded class="q-ma-md" @click.prevent="Edit(props.row)"/>
              </q-td>
              <q-td key="delete" :props="props">
                <q-btn icon="delete" rounded class="*q-mb-md" @click.prevent="Delete(props.row)"/>
              </q-td>
            </template>
            <template v-else>
              <q-td key="edit" :props="props"><!-- TagRestore: UserModule -->
                <q-btn icon="restore" rounded class="q-ma-md" @click="restore(props.row)"/>
              </q-td>
              <q-td key="delete" :props="props">
                <q-btn icon="delete_forever" rounded class="*q-mb-md" @click.prevent="delete_forever(props.row)"/>
              </q-td>
            </template>
          </template>
        </q-tr>
      </template>
      <template v-slot:top-right class="*row">
        <q-btn-toggle
          v-model="usersData"
          push v-if="roles.admins"
          glossy class="q-ma-xs col-md-3"
          toggle-color="primary"
          :options="[
            {label: $t('users'), value: 'users'},
            {label: $t('trashed'), value: 'trashed'},
            {label: $t('my_users'), value: 'my_users'}
          ]"
        /><!-- TagPeriod: PeriodModule -->
        <q-btn icon="add_circle_outline"
          rounded class="q-ma-xs col-md-3"
          :label="$t('add_user')" v-if="roles.admins"
          @click="addUser = true"
        /><!-- TagAdd: UserModule , role = name = first_name = last_name = email = password = password_confirmation = null-->

        <share :shareData="shareData" /><!-- TagShare: UserModule -->

        <q-input class="q-ma-xs col-md-3" borderless dense debounce="300" v-model="filter" :placeholder="$t('search')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

    </q-table>
    <!--============ Data Table End ====================-->
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, computed, watch } from 'vue'
import {  useStore } from 'vuex'
import { i18n, url, api, crudAction, notifyAction } from 'boot/axios'
// import { i18n } from 'boot/i18n'
import Profile from '../components/Profile'
import AddUser from '../components/Auth'
import Share from '../components/Share'

/**
 * Tags: TagAvatar - TagShare
 *
 * @from UserController
 */
export default {
  components: {
    Profile, // TagProfile
    AddUser, // add-user
    Share
  },
  setup () {
    const $t = i18n?.global?.t
    const $q = useQuasar()
    // const $route = useRoute()
    const editUser = ref(false)
    const $store = useStore()
    const user = ref(null)
    const usersData = ref('users')

    const ipDebug = computed(() => $store.getters['config/ipDebugGetter'])
    const auth = computed(() => $store.getters['users/authGetter'])
    const roles = $store.getters['users/rolesGetter']

    const copyLink = window.origin + '?hostUser=' + auth.value.name // TagShare: UserModule
    const shareData = ref({
      gain: auth.value.gain,
      title: $t('One minute to register, share and earn money'),
      text:  $t('One minute to register, share and earn money'),
      tooltip: $t('Share, put the link in your social description and earn money'),
      url: copyLink
    }) // TagShare: UserModule - Navigator Share

    onload({ usersData: roles.admins?'users':'my_users' })
    watch(usersData, val => onload({ usersData: val}))

    function onload (payload) {
      $store.dispatch('users/usersAction', payload)
    }
    function Delete (user) {
      const token = $store.getters['users/tokenGetter']
      if (token && confirm('Are You Sure You Want To '+(user.forever?'Delete Forever':'Delete')+' User '+ user.first_name) === true) {
        crudAction({
          url: `/api/users/${user.id}`,//?${qs(user)}
          method: 'delete',
          authID: auth.value.id
        }).then(onload({ usersData: usersData.value}))
          .catch(e => notifyAction({error: 'deleteAction', e}))
      }
    } // TagDelete: UserModule

    return {
      ipDebug,
      desktop: $q.platform.is.desktop,
      height: screen.height / 1.4,
      price: '0.00',
      shareLink: ref(false),
      addUser: ref(false),
      editUser,
      copyLink,
      shareData,
      usersData,
      roles,
      auth,
      user,
      url,

      pagination: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 0,
        rowsNumber: 10
      },

      login (user) {
        if (auth.value) {
          $store.dispatch('users/logoutAction', auth.value)
          $q.cookies.set('authID', auth.value.id , {expires: '1h'})

          // api.post('logout', auth.value)
          setTimeout(() => {
              api({
                url: 'api/users',
                method: 'post',
                data: { log: true, userId: user.id }
              }).then(() => {$store.dispatch('users/loginAction')})
                .catch(e => notifyAction({error: 'logUser', e}))
          }, 500)
        }
      },

      Edit (userEdit) {
        editUser.value = true; user.value = userEdit
      }, // TagEdit: UserModule

      Delete, // TagDelete: UserModule
      delete_forever (user) { // AddPasswordBeforeDeleteForever
        Delete({...user, ...{forever: 1}})
      },// TagDeleteForever: UserModule
      restore (user) {
        api.post('api/users', user).then(() => {
          onload({ usersData: 'trashed' })
        })
      }, // TagRestore: UserModule

      rows: computed(() => $store.getters['users/usersGetter']),
      columns: [ // Users
        { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
        { name: 'user_name', align: 'center', label: $t('user_name'), field: 'user_name', sortable: true },
        { name: 'first_name', align: 'center', label: $t('first_name'), field: 'first_name', sortable: true },
        { name: 'last_name', align: 'center', label: $t('last_name'), field: 'last_name', sortable: true },
        { name: 'email', align: 'center', label: $t('email'), field: 'email', sortable: true },
        { name: 'status', align: 'center', label: $t('status'), field: 'status', sortable: true },
        { name: 'role', align: 'center', label: $t('role'), field: 'role', sortable: true }
        ].concat(roles.admins?[ // Admin CRUD
        { name: 'login', align: 'center', label: $t('login'), field: 'login', sortable: false },
        { name: 'edit', align: 'center', label: $t('edit/restore'), field: 'edit', sortable: false },
        { name: 'delete', align: 'center', label: $t('delete/foreve'), field: 'delete', sortable: false }
      ]:[]), filter: ref('')
    }
  }
}
</script>
