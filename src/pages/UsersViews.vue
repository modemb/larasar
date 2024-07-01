<template>
  <div class="q-pa-md">
    <q-table flat bordered
      :style="`height: ${height}px`"
      class="my-sticky-virtscroll-table *my-sticky-dynamic"
      :title="`${$t('views')} ${total}`"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      row-key="name"
      binary-state-sort

      virtual-scroll
      :virtual-scroll-item-size="/*96*/48"
      :virtual-scroll-sticky-size-start="/*96*/48"
      v-model:pagination="pagination"
      @virtual-scroll="onScroll"
    ><!-- Dynamic loading virtual scroll
      @request="onRequest"
      :rows-per-page-options="[0]"
     -->

      <template v-slot:top-right>
          <q-btn
            color="primary"
            icon-right="archive"
            :label="$t('export_to_csv')"
            no-caps
            @click="exportTable"
          /><!-- TagExport: UserModule -->

          <!-- <q-btn icon="event" color="primary" class="q-ma-xs" :label="date">
            <q-popup-proxy @before-show="updateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="proxyDate" setToday>
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>TagPeriod: PeriodModule -->

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
          <q-input clearable class="q-ma-xs col-md-3" borderless dense debounce="300" v-model="filter" :placeholder="$t('search')">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">{{ props.row.id }}</q-td>
          <q-td key="ip" :props="props">
            <div class="text-pre-wrap">{{ props.row.ip }}</div>
          </q-td>
          <q-td key="city" :props="props">
            <div class="text-pre-wrap">{{ props.row?.city }}</div>
          </q-td>
          <q-td key="region" :props="props">
            <div class="text-pre-wrap">{{ props.row?.region }}</div>
          </q-td>
          <q-td key="country" :props="props">
            <div class="text-pre-wrap">{{ props.row?.country }}</div>
          </q-td>
          <q-td key="slug" :props="props">
            <q-btn color="primary"
              :to="props.row?.slug"
              :label="props.row?.slug"
              v-if="props.row?.slug"
            />
          </q-td>
          <q-td key="pic" :props="props">
            <q-img :src="baseURL+'/'+props.row?.post?.pics?.[0]?.pic"/>
          </q-td>
          <q-td key="post_title" :props="props">
            <div class="text-pre-wrap">{{ props.row?.post?.post_title }}</div>
          </q-td>
          <q-td key="first_name" :props="props">
            {{ props.row?.user?.first_name }}
          </q-td>
          <q-td key="last_name" :props="props">
            {{ props.row?.user?.last_name }}
          </q-td>
          <q-td key="email" :props="props">
            <div class="text-pre-wrap">{{ props.row?.user?.email }}</div>
          </q-td>
        </q-tr>
      </template><!-- TagRow -->

    </q-table><!-- https://quasar.dev/vue-components/table#example--dynamic-loading-virtual-scroll -->
  </div>
</template>

<script lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { exportFile, useQuasar, date } from 'quasar'
import { i18n, baseURL } from 'boot/axios'
import { useCrudStore } from 'stores/crud'
import { Param } from 'components/models'

