<template>
  <div class="q-pa-md">
    <!--============ Data Table ========================-->
    <q-table
      :style="'height:' + height + 'px'"
      class="my-sticky-virtscroll-table"
      ref="table"
      :title="$t('Analytics')"
      :rows="rows"
      :columns="columns"
      row-key="name"
      virtual-scroll
      :virtual-scroll-item-size="100/*48*/"
      :rows-per-page-options="[0]"
      :loading="loading"
      :filter="filter"
      binary-state-sort
    >
    <!--
      :pagination="pagination"
      @request="onRequest"
    -->

      <template v-slot:top-right class="row">
          <q-btn
            color="primary"
            icon-right="archive"
            class="*q-ma-xs *col-md-1"
            :label="$t('export_to_csv')"
            no-caps
            @click="exportTable"
          /><!-- TagExport: UserModule -->
          <q-btn icon="event" color="primary" class="q-ma-xs *col-md-1" :label="JSON.stringify(proxyDate)">
            <q-popup-proxy @before-show="updateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="proxyDate" :range="range" ><!-- :setToday="!range" -->
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-toggle v-model="range" label="Range" />
                  <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn><!-- TagPeriod: PeriodModule -->
          <q-btn-toggle
            v-model="period"
            push
            glossy class="*q-ma-xs *col-md-3"
            toggle-color="primary"
            :options="[
              {icon: 'fas fa-sync', value: 'today'},
              {label: $t('Day'), value: '-1 day'},
              {label: $t('Week'), value: '-1 week'},
              {label: $t('Month'), value: '-1 month'},
              {label: $t('Year'), value: '-1 year'}
            ]"
          /><!-- TagPeriod: PeriodModule -->
          <q-input class="q-ma-xs col-md-3" borderless dense debounce="300" v-model="filter" :placeholder="$t('search')">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
      </template>

      <template v-slot:header="props" v-if="period=='today'">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          > {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props" v-if="period=='today'">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          > {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="row text-left" v-for="(session, i) in props.row.sessions" :key="i">
              <div class="text-h6">
                <i class="fab fa-chrome"/> {{session.user_agent}} <i class="far fa-clock"/>
                <!-- {{ session.agent.platform }} - {{ session.agent.browser }} -->
                {{timeago(new Date(session.last_activity * 1000))}}
              </div><!-- props: ['sessions'] https://laravel.com/docs/9.x/authentication#invalidating-sessions-on-other-devices-->
            </div>
          </q-td>
        </q-tr>
      </template><!-- ExpandingRowModule -->

    </q-table><!--=== Data Table End ====-->
  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue'
import { exportFile, useQuasar, date } from 'quasar'
import { useStore } from 'vuex'
import { i18n, timeago, crudAction, notifyAction } from 'boot/axios'

const $t = i18n.global.t

const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
  { name: 'ip', align: 'center', label: 'IP', field: 'ip', sortable: true },
  { name: 'session', align: 'center', label: $t('session'), field: 'session', sortable: true },
  { name: 'city', align: 'center', label: $t('city'), field: 'city', sortable: true },
  { name: 'region', align: 'center', label: $t('region'), field: 'region', sortable: true },
  { name: 'country', align: 'center', label: $t('country'), field: 'country', sortable: true },
  { name: 'updated_at', align: 'center', label: $t('updated_at'), field: 'updated_at', sortable: true },
  { name: 'created_at', align: 'center', label: $t('created_at'), field: 'created_at', sortable: true },
  { name: 'first_name', align: 'center', label: $t('first_name'), field: 'first_name', sortable: true },
  { name: 'last_name', align: 'center', label: $t('last_name'), field: 'last_name', sortable: true },
  { name: 'email', align: 'center', label: $t('email'), field: 'email', sortable: true },
  { name: 'status', align: 'center', label: $t('status'), field: 'status', sortable: true },
  { name: 'role', align: 'center', label: $t('role'), field: 'role', sortable: true },
  { name: 'app', align: 'center', label: $t('app'), field: 'app', sortable: true },
  { name: 'email_verified_at', align: 'center', label: $t('email_verified_at'), field: 'email_verified_at', sortable: true }
]

/**
 * Tags: PeriodModule - ExpandingRowModule
 *
 * @from
 */

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {
  props: ['sessions'],
  setup () {
    const $store = useStore()
    const $q = useQuasar()
    const timeStamp = Date.now()
    const formattedString = date.formatDate(timeStamp, 'YYYY/MM/DD')//YYYY-MM-DDTHH:mm:ss.SSSZ
    const proxyDate = ref(formattedString) //ref({ from: '2020/07/08', to: '2020/07/17' })
    const period = ref('today')
    // const columns = ref([])
    const loading = ref(false)

    const rows = computed(() => $store.getters['users/analyticsGetter'])

    // const role = ref(null)
    // const first_name = ref(null)
    // const last_name = ref(null)
    // const email = ref(null)

    function crud(rowsData) {
      crudAction(rowsData).then(crud => $store.commit('users/analyticsMutation', crud))
                          .catch(e => notifyAction({error: 'analyticsAction', e}))
    } watch(period,  val => !val||onLoad(val))

    function onLoad (period) {
      crud({
        url: 'api/users/analytics',
        method: 'get',
        // analytics: true,
        period: period
      })
    } onMounted(() => onLoad(period.value))

    return {
      period,
      proxyDate, // 'YYYY-MM-DD',
      height: ref(screen.height / 1.4),
      // role,
      // first_name,
      // last_name,
      // email,
      filter: ref(''),
      range: ref(false),
      loading,
      timeago,

      save () {
        period.value = null
        crud({
          expandingRow: true,
          url: 'api/users/analytics',
          method: 'get',
          // analytics: true,
          from: proxyDate.value.from,
          to: proxyDate.value.to,
          proxyDate: proxyDate.value
        })
      }, // TagPeriod: PeriodModule

      fnum (x) {
        if (isNaN(x)) return x
        if (x < 9999) return x
        if (x < 1000000) return Math.round(x / 1000) + 'K'
        if (x < 10000000) return (x / 1000000).toFixed(2) + 'M'
        if (x < 1000000000) return Math.round((x / 1000000)) + 'M'
        if (x < 1000000000000) return Math.round((x / 1000000000)) + 'B'
        return '1T+'
      }, // TagNum: AppModule

      exportTable () {
        // naive encoding to csv format
        const content = [columns.map(col => wrapCsvValue(col.label))].concat(
          rows.value.map(row => columns.map(col => wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[ col.field === void 0 ? col.name : col.field ],
            col.format
          )).join(','))
        ).join('\r\n')

        const status = exportFile(
          'table-export.csv',
          content,
          'text/csv'
        )

        if (status !== true) {
          $q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning'
          })
        }
      }, // TagExport: UserModule

      pagination: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 0,
        rowsNumber: 10
      },

      columns,
      rows
    }
  }
}
</script>

<style lang="sass">
</style>
