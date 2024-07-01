<template>

  <q-dialog v-model="editLocation"><!--======= Add Update Locations PopUp ============-->
      <q-card class="my-card text-white" style="width:800px">
        <q-card-section class="bg-primary">
          <q-btn dense round class="float-right" icon="close" v-close-popup />
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
              _:error="place_data ? true : false"
              _:error-message='place_data' clearable
              :rules="[(val: string | any[]) => val && val.length > 0 || $t('add_place')]"
            />

            <q-input
              filled
              lazy-rules
              type="text"
              v-model="utc_offset"
              :label="$t('utc_offset')" class="col-4"
              _:error="utc_offset_data ? true : false"
              _:error-message='utc_offset_data' clearable
              :rules="[(val: string | any[]) => val && val.length > 0 || $t('add_utc_offset')]"
            />

            <q-input
              filled
              type="text"
              v-model="latitude"
              :label="$t('latitude')"
              lazy-rules class="col-6"
              _:error="latitude_data ? true : false"
              _:error-message='latitude_data' clearable
              :rules="[(val: string | any[]) => val && val.length > 0 || $t('add_latitude')]"
            />

            <q-input
              filled
              type="text"
              v-model="longitude"
              :label="$t('longitude')"
              lazy-rules class="col-6"
              _:error="longitude_data ? true : false"
              _:error-message='longitude_data' clearable
              :rules="[(val: string | any[]) => val && val.length > 0 || $t('add_longitude')]"
            />

          </div>

          <div class="q-pa-md">
            <q-btn color="primary"
              :loading="loader" @click.prevent="update(Location)"
              :label="place?$t('Update Location'):$t('Add Location')"
            /><!-- TagUpdate: locationModule -->
            <q-btn round icon="fas fa-sync" color="primary"
              class="float-right" @click.prevent="Edit({ place: '', latitude: 0, longitude: 0, utc_offset: 0 })"
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
      row-key="name"
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
          <template v-if="locationsData=='locations'||locationsData=='locDuplicated'">
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
            {label: $t('duplicated'), value: 'locDuplicated'},
            {label: $t('Trash'), value: 'locTrashed'},
          ]"
        /><!-- TagPeriod: PeriodModule -->

        <q-btn color="primary" class="q-ma-xs" icon="fas fa-plus">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <google-autocomplete/>
          </q-popup-proxy><!-- @before-show="updateProxy" -->
        </q-btn><!-- TagPeriod: PeriodModule -->

        <q-btn color="primary"
          class="q-ma-xs"
          icon="fas fa-cut"
          :loading="loader"
          @click="truncate"
        />

        <q-btn icon="add" icon-right="place"
          color="primary" class="q-ma-xs *col-md-1"
          @click="editLocation=true"
        /><!-- TagAdd: LocationModule :label="$t('Add Location')"-->

        <q-btn color="primary" class="q-ma-xs" icon="add"
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

<script lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { i18n, api, mSession } from 'boot/axios'
import { useCrudStore } from 'stores/crud'
import GoogleAutocomplete from 'components/GoogleAutocomplete.vue'
import { Param } from 'components/models'

/**
 * Tags:
 *
 * @to UserController
 */
export default {
  components: {
    GoogleAutocomplete, // google-autocomplete
  },
  setup () {
    const $t = i18n.global.t
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const loader = ref(false)
    const editLocation = ref(false)
    const locationsData = ref('locations')
    const Location = ref()

    const place = ref('')
    const latitude = ref(0)
    const longitude = ref(0)
    const utc_offset = ref(0)

    const auth = computed(() => store.authGetter)

    onMounted(() => locationsAction({ locationsData: 'locations' }))
    watch(locationsData, val => locationsAction({ locationsData: val }))

    const toFindDuplicates = (array: any[]) => array?.filter((item, index) => array.indexOf(item) !== index)
    const duplicateElements = toFindDuplicates(store.locationsGetter)
    console.log(duplicateElements)

    function locationsAction(payload: Partial<Param>) {
      // if (!included(locationsData.value))
      crudAction({ ...payload,
        mutate: locationsData.value,
        url: 'api/users/locations', method: 'get',
      }).catch((e: unknown) => notifyAction({error: 'locationsAction', e}))
         .then(() => loader.value = false)
    }

    function Delete (location: { forever: boolean; place: string; id: number }) {
      if (auth.value && confirm('Are You Sure You Want To '+(location?.forever?'Delete Forever':'Delete')+' Location '+ location?.place) === true)
      crudAction({
          url: `/api/users/${location?.id}`,
          method: 'delete', location: true,
          refresh: ['reloadApp']//.then(() => mSession(['reloadApp']))
        }).then(() => locationsAction({ locationsData: locationsData.value}))
          .catch((e: unknown) => notifyAction({error: 'deleteAction', e}))
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

      update(location: { place: string; latitude: number; longitude: number; utc_offset: number }) {
        loader.value = true
        crudAction({
          success: 'Location Updated Successfully',
          url: 'api/users/location',
          method: 'put',
          place: place.value||location?.place||'',
          latitude: latitude.value||location?.latitude||'',
          longitude: longitude.value||location?.longitude||'',
          utc_offset: utc_offset.value||location?.utc_offset||'',
          refresh: ['reloadApp']//.then(() => mSession(['reloadApp']))
        }).then(() => locationsAction({ locationsData: locationsData.value}))
          .catch((e: any) => notifyAction({error: 'updateLocation', e}))
      }, // TagUpdate: locationModule
      Edit(location: { place: string; latitude: number; longitude: number; utc_offset: number } | null) {
        editLocation.value = true

        place.value = location?.place||''
        latitude.value = location?.latitude||0
        longitude.value = location?.longitude||0
        utc_offset.value = location?.utc_offset||0
        Location.value = location
      }, // TagEdit: locationModule
      Delete, // TagDelete: locationModule
      delete_forever(location: { forever: boolean; place: string; id: number }) {
        Delete({...location, forever: true}) // AddPasswordBeforeDeleteForever
      },// TagDeleteForever: locationModule
      restore (location: { id: number }) {
        api.post('api/users', {location_id: location?.id}).then(() => {
          mSession(['reloadApp'])
          locationsAction({ locationsData: 'locTrashed' })
        }).catch(e => notifyAction({error: 'restoreLocation', e}))
      }, // TagRestore: locationModule
      fromAnalytics () {
        if (auth.value && confirm('Are You Sure You Want To Add Locations From Analytics') === true)
        loader.value = true; else return
        api.post('api/users', {fromAnalytics: true}).then(() => {
          mSession(['reloadApp'])
          locationsAction({ locationsData: 'locations' })
          loader.value = false
        }).catch(e => notifyAction({error: 'fromAnalytics', e}))
      },

      truncate () {
        const password_confirmation = prompt('Please enter your password:')
        if (auth.value && confirm('Are You Sure You Want To Truncate Locations') === true)
        loader.value = true; else return;

        if (password_confirmation)
        api.delete('api/users/truncate', { data: { truncate: true, password_confirmation }}).then(({ data }) => {
        // api.delete('api/users/truncate', { data: { truncate: true, password_confirmation }}).then(({ data }) => {
          mSession(['reloadApp'])
          locationsAction({ locationsData: 'locations' })
          loader.value = false; notifyAction(data)
        }).catch(e => notifyAction({error: 'truncate', e}))
      },

      columns: <any> computed(() => [ // Location
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
        { name: 'delete', align: 'center', label: $t('delete/forever'), field: 'delete', sortable: false }
      ]), rows: computed(() => store[locationsData.value]||[])
    }
  }
}
</script>
