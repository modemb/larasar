<template>

  <q-dialog v-model="editLocation"><!--======= Add Update Locations PopUp ============-->
      <q-card class="my-card text-white" style='width:800px'>
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
              :error-message='place_data'
              :rules="[val => val && val.length > 0 || $t('add_place')]"
            />

            <q-input
              filled
              lazy-rules
              type="text"
              v-model="utc_offset"
              :label="$t('utc_offset')"
              :error="utc_offset_data ? true : false"
              :error-message='utc_offset_data' class="col-4"
              :rules="[val => val && val.length > 0 || $t('add_utc_offset')]"
            />

            <q-input
              filled
              type="text"
              v-model="latitude"
              :label="$t('latitude')"
              lazy-rules class="col-6"
              :error="latitude_data ? true : false"
              :error-message='latitude_data'
              :rules="[val => val && val.length > 0 || $t('add_latitude')]"
            />

            <q-input
              filled
              type="text"
              v-model="longitude"
              :label="$t('longitude')"
              lazy-rules class="col-6"
              :error="longitude_data ? true : false"
              :error-message='longitude_data'
              :rules="[val => val && val.length > 0 || $t('add_longitude')]"
            />

            <q-input
              filled
              type="text"
              v-model="lat"
              :label="$t('lat')" class="col-6"
              :error="lat_data ? true : false"
              :error-message='lat_data'
              :rules="[val => val && val.length > 0 || $t('add_lat')]"
            />

            <q-input
              lazy-rules
              v-model="lon"
              filled type="text"
              :label="$t('lon')" class="col-6"
              :error="lon_data ? true : false"
              :error-message='lon_data'
              :rules="[val => val && val.length > 0 || $t('add_lon')]"
            />

          </div>

          <div class="q-pa-md">
            <q-btn color="primary"
              :label="place?$t('Update Location'):$t('Add Location')"
              @click.prevent="update(Location)"
            /><!-- TagUpdate: locationModule -->
            <q-btn color="primary" round icon="fas fa-sync"
              class="float-right"
              @click.prevent="Edit({})"
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
          <q-td key="latitude" :props="props">
            {{ props.row.latitude }}
          </q-td>
          <q-td key="longitude" :props="props">
            {{ props.row.longitude }}
          </q-td>
          <q-td key="lat" :props="props">
            <div class="text-pre-wrap">{{ props.row.lat }}</div>
          </q-td>
          <q-td key="lon" :props="props">
            {{ props.row.lon }}
          </q-td>
          <q-td key="utc_offset" :props="props">{{ props.row.utc_offset }}</q-td>
          <template v-if="locationsData=='locations'">
            <q-td key="edit" :props="props"><!-- TagEdit: locationModule -->
              <q-btn icon="edit" rounded class="q-ma-md" @click.prevent="Edit(props.row)"/>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn icon="delete" rounded class="*q-mb-md" @click.prevent="Delete(props.row)"/>
            </q-td><!-- TagDelete: locationModule -->
          </template>
          <template v-else>
            <q-td key="edit" :props="props"><!-- TagRestore: locationModule -->
              <q-btn icon="restore" rounded class="q-ma-md" @click="restore(props.row)"/>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn icon="delete_forever" rounded class="*q-mb-md" @click.prevent="delete_forever(props.row)"/>
            </q-td><!-- TagDeleteForever: locationModule -->
          </template>
        </q-tr>
      </template>

      <template v-slot:top-right class="*row">
        <q-btn-toggle
          v-model="locationsData"
          push toggle-color="primary"
          glossy class="q-ma-xs col-md-3"
          :options="[
            {label: $t('locations'), value: 'locations'},
            {label: $t('trashed'), value: 'trashed'},
          ]"
        /><!-- TagPeriod: PeriodModule -->

        <q-btn icon="add" color="primary" class="q-ma-xs *col-md-1">
          <q-popup-proxy @before-show="updateProxy" transition-show="scale" transition-hide="scale">
            <google-autocomplete/>
          </q-popup-proxy>
        </q-btn><!-- TagPeriod: PeriodModule -->

        <q-btn icon="add" color="primary" class="q-ma-xs *col-md-1"
          label="Analytics" :loading="loader"
          @click="fromAnalytics"
        />

        <q-btn icon="fas fa-cut" color="primary" class="q-ma-xs *col-md-1"
          label="Truncate" :loading="loader"
          @click="truncate"
        />

        <q-input class="q-ma-xs col-md-3" borderless dense debounce="300" v-model="filter" :placeholder="$t('search')">
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
// import { useQuasar, copyToClipboard } from 'quasar'
// import { useRouter, useRoute } from 'vue-router'
import {  useStore } from 'vuex'
import { i18n, api, crudAction, notifyAction } from 'boot/axios'
// import { i18n } from 'boot/i18n'
import GoogleAutocomplete from '../components/GoogleAutocomplete'

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
    const $t = i18n?.global?.t
    // const $q = useQuasar()
    // const $route = useRoute()
    const loader = ref(false)
    const editLocation = ref(false)
    const $store = useStore()
    const locationsData = ref('locations')
    const Location = ref(null)

    const place = ref(null)
    const lat = ref(null)
    const lon = ref(null)
    const latitude = ref(null)
    const longitude = ref(null)
    const utc_offset = ref(null)

    const onload = payload => $store.dispatch('users/usersAction', payload)

    onMounted(() => onload({ locationsData: 'locations' }))
    watch(locationsData, val => onload({ locationsData: val }))

    function Delete (location) {
      const token = $store.getters['users/tokenGetter']
      if (token && confirm('Are You Sure You Want To '+(location.forever?'Delete Forever':'Delete')+' Location '+ location.place) === true) {
        crudAction({
          url: `/api/users/${location.id}`,//?${qs(location)}
          method: 'delete',
          location: true
        }).then(onload({ locationsData: locationsData.value}))
          .catch(e => notifyAction({error: 'deleteAction', e}))
      }
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
      lat,
      lon,
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

      Edit (location) {
        editLocation.value = true

        place.value = location.place||''
        lat.value = location.lat||''
        lon.value = location.lon||''
        latitude.value = location.latitude||''
        longitude.value = location.longitude||''
        utc_offset.value = location.utc_offset||''
        Location.value = location
      }, // TagEdit: locationModule
      update (location) {
        console.log('location', location)
        // loader.value = true
        crudAction({
          message: 'Location Updated Successfully',
          url: 'api/users',
          method: 'post',
          place: place.value||location.place||'',
          lat: lat.value||location.lat||'',
          lon: lon.value||location.lon||'',
          latitude: latitude.value||location.latitude||'',
          longitude: longitude.value||location.longitude||'',
          utc_offset: utc_offset.value||location.utc_offset||'',
          loc: 1
        }).then(onload({ locationsData: locationsData.value}))
          .catch(e => notifyAction({error: 'updateLocation', e}))
      }, // TagUpdate: locationModule
      Delete, // TagDelete: locationModule
      delete_forever (location) { // AddPasswordBeforeDeleteForever
        Delete({...location, ...{forever: 1}})
      },// TagDeleteForever: locationModule
      restore (location) {
        api.post('api/users', {location_id: location.id}).then(() => {
          onload({ locationsData: 'trashed' })
        })
      }, // TagRestore: locationModule
      fromAnalytics () {
        loader.value = true
        api.post('api/users', {fromAnalytics: true}).then(() => {
          onload({ locationsData: 'locations' })
          loader.value = false
        }).catch(e => notifyAction({error: 'fromAnalytics', e}))
      },

      truncate () {
        loader.value = true
        api.delete('api/users/truncate', {truncate: true}).then(() => {
          onload({ locationsData: 'locations' })
          loader.value = false
        }).catch(e => notifyAction({error: 'truncate', e}))
      },

      rows: computed(() => $store.getters['users/usersGetter']),
      columns: [ // Location
        { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
        { name: 'city', align: 'center', label: 'city', field: 'city', sortable: true },
        { name: 'region', align: 'center', label: 'region', field: 'region', sortable: true },
        { name: 'country', align: 'center', label: 'country', field: 'country', sortable: true },
        { name: 'place', align: 'center', label: 'place', field: 'place', sortable: true },
        { name: 'latitude', align: 'center', label: 'latitude', field: 'latitude', sortable: true },
        { name: 'longitude', align: 'center', label: 'longitude', field: 'longitude', sortable: true },
        { name: 'lat', align: 'center', label: 'lat', field: 'lat', sortable: true },
        { name: 'lon', align: 'center', label: 'lon', field: 'lon', sortable: true },
        { name: 'utc_offset', align: 'center', label: 'utc_offset', field: 'utc_offset', sortable: true },
        { name: 'edit', align: 'center', label: $t('edit/restore'), field: 'edit', sortable: false },
        { name: 'delete', align: 'center', label: $t('delete/foreve'), field: 'delete', sortable: false }
      ]
    }
  }
}
</script>
