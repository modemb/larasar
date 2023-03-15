<template>

  <q-dialog v-model="editLocation"><!--======= Add Update Locations PopUp ============-->
      <q-card class="my-card text-white" style="width:800px">
        <q-card-section class="bg-primary">
          <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup />
          <div class="text-h6">{{place?$t('Update Location'):$t('Add Location')}}</div>
        </q-card-section>

        <div class="q-pa-sm">

          <div class="row">

            <q-input
              filled
              type="text"
              v-model="place"
              :label="$t('place')"
              lazy-rules class="col-8"
              :error="place_data ? true : false"
              :error-message='place_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_place')]"
            />

            <q-input
              filled
              lazy-rules
              type="text"
              v-model="utc_offset"
              :label="$t('utc_offset')" class="col-4"
              :error="utc_offset_data ? true : false"
              :error-message='utc_offset_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_utc_offset')]"
            />

            <q-input
              filled
              type="text"
              v-model="latitude"
              :label="$t('latitude')"
              lazy-rules class="col-6"
              :error="latitude_data ? true : false"
              :error-message='latitude_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_latitude')]"
            />

            <q-input
              filled
              type="text"
              v-model="longitude"
              :label="$t('longitude')"
              lazy-rules class="col-6"
              :error="longitude_data ? true : false"
              :error-message='longitude_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_longitude')]"
            />

          </div>

          <div class="q-pa-md">
            <q-btn color="primary"
              :loading="loader" @click.prevent="update(Location)"
              :label="place?$t('Update Location'):$t('Add Location')"
            /><!-- TagUpdate: locationModule -->
            <q-btn color="primary" round icon="fas fa-sync"
              class="float-right" @click.prevent="Edit({})"
            />
          </div>

        </div><!-- TagEdit: locationModule -->

      </q-card>
  </q-dialog><!--============================= Add Update Locations PopUp End ========-->

  <div class="q-pa-md">
    <q-table
      :style="'height:' + height + 'px'"
      class="my-sticky-virtscroll-table"
      ref="table"
      :title="$t('locations_list')"
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
          <q-td key="city" :props="props">
            {{ props.row.city }}
          </q-td>
          <q-td key="region" :props="props">
            {{ props.row.region }}
          </q-td>
          <q-td key="country" :props="props">
            {{ props.row.country }}
          </q-td>
          <q-td key="place" :props="props">
            {{ props.row.place }}
          </q-td>
          <q-td key="currency" :props="props">
            {{ props.row.currency }}
          </q-td>
          <q-td key="currency_name" :props="props">
            {{ props.row.currency_name }}
          </q-td>
          <q-td key="latitude" :props="props">
            {{ props.row.latitude }}
          </q-td>
          <q-td key="longitude" :props="props">
            {{ props.row.longitude }}
          </q-td>
          <q-td key="utc_offset" :props="props">{{ props.row.utc_offset }}</q-td>
          <template v-if="locationsData=='locations'||locationsData=='duplicated'">
            <q-td key="edit" :props="props"><!-- TagEdit: locationModule -->
              <q-btn icon="edit" rounded class="q-ma-md" @click.prevent="Edit(props.row)"/>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn icon="delete" rounded @click.prevent="Delete(props.row)"/>
            </q-td><!-- TagDelete: locationModule -->
          </template>
          <template v-else>
            <q-td key="edit" :props="props"><!-- TagRestore: locationModule -->
              <q-btn icon="restore" rounded class="q-ma-md" @click="restore(props.row)"/>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn icon="delete_forever" rounded @click.prevent="delete_forever(props.row)"/>
            </q-td><!-- TagDeleteForever: locationModule -->
          </template>
        </q-tr>
      </template>

      <template v-slot:top-right>
        <q-btn-toggle
          v-model="locationsData"
          push toggle-color="primary"
          glossy class="q-ma-xs col-md-3"
          :options="[
            {label: $t('locations'), value: 'locations'},
            {label: $t('duplicated'), value: 'duplicated'},
            {label: $t('trashed'), value: 'trashed'},
          ]"
        /><!-- TagPeriod: PeriodModule -->

        <q-btn icon="fas fa-plus" color="primary" class="q-ma-xs">
          <q-popup-proxy @before-show="updateProxy" transition-show="scale" transition-hide="scale">
            <google-autocomplete/>
          </q-popup-proxy>
        </q-btn><!-- TagPeriod: PeriodModule -->

        <q-btn icon="fas fa-cut" color="primary"
          :loading="loader" class="q-ma-xs"
          @click="truncate"
        />

        <q-btn icon="add" icon-right="place"
          color="primary" class="q-ma-xs *col-md-1"
          @click="editLocation=true"
        /><!-- TagAdd: LocationModule :label="$t('Add Location')"-->

        <q-btn icon="add" color="primary" class="q-ma-xs"
          icon-right="fas fa-chart-bar" :loading="loader"
          @click="fromAnalytics"
        />

        <q-input clearable class="q-ma-xs col-md-3" borderless dense debounce="300" v-model="filter" :placeholder="$t('search')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

    </q-table><!--============ Data Table ====================-->
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import {  useStore } from 'vuex'
import { i18n, api } from 'boot/axios'
import { useCrudStore } from 'stores/crud'
import GoogleAutocomplete from 'components/GoogleAutocomplete.vue'

