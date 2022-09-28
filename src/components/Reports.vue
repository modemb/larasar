<template>
  <div class="q-pa-md">
    <q-table
      :style="'height:' + height + 'px'"
      class="my-sticky-virtscroll-table"
      :title="`${$t('reports')}`"
      :rows="rows"
      :columns="columns"
      row-key="id"

      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort


      virtual-scroll
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      v-model:pagination="pagination"
    ><!-- https://quasar.dev/vue-components/table#example--virtual-scroll-with-sticky-header
      -->

      <template v-slot:top-right class="row" v-if="!(post_id||pending_payments)">
        <q-btn
          color="primary"
          icon-right="archive"
          class="*q-ma-xs *col-md-1"
          :label="$t('export_to_csv')"
          no-caps
          @click="exportTable"
        /><!-- TagExport: UserModule -->

        <!-- <q-btn icon="event" color="primary" class="q-ma-xs *col-md-1" :label="date">
          <q-popup-proxy @before-show="updateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="proxyDate" setToday>
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Cancel" color="primary" flat v-close-popup />
                <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>TagPeriod: PeriodModule -->

        <q-btn icon="event" color="primary" class="q-ma-xs *col-md-1" :label="JSON.stringify(proxyDate)" v-if="!post_reports">
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
          push v-if="!post_reports"
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

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">{{ props.row.id }}</q-td>
          <!-- <q-td key="product" :props="props">{{ props.row.product }}</q-td> -->
          <q-td key="product" :props="props">
            <q-btn color="primary"
              :to="'/post/'+props.row.post_id"
              :label="props.row.product||props.row.post_id"
            />
          </q-td>

          <q-td key="first_name" :props="props">
            {{ props.row.user.first_name }}
          </q-td>
          <q-td key="last_name" :props="props">
            {{ props.row.user.last_name }}
          </q-td>

          <q-td key="sale_date" :props="props">{{ props.row.sale_date }}</q-td>
          <q-td key="start_date" :props="props">{{ props.row.start_date }}</q-td>
          <q-td key="end_date" :props="props">{{ props.row.end_date }}</q-td>
          <q-td key="plan" :props="props">{{ props.row.plan }}</q-td>
          <q-td key="payment" :props="props">{{ props.row.payment }}</q-td>
          <q-td key="amount" :props="props">{{ props.row.amount }}</q-td>
          <q-td key="total" :props="props">{{ props.row.total }}</q-td>
          <q-td key="currency_code" :props="props">{{ props.row.currency_code }}</q-td>

          <!-- <template v-if="usersData">
            <q-td key="edit" :props="props">
              <q-btn icon="edit" rounded class="q-ma-md" @click="Edit(props.row)"/>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn icon="delete" rounded class="*q-mb-md" @click.prevent="Delete(props.row)"/>
            </q-td>
          </template>
          <template v-else>
            <q-td key="edit" :props="props">
              <q-btn icon="restore" rounded class="q-ma-md" @click="restore(props.row)"/>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn icon="delete_forever" rounded class="*q-mb-md" @click.prevent="delete_forever(props.row)"/>
            </q-td>
          </template> -->

        </q-tr>
      </template>

    </q-table>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue'
import { exportFile, useQuasar, date  } from 'quasar'
import { useStore } from 'vuex'
import { i18n, crudAction, notifyAction } from 'boot/axios'
// import { i18n } from 'boot/i18n'

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
  props: ['post_id', 'pending_payments', 'post_reports'],
  setup (props) {
    const $t = i18n?.global?.t
    const $q = useQuasar()
    const $store = useStore()
    const timeStamp = Date.now()
    const formattedString = date.formatDate(timeStamp, 'YYYY/MM/DD')//YYYY-MM-DDTHH:mm:ss.SSSZ
    const proxyDate = ref(formattedString) //ref({ from: '2020/07/08', to: '2020/07/17' })
    const period = ref('today')
    const loading = ref(false)
    const rows = ref([])
    const columns = computed(() => [
      { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
      { name: 'product', align: 'center', label: $t('product'), field: 'product', sortable: true },
      { name: 'first_name', align: 'center', label: $t('first_name'), field: 'first_name', sortable: true },
      { name: 'last_name', align: 'center', label: $t('last_name'), field: 'last_name', sortable: true },
      { name: 'sale_date', align: 'center', label: $t('sale_date'), field: 'sale_date', sortable: true },
      { name: 'start_date', align: 'center', label: $t('start_date'), field: 'start_date', sortable: true },
      { name: 'end_date', align: 'center', label: $t('end_date'), field: 'end_date', sortable: true },
      { name: 'plan', align: 'center', label: $t('plan'), field: 'plan', sortable: true },
      { name: 'payment', align: 'center', label: $t('payment'), field: 'payment', sortable: true },
      { name: 'amount', align: 'center', label: $t('amount'), field: 'amount', sortable: true },
      { name: 'total', align: 'center', label: $t('total'), field: 'total', sortable: true },
      { name: 'currency_code', align: 'center', label: $t('currency_code'), field: 'currency_code', sortable: true }
    ]) // https://quasar.dev/vue-components/table#example--synchronizing-with-server


    const auth = $store.getters['users/authGetter']
    const authId = Object.fromEntries(Object.entries(auth).filter(([key]) => key.includes('id')));

    const post_id = computed(() => props?.post_id)
    const pending_payments = computed(() => props?.pending_payments)

    watch([post_id, pending_payments], () => onLoad())

    function crud(rowsData) {
      // crudAction(rowsData).then(crud => rows.value = crud)
      crudAction({...rowsData, ...authId}).then(crud => rows.value = crud)
        .catch(e => notifyAction({error: 'reportsAction', e}))
    } watch(period, val => !val||onLoad(val))

    function onLoad(period) {
      if (props.pending_payments) return rows.value = props.pending_payments;
      if (props.post_reports) return rows.value = props.post_reports; crud({
        url: 'api/users/reports',
        method: 'get',
        // reports: true,
        // checkout: true,
        post_id: props?.post_id||0,
        role: auth.role,
        period: period
      })
    } onMounted(() => onLoad (period.value))

    return {
      filter: ref(''),
      loading,
      rows,
      columns,
      height: ref(screen.height / 1.4),
      period,
      range: ref(false),
      auth: auth,

      // date, // 'YYYY-MM-DD',
      proxyDate, // 'YYYY-MM-DD',

      // updateProxy () {
      //   proxyDate.value = date.value
      // }, // TagPeriod: PeriodModule

      save () {
        period.value = null
        crud({
          expandingRow: true,
          url: 'api/users/reports',
          method: 'get',
          // reports: true,
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
        const content = [columns.value.map(col => wrapCsvValue(col.label))].concat(
          rows.value.map(row => columns.value.map(col => wrapCsvValue(
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
        // sortBy: 'desc',
        // descending: false,
        // page: 1,
        // rowsPerPage: 3,
        rowsNumber: 0//10
      }
    }
  }
}
</script>

<style lang="sass">
</style>
