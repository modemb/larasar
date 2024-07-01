<template>

  <q-dialog v-model="addUser"><!--= Add Users PopUp ============-->
      <q-card class="my-card text-white" style="width: 100%">
        <addUser :auth="auth" />
      </q-card>
  </q-dialog><!--================== Add Users PopUp End ========-->

  <q-dialog v-model="editUser"><!-- Add Update Users PopUp ======-->
    <q-card class="my-card text-black col-1" style="width: 1000px">
        <Profile :user="user" @update="usersAction" /><!-- TagProfile -->
    </q-card><!-- TagUser: ProfileModule -->
  </q-dialog><!--================== Add Update Users PopUp End ==-->

  <div class="q-pa-md">

    <q-table
      :style="`height: ${height}px`"
      class="my-sticky-virtscroll-table"
      ref="table"
      :title="`${$t('users_list')} ${total}`"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      :loading="loading"
      binary-state-sort

      virtual-scroll
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      v-model:pagination="pagination"
      @virtual-scroll="onScroll"
    ><!--
      @request="onRequest"
    -->

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">{{ props.row.id }}</q-td>
          <q-td key="name" :props="props">
            {{ props.row?.name }}
          </q-td>
          <q-td key="first_name" :props="props">
            {{ props.row.first_name }}
          </q-td>
          <q-td key="last_name" :props="props">
            {{ props.row.last_name }}
          </q-td>
          <q-td key="email" :props="props">
            <!-- <div class="text-pre-wrap">{{ props.row.email }}</div> -->
            <q-btn flat :icon-right="(props.row?.email_verified_at)?'check':''" :label="props.row.email" />
          </q-td>
          <q-td key="status" :props="props">
            {{ props.row.status }}
          </q-td>
          <q-td key="role" :props="props">{{ props.row.role }}</q-td>
          <template v-if="auth?.role==='Admin'">
            <q-td key="login" :props="props">
              <q-btn icon="fas fa-sign-in-alt" rounded @click.prevent="logUserAction(props.row.id)"/>
            </q-td><!-- TagLogUser: UserModule -->
              <q-td key="edit" :props="props"><!-- TagEdit: UserModule -->
                <q-btn icon="edit" rounded class="q-ma-md" @click.prevent="Edit(props.row)"/>
              </q-td>
            <template v-if="usersData=='users'">
              <q-td key="delete" :props="props">
                <q-btn icon="delete" rounded @click.prevent="Delete(props.row)"/>
              </q-td>
            </template>
            <template v-else-if="usersData=='my_users'">
              <q-td key="edit" :props="props">
                <q-btn icon="remove" rounded @click.prevent="remove(props.row)"/>
              </q-td>
            </template>
            <template v-else>
              <q-td key="delete" :props="props"><!-- TagRestore: UserModule -->
                <q-btn icon="restore" rounded class="q-ma-md" @click="restore(props.row)"/>
              </q-td>
              <q-td key="delete" :props="props">
                <q-btn icon="delete_forever" rounded @click.prevent="delete_forever(props.row)"/>
              </q-td>
            </template>
          </template>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-btn-toggle
          v-model="usersData"
          push v-if="auth?.role==='Admin'"
          glossy class="q-ma-xs col-md-3"
          toggle-color="primary"
          :options="[
            {label: $t('users'), value: 'users'},
            {label: $t('Trash'), value: 'userTrashed'},
            {label: $t('Deleted'), value: 'userDeleted'},
            {label: $t('my_users'), value: 'my_users'}
          ]"
        /><!-- TagPeriod: PeriodModule -->
        <q-btn icon="add_circle_outline"
          rounded class="q-ma-xs col-md-3"
          :label="$t('add_user')" v-if="auth?.role==='Admin'"
          @click="addUser = true"
        /><!-- TagAdd: UserModule , role = name = first_name = last_name = email = password = password_confirmation = null-->

        <Share :shareData="shareData" /><!-- TagShare: UserModule -->

        <q-input clearable class="q-ma-xs col-md-3" borderless dense debounce="300" v-model="filter" :placeholder="$t('search')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

    </q-table>
    <!--============ Data Table End ====================-->
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { i18n, api, logUserAction } from 'boot/axios'
import { useCrudStore } from 'stores/crud'
import { Param } from 'components/models'
import Profile from 'components/Profile.vue'
import Share from 'components/UserShare.vue'
import AddUser from 'components/Auth.vue'

