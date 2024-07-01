<template>

  <q-dialog v-model="editCurrency"><!--======= Add Update Currencies PopUp ============-->
      <q-card class="my-card text-white" style='width:800px'>
        <q-card-section class="bg-primary">
          <q-btn dense round class="float-right" icon="close" v-close-popup />
          <div class="text-h6">{{Currency?$t('Update Currency'):$t('Add Currency')}}</div>
        </q-card-section>

        <div class="q-pa-sm">

          <div class="row">

            <q-input
              filled
              lazy-rules
              type="text"
              v-model="from"
              maxlength="3"
              :label="$t('from')" class="col-2"
              _:error="from_data ? true : false"
              _:error-message='from_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_from')]"
            /><!-- from -->

            <q-input
              filled
              lazy-rules
              type="text"
              v-model="to"
              maxlength="3"
              :label="$t('to')" class="col-2"
              _:error="to_data ? true : false"
              _:error-message='to_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_to')]"
            /><!-- to -->

            <q-input
              filled
              type="text"
              v-model="decimal_digits"
              maxlength="1"
              :label="$t('decimal_digits')"
              lazy-rules class="col-4"
              _:error="decimal_digits_data ? true : false"
              _:error-message='decimal_digits_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_decimal_digits')]"
            /><!-- decimal_digits -->

            <q-input
              filled
              type="text"
              v-model="rate"
              :label="$t('rate')"
              lazy-rules class="col-4"
              _:error="rate_data ? true : false"
              _:error-message='rate_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_rate')]"
            /><!-- rate -->

            <q-input
              filled
              lazy-rules
              type="text"
              v-model="from_name"
              :label="$t('from_name')" clearable
              _:error="from_name_data ? true : false"
              _:error-message='from_name_data' class="col-6"
              :rules="[val => val && val.length > 0 || $t('add_from_name')]"
            /><!-- from_name -->

            <q-input
              filled
              lazy-rules
              type="text"
              v-model="to_name"
              :label="$t('to_name')" clearable
              _:error="to_name_data ? true : false"
              _:error-message='to_name_data' class="col-6"
              :rules="[val => val && val.length > 0 || $t('add_to_name')]"
            /><!-- to_name -->

            <q-input
              filled
              type="text"
              v-model="amount"
              :label="$t('amount')"
              lazy-rules class="col-6"
              _:error="amount_data ? true : false"
              _:error-message='amount_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_amount')]"
            /><!-- amount -->

            <q-input
              filled
              type="text"
              v-model="result"
              :label="$t('result')"
              lazy-rules class="col-6"
              _:error="result_data ? true : false"
              _:error-message='result_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_result')]"
            /><!--result -->

          </div>

          <div class="q-pa-md">
            <q-btn color="primary" v-if="Currency"
              :label="$t('Update Currency')"
              @click.prevent="update(Currency)"
            /><!-- TagUpdate: currencyModule -->
            <q-btn color="primary" v-else
              :label="$t('Add Currency')"
              @click.prevent="add()"
            /><!-- TagAdd: currencyModule -->
            <q-btn round icon="fas fa-sync"
              color="primary" class="float-right"
              @click.prevent="Edit({ from: '', to: '', decimal_digits: 0, rate: 0, from_name: '', to_name: '', amount: 0, result: 0 })"
            />
          </div>

        </div><!-- TagEdit: currencyModule -->

      </q-card><!-- TagAdd - TagEdit: currencyModule -->
  </q-dialog><!--============================= Add Update Currencies PopUp End ========-->

  <div class="q-pa-md">
    <q-table
      :style="'height:' + height + 'px'"
      class="my-sticky-virtscroll-table"
      ref="table"
      :title="$t('currencies_list')"
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
          <q-td key="from" :props="props">{{ props.row.from }}</q-td>
          <q-td key="to" :props="props">{{ props.row.to }}</q-td>
          <q-td key="from_to" :props="props">{{ props.row.from_to }}</q-td>
          <q-td key="from_name" :props="props">{{ props.row.from_name }}</q-td>
          <q-td key="to_name" :props="props">{{ props.row.to_name }}</q-td>
          <q-td key="decimal_digits" :props="props">{{ props.row.decimal_digits }}</q-td>
          <q-td key="rate" :props="props">{{ props.row.rate }}</q-td>
          <q-td key="amount" :props="props">{{ props.row.amount }}</q-td>
          <q-td key="result" :props="props">{{ props.row.result }}</q-td>
          <template v-if="currenciesData==='currencies'||currenciesData==='cyDuplicated'">
            <q-td key="edit" :props="props"><!-- TagEdit: currencyModule -->
              <q-btn icon="edit" rounded class="q-ma-md" @click.prevent="Edit(props.row)"/>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn icon="delete" rounded @click.prevent="Delete(props.row)"/>
            </q-td><!-- TagDelete: currencyModule -->
          </template>
          <template v-else>
            <q-td key="edit" :props="props"><!-- TagRestore: currencyModule -->
              <q-btn icon="restore" rounded class="q-ma-md" @click="restore(props.row)"/>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn icon="delete_forever" rounded @click.prevent="delete_forever(props.row)"/>
            </q-td><!-- TagDeleteForever: currencyModule -->
          </template>
        </q-tr>
      </template>

      <template v-slot:top-right>
        <q-btn-toggle
          v-model="currenciesData"
          push toggle-color="primary"
          glossy class="q-ma-xs col-md-3"
          :options="[
            {label: $t('currencies'), value: 'currencies'},
            {label: $t('duplicated'), value: 'cyDuplicated'},
            {label: $t('Trash'), value: 'cyTrashed'},
          ]"
        /><!-- TagPeriod: PeriodModule -->

        <q-btn icon="add" class="bg-primary q-ma-xs *col-md-1"
          :label="$t('Add Currency')"
          @click="editCurrency=true"
        /><!-- TagAdd: currencyModule -->

        <q-btn icon="fas fa-rotate" color="primary"
          class="q-ma-xs"
          :label="amount*rate/1000" :loading="loader"
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
import { Param } from 'components/models'

