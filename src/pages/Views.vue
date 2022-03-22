<template>
  <div class="q-pa-md">
    <q-table
      :style="'height:' + height + 'px'"
      class="my-sticky-virtscroll-table"
      :title="$t('views')"
      :rows="rows"
      :columns="columns"
      row-key="name"

      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort

      virtual-scroll
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
    ><!-- https://quasar.dev/vue-components/table#example--virtual-scroll-with-sticky-header
      v-model:pagination="pagination"
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
              {label: 'Day', value: '-1 day'},
              {label: 'Week', value: '-1 week'},
              {label: 'Month', value: '-1 month'},
              {label: 'Year', value: '-1 year'}
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
          <q-td key="ip" :props="props">
            <div class="text-pre-wrap">{{ props.row.ip }}</div>
          </q-td>
          <q-td key="city" :props="props">
            <div class="text-pre-wrap">{{ views(props.row, 'city') }}</div>
          </q-td>
          <q-td key="region" :props="props">
            <div class="text-pre-wrap">{{ views(props.row, 'region') }}</div>
          </q-td>
          <q-td key="country" :props="props">
            <div class="text-pre-wrap">{{ views(props.row, 'country') }}</div>
          </q-td>
          <q-td key="slug" :props="props">
            <!-- <div class="text-pre-wrap">{{ views(props.row, 'slug') }}</div> -->
            <q-btn :to="views(props.row, 'slug')"
              :label="views(props.row, 'slug')"
              v-if="views(props.row, 'slug')"
            />
          </q-td>
          <q-td key="pic" :props="props">
            <q-img :src="url+'/'+views(props.row, 'pic')"/>
          </q-td>
          <q-td key="post_title" :props="props">
            <div class="text-pre-wrap">{{ views(props.row, 'post_title') }}</div>
            <!-- <q-btn :to="`/post/${views(props.row, 'id')}`"
              :label="views(props.row, 'post_title')"
              v-if="views(props.row, 'post_title')"
            /> -->
          </q-td>
          <q-td key="first_name" :props="props">
            {{ views(props.row, 'first_name') }}
          </q-td>
          <q-td key="last_name" :props="props">
            {{ views(props.row, 'last_name') }}
          </q-td>
          <q-td key="email" :props="props">
            <div class="text-pre-wrap">{{ views(props.row, 'email') }}</div>
          </q-td>
        </q-tr>
      </template><!-- TagRow -->

    </q-table>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { exportFile, useQuasar, date  } from 'quasar'
// import { useStore, mapGetters } from 'vuex'
import { i18n, url, crudAction, notifyAction } from 'boot/axios'
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
  setup () {
    // const $store = useStore()
    const $q = useQuasar()
    const $t = i18n?.global?.t
    const timeStamp = Date.now()
    const formattedString = date.formatDate(timeStamp, 'YYYY/MM/DD')//YYYY-MM-DDTHH:mm:ss.SSSZ
    const proxyDate = ref(formattedString) //ref({ from: '2020/07/08', to: '2020/07/17' })
    const period = ref('today')
    const rows = ref([])
    const columns = ref([])
    const loading = ref(false)



    function crud(rowsData) {
      crudAction(rowsData).then(crud => rows.value = crud)
        .catch(e => notifyAction({error: 'viewsAction', e}))
    } watch(period, val => !val||onLoad (val))

    function onLoad (period) {
      crud({
        url: 'api/users/1',
        method: 'get',
        views: true,
        period: period
      })
    } onMounted(() => onLoad (period.value))


    return {
      filter:  ref(''),
      loading,
      url,
      rows,
      height: ref(screen.height / 1.4),
      period,
      range: ref(false),

      // date, // 'YYYY-MM-DD',
      proxyDate, // 'YYYY-MM-DD',

      save () {
        period.value = null
        crud({
          expandingRow: true,
          url: 'api/users/1',
          method: 'get',
          views: true,
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

      views (view, name) {
        if (name === 'first_name') try { return view.user.first_name } catch (error) {}
        if (name === 'last_name') try { return view.user.last_name } catch (error) {}
        if (name === 'email') try { return view.user.email } catch (error) {}
        if (name === 'city') try { return view.analytics.city } catch (error) {}
        if (name === 'region') try { return view.analytics.region } catch (error) {}
        if (name === 'country') try { return view.analytics.country } catch (error) {}
        if (name === 'slug') try { return view.slug } catch (error) {}
        if (name === 'pic') try { return view.post.pics[0].pic } catch (error) {return false}
        if (name === 'id') try { return view.post.id } catch (error) {}
        if (name === 'post_title') try { return view.post.post_title } catch (error) {}
      },

      // pagination: {
      //   sortBy: 'desc',
      //   descending: false,
      //   page: 1,
      //   rowsPerPage: 3,
      //   rowsNumber: 10
      // },

      pagination: ref({
        rowsPerPage: 0
      }),

      columns: [ //  https://quasar.dev/vue-components/table#example--synchronizing-with-server
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
      ] // TagRow
    }
  }
}
</script>

<style lang="sass">
</style>