/**
 * Tags: TagAvatar - TagShare - TagLogUser
 *
 * @to UserController
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
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const editUser = ref(false)
    const user = ref(null)
    const usersData = ref('users')
    const loading = ref(false)
    const filter = ref('')

    const last_page = computed(() => store[usersData.value]?.last_page)
    const total = computed(() => store[usersData.value]?.total)
    const ipDebug = computed(() => store.configGetter?.ipDebug)
    const reload = computed(() => store.reloadGetter?.reload)
    const rows = computed(() => store[usersData.value]?.data||[])
    const auth = computed(() => store.authGetter)

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1, // Page Link fixHere
      rowsPerPage: 0, // Pagination Number
      rowsNumber: total.value // Rows Number Per Page
    })

    const flt: string[] = []; watch(filter, val => {
      pagination.value.page = 1
      flt.includes(val) || usersAction({
        filterUsers: val, load: true
      });flt.push(val)
    }) // TagFiler: SearchModule
    watch([usersData, reload], () => {
      pagination.value.page = 1
      usersAction({})
    })

    onMounted(() => usersAction({ usersData: usersData.value = (auth.value?.role==='Admin')?'users':'my_users' }))

    function usersAction(params: Partial<Param>) {
      crudAction({ ...params,
        url: `api/users/${auth.value.id}`,
        method: 'get', timeout: 1000,
        page: pagination.value.page,
        perPage: pagination.value.rowsPerPage,
        mutate: usersData.value
      }).catch((e: unknown) => notifyAction({error: 'usersAction', e}))
    }

    function Delete(user: { forever: boolean; remove: boolean; first_name: string; id: number }) {
      if (auth.value && confirm('Are You Sure You Want To '+(user.forever?'Delete Forever':(user.remove?'Remove':'Delete'))+' User '+ user.first_name))
        api({ url: `/api/users/${user.id}`, data: {
            authID: auth.value.id,
            remove: user.remove,
          }, method: 'delete'
        }).then(() => usersAction({ refresh: ['reloadApp'] }))
          .catch((e: unknown) => notifyAction({error: 'deleteAction', e}))
    } // TagDelete: UserModule

    return {
      ipDebug, total,
      desktop: $q.platform.is.desktop,
      height: screen.height / 1.4,
      price: '0.00',
      shareLink: ref(false),
      addUser: ref(false),
      editUser,
      shareData: computed(() => store.shareDataGetter?.shareData), // TagShare: UserModule - Navigator Share
      usersData,
      loading,
      // roles,
      auth,
      user,

      onScroll ({ to, ref }: any) {
        const lastIndex = rows.value?.length-1
        const page = pagination.value.page
        const lastPage = last_page.value

        // pagination.value.rowsNumber = total.value

        if (loading.value !== true && page < lastPage && to === lastIndex) {

          loading.value = true; setTimeout(() => {
            pagination.value.page++
            usersAction({ load: true })
            nextTick(() => {
              ref.refresh()
              loading.value = false
            })
          }, 500)
        }
          console.log(
            'page', page, '<', 'lastPage', lastPage,
            'to', to,'===', lastIndex, 'lastIndex', '>', 0,
            'total', total.value,
            // 'TO', TO.value,
            // 'ref', ref,
            // 'rows', rows.value
          )
      }, usersAction,

      logUserAction, // TagLogUser: UserModule
      Edit(userEdit: null) {
        pagination.value.page = 1
        editUser.value = true; user.value = userEdit
      }, // TagEdit: UserModule
      Delete, // TagDelete: UserModule
      delete_forever(user: { forever: boolean; remove: boolean; first_name: string; id: number }) { // AddPasswordBeforeDeleteForever
        Delete({...user, forever: true})
      }, // TagDeleteForever: UserModule
      remove(user: { forever: boolean; remove: boolean; first_name: string; id: number }) {
        Delete({...user, remove: true})
      }, // TagRemove: UserModule
      restore(user: object) {
        api.post('api/users', user).then(() => usersAction({ refresh: ['reloadApp'] }))
           .catch(e => notifyAction({error: 'restoreUser', e}))
      }, // TagRestore: UserModule

      columns: <any> computed(() => [ // Users
        { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
        { name: 'name', align: 'center', label: $t('user_name'), field: 'name', sortable: true },
        { name: 'first_name', align: 'center', label: $t('first_name'), field: 'first_name', sortable: true },
        { name: 'last_name', align: 'center', label: $t('last_name'), field: 'last_name', sortable: true },
        { name: 'email', align: 'center', label: $t('email'), field: 'email', sortable: true },
        { name: 'status', align: 'center', label: $t('status'), field: 'status', sortable: true },
        { name: 'role', align: 'center', label: $t('role'), field: 'role', sortable: true }
        ].concat((auth.value?.role==='Admin')?[ // Admin CRUD
        { name: 'login', align: 'center', label: $t('login'), field: 'login', sortable: false },
        { name: 'edit', align: 'center', label: $t('edit/restore'), field: 'edit', sortable: false },
        { name: 'delete', align: 'center', label: $t('delete/forever'), field: 'delete', sortable: false }
      ]:[])), rows, pagination, filter
    }
  }
}
</script>
