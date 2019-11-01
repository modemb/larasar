<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Sort" class="mb-0">
          <b-input-group>
            <b-form-select v-model="sortBy" :options="sortOptions">
              <option slot="first" :value="null">-- none --</option>
            </b-form-select>
            <b-form-select v-model="sortDesc" :disabled="!sortBy" slot="append">
              <option :value="false">Asc</option> <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Sort direction" class="mb-0">
          <b-form-select v-model="sortDirection">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
            <option value="last">Last</option>
          </b-form-select>
        </b-form-group>
      </b-col>

      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Per page" class="mb-0">
          <b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      show-empty
      stacked="md"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      @filtered="onFiltered"

      ><template slot="*name" slot-scope="row">
        {{ row.value.first }} {{ row.value.last }}
      </template>

      <template slot="actions" slot-scope="row">

        <ul class="nav *flex-column flex-row nav-pills">
          <li class="nav-item col-sm-1" data-toggle="modal" data-target="#item"  @click=editUser(row.item)>
            <fa icon=edit />
          </li>
          <li class="nav-item col-sm-1" @click=deleteUser(row.item.id)>
            <fa icon=trash-alt />
          </li>
        </ul>

        <!-- Modal -->
        <div class="modal fade" id="item" tabindex="-1" role="dialog" aria-labelledby="itemTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">

              <card :title="$t('your_info')">
                <form @submit.prevent=update(form.id) @keydown="form.onKeydown($event)">
                  <alert-success :form="form" :message="$t('info_updated')" />

                  <!-- Name -->
                  <div class="form-group row">
                    <label class="col-md-3 col-form-label text-md-right">{{ $t('name') }}</label>
                    <div class="col-md-7">
                      <input v-model="form.name" :class="{ 'is-invalid': form.errors.has('name') }" class="form-control" type="text" name="name">
                      <has-error :form="form" field="name" />
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="form-group row">
                    <label class="col-md-3 col-form-label text-md-right">{{ $t('email') }}</label>
                    <div class="col-md-7">
                      <input v-model="form.email" :class="{ 'is-invalid': form.errors.has('email') }" class="form-control" type="email" name="email">
                      <has-error :form="form" field="email" />
                    </div>
                  </div>

                  <div class="form-group row">
                    <div class="col-md-9 ml-md-auto">
                      <v-button :loading="form.busy" type="success">
                        {{ $t('update') }}
                      </v-button>
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">
                        Close
                      </button>
                    </div>
                  </div>
                </form>
              </card>

            </div>
          </div>
        </div>

      </template>

    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>

  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Form from 'vform'

  export default {
    middleware: 'auth',
    data() {
      return {
        // items: [],
        form: new Form({
          name: '',
          email: '',
          id: ''
        }),
        fields: [
          { key: 'id', label: 'ID', sortable: true },
          { key: 'name', label: 'Full Name', sortable: true },
          { key: 'email', label: 'Email', sortable: true },
          { key: 'actions', label: 'Actions' }
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [10, 20, 40, 80, 160],
        sortBy: null,
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        items: 'users/users'
      }),
      sortOptions() {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      }
    },
    mounted() {
      this.$store.dispatch('users/getUser').then(() => {
        // Set the initial number of items
        this.totalRows = this.items.length
      })
    },
    methods: {
      info(item, index, button) {
        this.infoModal.title = `Row index: ${index}`
        this.infoModal.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      deleteUser(id){
        this.$store.dispatch('users/deleteUser', id)
      },
      editUser(user){
        this.form.name = user.name
        this.form.email = user.email
        this.form.id = user.id
      },
      async update (id) {
        const { data } = await this.form.patch('/api/users/'+id)

        this.$store.dispatch('users/updateUser', { users: data })

        if(window.config.authID == id){
          const { data } = await this.form.patch('/api/settings/profile')
          this.$store.dispatch('auth/updateUser', { user: data })
        }
      }
    }
  }

</script>

<style scoped>
  .nav-item {
    cursor: pointer;
  }
</style>
