<template>
  <div class="q-pa-md">
    <q-btn icon="add_circle_outline" rounded class="q-mb-md" :label="$t('add_user')" />
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
            <q-popup-edit v-model="props.row.name" title="Update calories" buttons>
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
          <q-td key="edit" :props="props">
            <q-btn icon="edit" rounded class="q-ma-md" />
            <q-popup-edit v-model="props.row.edit" title="Update carbs"
              buttons
              label-set="Update"
              label-cancel="Close"
              :validate="proteinRangeValidation"
              @hide="proteinRangeValidation"
              >
              <q-input type="number" v-model="props.row.status" dense autofocus hint="Use buttons to close" />
              <q-input type="number" v-model="props.row.status" dense autofocus hint="Use buttons to close" />
              <q-input type="number" v-model="props.row.status" dense autofocus hint="Use buttons to close" />
              <q-input type="number" v-model="props.row.status" dense autofocus hint="Use buttons to close" />
              <q-input type="number" v-model="props.row.status" dense autofocus hint="Use buttons to close" />
              <q-input type="number" v-model="props.row.status" dense autofocus hint="Use buttons to close" />
            </q-popup-edit>
          </q-td>
          <q-td key="delete" :props="props">
            <q-btn icon="delete_forever" rounded class="*q-mb-md" @click.prevent="Delete(props.row)"/>
          </q-td>
          <!-- <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td> -->
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      filter: '',
      loading: false,
      // rowCount: 10,
      pagination: {
        // sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 10
      },
      columns: [
        { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
        { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
        { name: 'email', align: 'center', label: 'Email', field: 'email', sortable: true },
        { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true },
        { name: 'role', align: 'center', label: 'Role', field: 'role', sortable: true },
        { name: 'edit', align: 'center', label: 'Edit', field: 'edit', sortable: true },
        { name: 'delete', align: 'center', label: 'Delete', field: 'delete', sortable: true }
      ],
      data: [],
      original: []
    }
  },
  computed: {
    ...mapGetters('users', ['usersGetter'])
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
  methods: {
    Delete (user) {
      this.$store.dispatch('users/deleteAction', user)
        .then(response => {
          this.$store.dispatch('users/usersAction').then(() => {
            // this.data = this.usersGetter
            this.original = this.usersGetter
            // get initial data from server (1st page)
            this.onRequest({
              pagination: this.pagination,
              filter: undefined
            })
          })
          alert(response)

          // this.$q.notify.create({
          //   color: 'positive',
          //   position: 'top',
          //   message: response,
          //   icon: 'check'
          // })
        })
    },
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