/**
 * Tags:
 *
 * @from UserController
 */
export default {
  components: {
    GoogleAutocomplete, // google-autocomplete
  },
  setup () {
    const $t = i18n.global.t
    const $store = useStore()
    const { crudAction, notifyAction } = useCrudStore()
    const loader = ref(false)
    const editLocation = ref(false)
    const locationsData = ref('locations')
    const Location = ref(null)

    const place = ref(null)
    const latitude = ref(null)
    const longitude = ref(null)
    const utc_offset = ref(null)

    const token = $store.getters['users/tokenGetter']

    onMounted(() => onload({ locationsData: 'locations' }))
    watch(locationsData, val => onload({ locationsData: val }))

    const toFindDuplicates = array => array.filter((item, index) => array.indexOf(item) !== index)
    const duplicateElements = toFindDuplicates($store.getters['users/usersGetter'])
    console.log(duplicateElements)

    function onload(payload) {
      crudAction({ ...payload, ...{
        url: 'api/users/locations', method: 'get',
      }}).then(users => $store.commit('users/usersMutation', { users }))
         .catch(e => notifyAction({error: 'locationsAction', e}))
         .then(() => loader.value = false)
    }

    function Delete (location) {
      if (token && confirm('Are You Sure You Want To '+(location?.forever?'Delete Forever':'Delete')+' Location '+ location?.place) === true) crudAction({
          url: `/api/users/${location?.id}`,
          method: 'delete', location: true
        }).then(() => onload({ locationsData: locationsData.value}))
          .catch(e => notifyAction({error: 'deleteAction', e}))
    } // TagDelete: locationModule

    return {
      // ipDebug,
      // desktop: $q.platform.is.desktop,
      height: screen.height / 1.4,
      editLocation,
      locationsData,
      loader,
      filter: ref(''),

      place,
      latitude,
      longitude,
      utc_offset,
      Location,

      pagination: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 0,
        rowsNumber: 10
      },

      update(location) {
        loader.value = true
        crudAction({
          success: 'Location Updated Successfully',
          url: 'api/users/location',
          method: 'put',
          place: place.value||location?.place||'',
          latitude: latitude.value||location?.latitude||'',
          longitude: longitude.value||location?.longitude||'',
          utc_offset: utc_offset.value||location?.utc_offset||''
        }).then(() => onload({ locationsData: locationsData.value}))
          .catch(e => notifyAction({error: 'updateLocation', e}))
      }, // TagUpdate: locationModule
      Edit(location) {
        editLocation.value = true

        place.value = location?.place||''
        latitude.value = location?.latitude||''
        longitude.value = location?.longitude||''
        utc_offset.value = location?.utc_offset||''
        Location.value = location
      }, // TagEdit: locationModule
      Delete, // TagDelete: locationModule
      delete_forever(location) { // AddPasswordBeforeDeleteForever
        Delete({...location, ...{forever: 1}})
      },// TagDeleteForever: locationModule
      restore (location) {
        api.post('api/users', {location_id: location?.id}).then(() => {
          onload({ locationsData: 'trashed' })
        })
      }, // TagRestore: locationModule
      fromAnalytics () {
        if (token && confirm('Are You Sure You Want To Add Locations From Analytics') === true)
        loader.value = true; else return
        api.post('api/users', {fromAnalytics: true}).then(() => {
          onload({ locationsData: 'locations' })
          loader.value = false
        }).catch(e => notifyAction({error: 'fromAnalytics', e}))
      },

      truncate () {
        if (token && confirm('Are You Sure You Want To Truncate Locations') === true)
        loader.value = true; else return
        api.delete('api/users/truncate', {truncate: true}).then(() => {
          onload({ locationsData: 'locations' })
          loader.value = false
        }).catch(e => notifyAction({error: 'truncate', e}))
      },

      columns: computed(() => [ // Location
        { name: 'id', align: 'center', label: $t('ID'), field: 'id', sortable: true },
        { name: 'city', align: 'center', label: $t('city'), field: 'city', sortable: true },
        { name: 'region', align: 'center', label: $t('region'), field: 'region', sortable: true },
        { name: 'country', align: 'center', label: $t('country'), field: 'country', sortable: true },
        { name: 'place', align: 'center', label: $t('place'), field: 'place', sortable: true },
        { name: 'currency', align: 'center', label: $t('currency'), field: 'currency', sortable: true },
        { name: 'currency_name', align: 'center', label: $t('currency_name'), field: 'currency_name', sortable: true },
        { name: 'latitude', align: 'center', label: $t('latitude'), field: 'latitude', sortable: true },
        { name: 'longitude', align: 'center', label: $t('longitude'), field: 'longitude', sortable: true },
        { name: 'utc_offset', align: 'center', label: $t('utc_offset'), field: 'utc_offset', sortable: true },
        { name: 'edit', align: 'center', label: $t('edit/restore'), field: 'edit', sortable: false },
        { name: 'delete', align: 'center', label: $t('delete/foreve'), field: 'delete', sortable: false }
      ]), rows: computed(() => $store.getters['users/usersGetter'])
    }
  }
}
</script>
