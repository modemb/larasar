<template>
  <div class="q-pa-md">
    <!--============ Data Table ========================-->
    <q-table
      :style="`height: ${height}px`"
      class="my-sticky-virtscroll-table"
      ref="table"
      :title="`${$t('Analytics')} ${total}`"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :loading="loading"
      :filter="filter"
      binary-state-sort

      virtual-scroll
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :pagination="pagination"
      @virtual-scroll="onScroll"
    >
    <!--
      :rows-per-page-options="[total]"
      v-model:pagination="pagination"
      @request="onRequest"
    -->

      <template v-slot:top-right>
          <q-btn
            color="primary"
            icon-right="archive"
            :label="$t('export_to_csv')"
            no-caps
            @click="exportTable"
          /><!-- TagExport: UserModule -->
          <q-btn color="primary" class="q-ma-xs" icon="event" :label="JSON.stringify(proxyDate)">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="proxyDate" :range="range" ><!-- :setToday="!range" -->
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-toggle v-model="range" label="Range" />
                  <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy><!-- @before-show="updateProxy" -->
          </q-btn><!-- TagPeriod: PeriodModule -->
          <q-btn-toggle
            v-model="period"
            push glossy
            toggle-color="primary"
            :options="[
              {icon: 'fas fa-sync', value: 'today'},
              {label: $t('Day'), value: '-1 day'},
              {label: $t('Week'), value: '-1 week'},
              {label: $t('Month'), value: '-1 month'},
              {label: $t('Year'), value: '-1 year'}
            ]"
          /><!-- TagPeriod: PeriodModule -->
          <q-btn icon="fas fa-print"
            color="primary"
            @click="printEl('table')"
          /><!-- TagPrint: UserModule -->
          <q-toggle class="q-ma-xs col-md-3" v-model="expend" left-label label="Expend" />
          <q-input clearable class="q-ma-xs col-md-3" borderless dense debounce="300" v-model="filter" :placeholder="$t('search')">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
      </template>

      <template v-slot:header="props" v-if="expend">
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

      <template v-slot:body="props" v-if="expend">
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
            <!-- <div v-for="(session, i) in props.row.sessions
              .filter((s: { user_id: number }) => s.user_id === props.row.user_id)
              .sort((a: { last_activity: number }, b: { last_activity: number }) => b.last_activity - a.last_activity)" :key="i">
              <div class="text-h6">
                <i class="far fa-clock"/> {{timeago(new Date(session.last_activity * 1000))}}
                <i class="fab fa-chrome"/> {{session.user_agent}}
              </div>
            </div>TagSession: SessionModule --><!-- props: ['sessions'] https://laravel.com/docs/9.x/authentication#invalidating-sessions-on-other-devices -->

            <div v-for="(session, i) in sessions(props.row)"  :key="i">
              <div class="text-h6">
                <i class="far fa-clock"/> {{timeago(new Date(session.last_activity * 1000))}}
                <i class="fab fa-chrome"/> {{session.user_agent}}
              </div>
            </div><!-- TagSession: SessionModule -->

          </q-td>
        </q-tr>
      </template><!-- ExpandingRowModule period==='today'-->

    </q-table><!--=== Data Table End ====-->
  </div>
</template>

<script lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { exportFile, useQuasar, date } from 'quasar'
import { i18n, timeago } from 'boot/axios'
import { useCrudStore } from 'stores/crud'
import { printEl } from 'components/Functions'
import { Param } from 'components/models'

/**
 * Tags: PeriodModule - ExpandingRowModule - SessionModule
 *
 * @to
 */

