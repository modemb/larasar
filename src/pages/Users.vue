<template>
  <div class="q-pa-md">
    <q-btn
      icon="add_circle_outline"
      rounded class="q-mb-md"
      :label="$t('add_user')"
      @click="addUser = true, editUser = false, role = name = email = avatar = null"
    /><!-- TagAdd: UserModule -->
    <!--============ Add Update Users PopUp ============-->
    <q-dialog v-model="addUser">
        <q-card class="my-card text-white" style='width:800px'>
          <q-card-section class="bg-primary">
            <div class="text-h6">{{editUser?$t('update_user'):$t('add_user')}}</div>
          </q-card-section>

          <div class="q-pa-md">

            <q-img v-if="editUser"
              :src="avatar"
              style="width: 100%"
              class="q-mb-xl"
              native-context-menu
            /><!-- TagAvatar: UserModule -->

            <q-card class="row q-ma-xl" v-if="editUser">
                <div class="col-md-6">
                    <input type="file" v-on:change="onImageChange" class="q-ma-lg">
                </div>
                <div class="col-md-6">
                  <q-btn color="primary" class="q-ma-md" :label="$t('remove_image')" @click="deleteImage"/>
                </div>
            </q-card>

            <q-select
              filled
              v-model="role"
              class="q-pb-md"
              :hint="role_data"
              :options="(authGetter.id == 1 || authGetter.role == 'Admin')?admin:seller"
              :label="role || $t('role')"
              :rules="[val => val && val.length > 0 || role_data]"
            />

            <q-input
              filled
              v-model="name"
              lazy-rules
              :label="name || $t('name')"
              :hint="name_data"
              :rules="[val => val && val.length > 0 || name_data]"
            />

            <q-input
              filled
              v-model="email"
              type="email"
              lazy-rules
              :label="email || $t('email')"
              :hint="email_data"
              :rules="[val => val && val.length > 0 || email_data]"
            />

            <q-input
              filled
              v-model="password"
              lazy-rules
              class="q-pt-md"
              :label="$t('password')"
              :type="isPwd ? 'password' : 'text'"
              :hint="password_data"
              :rules="[val => val && val.length > 0 || password_data]"
            />

            <q-input
              v-model="password_confirmation"
              filled
              :type="isPwd ? 'password' : 'text'"
              :label="$t('confirm_password')"
              >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div class="q-pt-md">
              <q-btn color="primary" v-if="editUser" :label="$t('update_user')" @click.prevent="update(user)" />
              <q-btn color="primary" v-else if="addUser" :label="$t('add_user')" @click.prevent="add" />
              <q-btn no-caps label="Close" color="primary" class="q-ma-md" v-close-popup />
            </div>

          </div>

        </q-card>
    </q-dialog>
    <!--============ Add Update Users PopUp End ========-->

    <!--============ Data Table ========================-->
    <q-table
      :title="$t('users_list')"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">{{ props.row.id }}</q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" title="Update calories" buttons >
              <q-input v-model="props.row.name" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="email" :props="props">
            <div class="text-pre-wrap">{{ props.row.email }}</div>
            <q-popup-edit v-model="props.row.email">
              <q-input type="textarea" v-model="props.row.email" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="status" :props="props">
            {{ props.row.status }}
            <q-popup-edit v-model="props.row.status" title="Update carbs" buttons persistent>
              <q-input type="number" v-model="props.row.status" dense autofocus hint="Use buttons to close" />
            </q-popup-edit>
          </q-td>
          <q-td key="role" :props="props">{{ props.row.role }}</q-td>
          <q-td key="edit" :props="props"><!-- TagEdit: UserModule -->
            <q-btn icon="edit" rounded class="q-ma-md" @click="edit(props.row)" />
          </q-td>
          <q-td key="delete" :props="props">
            <q-btn icon="delete_forever" rounded class="*q-mb-md" @click.prevent="Delete(props.row)"/>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
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
import { mapGetters } from 'vuex'
import { url } from 'boot/axios'