/**
 * Tags:
 *
 * @to UserController
 */
export default {
  setup () {
    const $t = i18n.global.t
    const store = useCrudStore()
    const { crudAction, notifyAction } = store

    const loader = ref(false)
    const editCurrency = ref(false)
    const currenciesData = ref('currencies')
    const Currency = ref<any>({})

    const from = ref('XAU')
    const to = ref('')
    const from_name = ref('One Troy Ounce Of Gold')
    const to_name = ref('')
    const decimal_digits = ref(0)
    const rate = ref(0)
    const amount = ref(0)

    const result = ref(rate.value * amount.value)
    // const result = computed(() => rate.value * amount.value)
    const auth = computed(() => store.authGetter)

    onMounted(() => currenciesAction({ currenciesData: 'currencies' }))
    watch(currenciesData, val => currenciesAction({ currenciesData: val }))

    function currenciesAction(payload: Partial<Param>) {
      crudAction({ ...payload,
        url: 'api/users/currencies',
        method: 'get', mutate: currenciesData.value
      }).catch((e: unknown) => notifyAction({error: 'currenciesAction', e}))
    }

    function Delete (currency: { forever: boolean; to: string; id: number }) {
      if (auth.value && confirm('Are You Sure You Want To '+(currency.forever?'Delete Forever':'Delete')+' Currency '+ currency.to) === true)
      api({
        url: `/api/users/${currency.id}`,
        method: 'delete', data: { currency: true }
      }).then(() => currenciesAction({currenciesData: currenciesData.value}))
        .catch(e => notifyAction({error: 'deleteAction', e}))
    } // TagDelete: currencyModule

    return {
      // ipDebug,
      // desktop: $q.platform.is.desktop,
      height: screen.height / 1.4,
      editCurrency,
      currenciesData,
      Currency,

      loader,
      filter: ref(''),

      from,
      to,
      from_name,
      to_name,
      decimal_digits,
      rate,
      amount,
      result,

      pagination: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 0,
        rowsNumber: 10
      },

      add() {
        // console.log('currency', currency)
        // loader.value = true
        crudAction({
          success: 'Currency Added Successfully',
          url: 'api/users',
          method: 'post',
          from: from.value,
          to: to.value,
          from_name: from_name.value,
          to_name: to_name.value,
          decimal_digits: decimal_digits.value,
          rate: rate.value,
          // rate: Number(rate.value.replace(/[, ]+/g, '').trim()),
          amount: amount.value, result: result.value,
          refresh: ['reloadApp']
        })//.then(() => mSession(['reloadApp']))
          .then(() => currenciesAction({ currenciesData: currenciesData.value }))
          .catch((e: unknown) => notifyAction({error: 'addCurrency', e}))
      }, // TagAdd: currencyModule
      update(currency: { from: string; to: string; decimal_digits: number; rate: number; amount: number; result: number; from_name: string; to_name: string } | null) {
        // console.log('currency', currency)
        // loader.value = true
        crudAction({
          success: 'Currency Updated Successfully',
          url: 'api/users/xRate',
          method: 'put',
          from: from.value||currency?.from||'',
          to: to.value||currency?.to||'',
          decimal_digits: decimal_digits.value||currency?.decimal_digits||'',
          rate: Number((rate.value||currency?.rate||0)/* .replace(/[, ]+/g, '').trim() */),
          amount: amount.value||currency?.amount||0,
          result: result.value||currency?.result||0,
          from_name: from_name.value||currency?.from_name||'',
          to_name: to_name.value||currency?.to_name||'',
          refresh: ['reloadApp']
        })//.then(() => mSession(['reloadApp']))
          .then(() => currenciesAction({ currenciesData: currenciesData.value}))
          .catch((e: unknown) => notifyAction({error: 'updateCurrency', e}))
      }, // TagUpdate: currencyModule
      Edit(currency: { from: string; to?: string; decimal_digits?: number; rate?: number; from_name?: string; to_name?: string; amount?: number; result: number } | null) {
        editCurrency.value = true
        from.value = currency?.from||''
        to.value = currency?.to||''
        decimal_digits.value = currency?.decimal_digits||0
        rate.value = currency?.rate||0
        from_name.value = currency?.from_name||''
        to_name.value = currency?.to_name||''
        amount.value = currency?.amount||0
        result.value = currency?.result||0
        Currency.value = currency
      }, // TagEdit: currencyModule
      Delete, // TagDelete: currencyModule
      delete_forever (currency: { forever: boolean; to: string; id: number }) {
        Delete({...currency, forever: true}) // AddPasswordBeforeDeleteForever
      },// TagDeleteForever: currencyModule
      restore(currency: { id: number }) {
        api.post('api/users', {currency_id: currency.id}).then(() => {
          mSession(['reloadApp'])
          currenciesAction({ currenciesData: 'cyTrashed' })
        }).catch(e => notifyAction({error: 'restoreCurrency', e}))
      }, // TagRestore: currencyModule
      fromAnalytics() {
        // if (auth.value && confirm('Are You Sure You Want To Add currencies From Analytics') === true)
        // loader.value = true; else return
        // api.post('api/users', {fromAnalytics: true}).then(() => {
        //   currenciesAction({ currenciesData: 'currencies' })
        //   loader.value = false
        // }).catch(e => notifyAction({error: 'fromAnalytics', e}))
      },

      truncate () {
        if (auth.value && confirm('Are You Sure You Want To Truncate currencies') === true)
        loader.value = true; else return
        // api.delete('api/users/truncate', {truncate: true}).then(() => {
        api.delete('api/users/truncate?truncate=true').then(() => {
          mSession(['reloadApp'])
          currenciesAction({ currenciesData: 'currencies' })
          loader.value = false
        }).catch(e => notifyAction({error: 'truncate', e}))
      },

      columns: <any> computed(() => [ // Currency
        { name: 'id', align: 'center', label: $t('ID'), field: 'id', sortable: true },
        { name: 'from', align: 'center', label: $t('from'), field: 'from', sortable: true },
        { name: 'to', align: 'center', label: $t('to'), field: 'to', sortable: true },
        { name: 'from_to', align: 'center', label: $t('from_to'), field: 'from_to', sortable: true },
        { name: 'from_name', align: 'center', label: $t('from_name'), field: 'from_name', sortable: true },
        { name: 'to_name', align: 'center', label: $t('to_name'), field: 'to_name', sortable: true },
        { name: 'decimal_digits', align: 'center', label: $t('decimal_digits'), field: 'decimal_digits', sortable: true },
        { name: 'rate', align: 'center', label: $t('rate'), field: 'rate', sortable: true },
        { name: 'amount', align: 'center', label: $t('amount'), field: 'amount', sortable: true },
        { name: 'result', align: 'center', label: $t('result'), field: 'result', sortable: true },
        { name: 'edit', align: 'center', label: $t('edit/restore'), field: 'edit', sortable: false },
        { name: 'delete', align: 'center', label: $t('delete/foreve'), field: 'delete', sortable: false }
      ]), rows: computed(() => store[currenciesData.value]||[])
    }
  }
}
</script>(: any)(: any): { from: any; to: any; decimal_digits: any; rate: any; amount: any; result: any; from_name: any; to_name: any } | null(: any)(: string | any[])(: string | any[])(: string | any[])(: string | any[])(: string | any[])(: string | any[])(: string | any[])(: string | any[])