function wrapCsvValue (val: string, formatFn: ((arg0: any) => any) | undefined) {
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

// function wrapCsvValue (val, formatFn, row) {
//   let formatted = formatFn !== void 0
//     ? formatFn(val, row)
//     : val

//   formatted = formatted === void 0 || formatted === null
//     ? ''
//     : String(formatted)

//   formatted = formatted.split('"').join('""')
//   /**
//    * Excel accepts \n and \r in strings, but some other CSV parsers do not
//    * Uncomment the next two lines to escape new lines
//    */
//   // .split('\n').join('\\n')
//   // .split('\r').join('\\r')

//   return `"${formatted}"`
// }

export default {
  // props: ['sessions'],
  setup () {
    const $t = i18n.global.t
    const $q = useQuasar()
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const timeStamp = Date.now()
    const formattedString = date.formatDate(timeStamp, 'YYYY/MM/DD')//YYYY-MM-DDTHH:mm:ss.SSSZ
    const proxyDate = ref<any>(formattedString) //ref({ from: '2020/07/08', to: '2020/07/17' })
    const period = ref('today')
    const loading = ref(false)
    const filter = ref('')
    const crud = ref()

    const columns = <any> ref( [
      { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
      { name: 'ip', align: 'center', label: 'IP', field: 'ip', sortable: true },
      { name: 'app', align: 'center', label: $t('app'), field: 'app', sortable: true },
      { name: 'session', align: 'center', label: $t('session'), field: 'session', sortable: true },
      { name: 'city', align: 'center', label: $t('city'), field: 'city', sortable: true },
      { name: 'region', align: 'center', label: $t('region'), field: 'region', sortable: true },
      { name: 'country', align: 'center', label: $t('country'), field: 'country', sortable: true },
      { name: 'currency', align: 'center', label: $t('currency'), field: 'currency', sortable: true },
      { name: 'currency_name', align: 'center', label: $t('currency_name'), field: 'currency_name', sortable: true },
      { name: 'latitude', align: 'center', label: $t('latitude'), field: 'latitude', sortable: true },
      { name: 'longitude', align: 'center', label: $t('longitude'), field: 'longitude', sortable: true },
      { name: 'utc_offset', align: 'center', label: $t('utc_offset'), field: 'utc_offset', sortable: true },
      { name: 'first_name', align: 'center', label: $t('first_name'), field: 'first_name', sortable: true },
      { name: 'last_name', align: 'center', label: $t('last_name'), field: 'last_name', sortable: true },
      { name: 'email', align: 'center', label: $t('email'), field: 'email', sortable: true },
      { name: 'status', align: 'center', label: $t('status'), field: 'status', sortable: true },
      { name: 'role', align: 'center', label: $t('role'), field: 'role', sortable: true },
      { name: 'email_verified_at', align: 'center', label: $t('email_verified_at'), field: 'email_verified_at', sortable: true },
      { name: 'updated_at', align: 'center', label: $t('updated_at'), field: 'updated_at', sortable: true },
      { name: 'created_at', align: 'center', label: $t('created_at'), field: 'created_at', sortable: true },
    ])//; const d = (d: string | number | Date | undefined) => new Date(date.formatDate(d, 'YYYY-MM-DD')).getTime()

    const getter = computed(() => 'analyticsGetter'+period.value)
    const TO = computed(() => crud.value?.to)
    const total = computed(() => store[getter.value]?.total)
    const reload = computed(() => store.reloadGetter?.reload)
    const last_page = computed(() => store[getter.value]?.last_page)
    const rows = computed(() => store[getter.value]?.data||[])
    // ?.filter((a: { updated_at: Date }) =>
    //   d(a.updated_at) >= d(dateTimePeriod(period.value)) &&
    //   d(a.updated_at) <= d(dateTimePeriod('0 day')) ||
    //   d(a.updated_at) >= d(proxyDate.value?.from) &&
    //   d(a.updated_at) <= d(proxyDate.value?.to) ||
    //   d(a.updated_at) === d(proxyDate.value)
    // ))

    const pagination = ref({
      // sortBy: 'desc',
      // descending: false,
      page: 1, // Page Link
      rowsPerPage: 0, // Pagination Number
      rowsNumber: total.value // Rows Number Per Page
    })

    function dateTimePeriod(period: string) {
      if (period==='today') period = '0 day'
      if (period==='-1 week') period = '-7 day'
      if (!period) return
      const p = period.split(' ')
      const d = date.addToDate(Date(), { [p[1]]: p[0] })
      return date.formatDate(d, 'YYYY-MM-DD H:mm:ss')
    } // Date Time Like SQL From Period

    function analyticsAction(params: Partial<Param>) {
      crudAction({ ...params,
        url: 'api/users/analytics',
        method: 'get',
        period: period.value,
        page: pagination.value.page,
        perPage: pagination.value.rowsPerPage,
        mutate: getter.value, timeout: 1000
      }).then((CRUD: unknown) => crud.value = CRUD)
         .catch((e: unknown) => notifyAction({error: 'analyticsAction', e}))
    } watch([period, reload], () => analyticsAction({}))

    const flt: string[] = []
    watch(filter, val => {
      pagination.value.page = 1
      flt.includes(val) || analyticsAction({
        filterAnalytics: val, load: true
      });flt.push(val)
    }) // TagFiler: SearchModule

    onMounted(() => analyticsAction({}))

    return {
      period,
      loading,
      timeago,
      total,
      filter, //: ref(''),
      range: ref(false),
      expend: ref(false),
      proxyDate, // 'YYYY-MM-DD',
      height: ref(screen.height / 1.4),

      sessions(a: { filter: (arg0: (s: { user_id: number }) => boolean) => {
        user_agent: any; last_activity: number
      }[]; user_id: number }) {

        return a.filter((s: { user_id: number }) => s.user_id === a.user_id)
         .sort((a: { last_activity: number }, b: { last_activity: number }) => b.last_activity - a.last_activity)
      },

      save () {
        period.value = ''
        analyticsAction({
          expandingRow: true,
          refresh: [getter.value],
          from: proxyDate.value.from,
          to: proxyDate.value.to,
          proxyDate: proxyDate.value
        })
      }, // TagPeriod: PeriodModule

      fNum (x: number) {
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
        const content = [columns.value.map((col: { label: string }) => wrapCsvValue(col.label))].concat(
          rows.value.map((row: { [x: string]: any }) => columns.value.map((col: {
              field: ((arg0: {
                [
                /* __placeholder__ */
                x:
                  /* __placeholder__ */
                  string
                /* __placeholder__ */
                ]:
                /* __placeholder__ */
                any
              }) => string) | undefined; name: any; format: ((
                /* __placeholder__ */
                arg0:
                  /* __placeholder__ */
                  any
                /* __placeholder__ */
              ) =>
                /* __placeholder__ */
                any) | undefined
            }) => wrapCsvValue(
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

      // print(el: string) {

      //   // let w = null; // windowObjectReference | global variable

      //   // if (w.closed) w = window.open()//;url, windowName w === null ||
      //   // else w.focus() // https://developer.mozilla.org/en-US/docs/Web/API/Window/open

      //   // const link = document.querySelector("a[target='OpenWikipediaWindow']");
      //   // link.addEventListener('click', (event) => {
      //   //   openRequestedTab(link.href);
      //   //   event.preventDefault();
      //   //   }, false);

      //   const w = window.open();
      //   // const w = window.open('', 'PRINT', 'height=800,width=1000');

      //   w.document.write('<html><head><title>' + document.title  + '</title>')
      //   w.document.write('</head><body>')
      //   w.document.write('<h1>' + document.title  + '</h1>')
      //   w.document.write(document.getElementById(el).innerHTML)
      //   w.document.write('</body></html>')

      //   w.document.close(); // necessary for IE >= 10
      //   w.focus(); // necessary for IE >= 10*/

      //   w.print(); // w.close();

      //   return true;
      // },

      printEl,

      onScroll ({ to, ref }: any ) {
        const lastIndex = rows.value?.length-1
        const lastPage = last_page.value
        const page = pagination.value.page

        // pagination.value.rowsNumber = total.value

        // if (loading.value !== true && nextPage.value < lastPage && to === lastIndex) { //

        if (loading.value !== true && page < lastPage && to === lastIndex) {
          loading.value = true; //&& (to > 0)

          setTimeout(() => {
            pagination.value.page++
            analyticsAction({ load: true })
            nextTick(() => {
              ref.refresh()
              loading.value = false
            })
          }, 500)
          console.log(
            // 'nextPage', nextPage.value, '<','lastPage', lastPage,
            // 'to', to, '===', 'rowsNumber', pagination.value.rowsNumber,
            'page', pagination.value.page, '<', 'lastPage', lastPage,
            'to', to,'===', lastIndex, 'lastIndex', '>', 0,
            'total', total.value, 'TO', TO.value

            // 'ref', ref,
            // 'rows', rows.value
          )
        }
      }, pagination, columns, rows,

    }
  }
}
</script>