export default {
  data () {
    return {
      addUser: false,
      editUser: false,
      html: null,
      role: null,
      role_data: null,
      name: null,
      name_data: null,
      email: null,
      email_data: null,
      password: null,
      password_data: null,
      password_confirmation: null,
      user_new_avatar: null,
      user: null,
      isPwd: true,
      filter: '',
      loading: false,
      file: null,
      url: url,
      // rowCount: 10,
      admin: [
        'Admin', 'Seller', 'Buyer'
      ],
      seller: [
        'Seller', 'Buyer'
      ],
      pagination: {
        // sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 10
      },
      columns: [
        { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
        { name: 'name', align: 'center', label: this.$t('name'), field: 'name', sortable: true },
        { name: 'email', align: 'center', label: this.$t('email'), field: 'email', sortable: true },
        { name: 'status', align: 'center', label: this.$t('status'), field: 'status', sortable: true },
        { name: 'role', align: 'center', label: this.$t('role'), field: 'role', sortable: true },
        { name: 'edit', align: 'center', label: this.$t('edit'), field: 'edit', sortable: true },
        { name: 'delete', align: 'center', label: this.$t('delete'), field: 'delete', sortable: true }
      ],
      data: [],
      original: []
    }
  },
  mounted () {
    this.$store.dispatch('users/usersAction').then(() => {
      // this.data = this.usersGetter
      this.original = this.usersGetter
      // get initial data from server (1st page)
      this.onRequest({
        pagination: this.pagination,
        filter: undefined
      })
    })
  },
  computed: {
    ...mapGetters('users', ['usersGetter', 'authGetter']),
    avatar () {
      if (this.user.avatar) {
        if (this.user.avatar.includes('images/profile')) return this.url + '/' + this.user.avatar
        else return this.user.avatar
      } else return this.user_new_avatar.data
    }
  },
  methods: {
    add (user) {
      this.$store.dispatch('users/registerAction', {
        auth: this.authGetter,
        role: this.role,
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
        api: 'add',
        scope: ''
      })
        .then(() => {
          this.role = this.name = this.email = this.password = this.password_confirmation = null
          this.$store.dispatch('users/usersAction').then(() => {
            // this.data = this.usersGetter
            this.original = this.usersGetter
            // get initial data from server (1st page)
            this.onRequest({
              pagination: this.pagination,
              filter: undefined
            })
          })
        })
        .catch(error => {
          this.role_data = [error.response.data.errors.role][0] || error.response.data.message
          this.name_data = [error.response.data.errors.name][0] || error.response.data.message
          this.email_data = [error.response.data.errors.email][0] || error.response.data.message
          this.password_data = [error.response.data.errors.password][0] || error.response.data.message
        })
    },
    async edit (user) {
      this.user_new_avatar = await this.$axios.get(`api/users/${user.id}?avatar=1`)
      this.editUser = true
      this.addUser = true
      this.role = user.role
      this.name = user.name
      this.email = user.email
      this.user = user
    },
    update (user) {
      this.$store.dispatch('users/updateAction', {
        id: user.id,
        user: true,
        role: this.role,
        name: this.name,
        email: this.email,
        update_password: this.password,
        password_confirmation: this.password_confirmation,
        avatar: this.file
      }).then(response => {
        this.edit(response.user)
        this.password = this.password_confirmation = null
        this.$store.dispatch('users/usersAction').then(() => {
          // this.data = this.usersGetter
          this.original = this.usersGetter
          // get initial data from server (1st page)
          this.onRequest({
            pagination: this.pagination,
            filter: undefined
          })
        })
      })
    },
    Delete (user) {
      this.$store.dispatch('users/deleteAction', user)
        .then((response) => {
          this.$store.dispatch('users/usersAction').then(() => {
            // this.data = this.usersGetter
            this.original = this.usersGetter
            // get initial data from server (1st page)
            this.onRequest({
              pagination: this.pagination,
              filter: undefined
            })
          })
          this.$q.notify({
            color: 'positive',
            position: 'top',
            message: response,
            icon: 'check'
          })
        })
    }, // ================= TagAvatar =================
    onImageChange (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return; this.createImage(files[0])
    }, // TagAvatar: UserModule
    createImage (files) {
      let reader = new FileReader()
      reader.onload = (e) => {
        this.file = e.target.result
      }; reader.readAsDataURL(files)
      setTimeout(() => { this.update(this.user) }, 500)
    },
    deleteImage () {
      this.$axios.delete(`api/users/${this.user.id}?avatar=delete`).then(response => {
        this.edit(response.data.user)
        this.$store.dispatch('users/authAction')
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: this.$t(response.data.success),
          icon: 'check'
        })
      })
    }, // ================= TagAvatar End =================
    onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter

      this.loading = true

      // emulate server
      setTimeout(() => {
        // update rowsCount with appropriate value
        this.pagination.rowsNumber = this.getRowsNumberCount(filter)

        // get all rows if "All" (0) is selected
        const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage

        // calculate starting row of data
        const startRow = (page - 1) * rowsPerPage

        // fetch data from "server"
        const returnedData = this.fetchFromServer(startRow, fetchCount, filter, sortBy, descending)

        // clear out existing data and add new
        this.data.splice(0, this.data.length, ...returnedData)

        // don't forget to update local pagination object
        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.pagination.sortBy = sortBy
        this.pagination.descending = descending

        // ...and turn of loading indicator
        this.loading = false
      }, 1500)
    },

    // emulate ajax call
    // SELECT * FROM ... WHERE...LIMIT...
    fetchFromServer (startRow, count, filter, sortBy, descending) {
      const data = filter
        ? this.original.filter(row => row.name.includes(filter))
        : this.original.slice()

      // handle sortBy
      if (sortBy) {
        const sortFn = sortBy === 'desc'
          ? (descending
            ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
            : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
          )
          : (descending
            ? (a, b) => (parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
            : (a, b) => (parseFloat(a[sortBy]) - parseFloat(b[sortBy]))
          )
        data.sort(sortFn)
      }

      return data.slice(startRow, startRow + count)
    },

    // emulate 'SELECT count(*) FROM ...WHERE...'
    getRowsNumberCount (filter) {
      if (!filter) {
        return this.original.length
      }
      let count = 0
      this.original.forEach((treat) => {
        if (treat.name.includes(filter)) {
          ++count
        }
      })
      return count
    }
  }
}
</script>