function wrapCsvValue (val: any, formatFn: ((arg0: any, arg1: any) => any) | undefined, row: {
    [
    /* __placeholder__ */
    x:
      /* __placeholder__ */
      string
    /* __placeholder__ */
    ]:
    /* __placeholder__ */
    any
  } | undefined) {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
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
  setup () {
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const $t = i18n?.global?.t
    const $q = useQuasar()
    const timeStamp = Date.now()
    const formattedString = date.formatDate(timeStamp, 'YYYY/MM/DD')//YYYY-MM-DDTHH:mm:ss.SSSZ
    const proxyDate = ref<any>(formattedString) //ref({ from: '2020/07/08', to: '2020/07/17' })
    const period = ref('today')
    const filter = ref('')
    const columns = ref<any>([ // https://quasar.dev/vue-components/table#example--synchronizing-with-server
      { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
      { name: 'ip', align: 'center', label: $t('ip'), field: 'ip', sortable: true },
      { name: 'city', align: 'center', label: $t('city'), field: 'city', sortable: true },
      { name: 'region', align: 'center', label: $t('region'), field: 'region', sortable: true },
      { name: 'country', align: 'center', label: $t('country'), field: 'country', sortable: true },
      { name: 'slug', align: 'center', label: $t('slug'), field: 'slug', sortable: true },
      { name: 'pic', align: 'center', label: $t('pic'), field: 'pic', sortable: true },
      { name: 'post_title', align: 'left', label: $t('post_title'), field: 'post_title', sortable: true },
      { name: 'first_name', align: 'center', label: $t('first_name'), field: 'first_name', sortable: true },
      { name: 'last_name', align: 'center', label: $t('last_name'), field: 'last_name', sortable: true },
      { name: 'email', align: 'center', label: $t('email'), field: 'email', sortable: true },
    ]); const loading = ref(false)

    const getter = computed(() => 'viewsGetter'+period.value)
    const last_page = computed(() => store[getter.value]?.last_page)
    const reload = computed(() => store.reloadGetter?.reload)
    const total = computed(() => store[getter.value]?.total)
    const rows = computed(() => store[getter.value]?.data||[])

    const pagination = ref({
      sortBy: 'desc',
      // descending: false,
      page: 1, // Page Link
      rowsPerPage: 0, // Pagination Number
      rowsNumber: total.value // Rows Number Per Page
    })

    const nextPage = ref(2)
    // const pageSize = 50
    // const lastPage = Math.ceil(rows.value?.length / pageSize)

    onMounted(() => viewsAction({}))

    watch([period, reload], () => {
      pagination.value.page = 1
      viewsAction({})
    }); const flt: string[] = []
    watch(filter, val => {
      pagination.value.page = 1
      flt.includes(val) || viewsAction({
        filterViews: val, load: true,
      });flt.push(val)
    })

    function viewsAction(params: Partial<Param>) {
      console.log('getter', getter.value)
      return crudAction({...params,
        url: 'api/users/views',
        method: 'get',
        period: period.value,
        page: pagination.value.page,
        perPage: pagination.value.rowsPerPage,
        mutate: getter.value, timeout: 1000
      }).catch((e: unknown) => notifyAction({error: 'viewsAction', e}))
    }

    return {
      filter,
      loading,
      baseURL,
      rows, columns, total,
      height: ref(screen.height / 1.4),
      period, range: ref(false),

      // date, // 'YYYY-MM-DD',
      proxyDate, // 'YYYY-MM-DD',

      save () {
        period.value = ''
        viewsAction({
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
        const content = [columns.value.map((col: { label: any }) => wrapCsvValue(col.label))].concat(
          rows.value.map((row: { [x: string]: any }) => columns.value.map((col: { field: ((arg0: { [x: string]: any }) => any) | undefined; name: any; format: any }) => wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[ col.field === void 0 ? col.name : col.field ],
            col.format,
            row
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

      pagination,

      // pagination: {
      //   sortBy: 'desc',
      //   descending: false,
      //   page: 1,
      //   rowsPerPage: 3,
      //   rowsNumber: 10
      // },

      onScroll ({ to, ref }: any) {
        const lastIndex = rows.value?.length - 1
        const lastPage = last_page.value
        const page = pagination.value.page

        // if (loading.value !== true && nextPage.value < lastPage && to === lastIndex) { && to > 0

        if (loading.value !== true && page < lastPage && to === lastIndex) {
          loading.value = true;

          setTimeout(() => {
            pagination.value.page++
            viewsAction({ load: true })
            nextTick(() => {
              ref.refresh()
              loading.value = false
            })
          }, 500)
        }
          console.log(
            'page', page, '<', 'lastPage', lastPage,
            'to', to,'===', lastIndex, 'lastIndex', '>', 0,
            'total', total.value
          )

      }

    }
  }
}
</script>

<style lang="sass">
.my-sticky-dynamic
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #00b4ff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>: string: ((arg0: any, arg1: any) => any) | undefined: undefined
