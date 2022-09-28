<template>

  <q-dialog v-model="editCurrency"><!--======= Add Update Currencies PopUp ============-->
      <q-card class="my-card text-white" style='width:800px'>
        <q-card-section class="bg-primary">
          <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup />
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
              :error="from_data ? true : false"
              :error-message='from_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_from')]"
            /><!-- from -->

            <q-input
              filled
              lazy-rules
              type="text"
              v-model="to"
              maxlength="3"
              :label="$t('to')" class="col-2"
              :error="to_data ? true : false"
              :error-message='to_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_to')]"
            /><!-- to -->

            <q-input
              filled
              type="text"
              v-model="decimal_digits"
              maxlength="1"
              :label="$t('decimal_digits')"
              lazy-rules class="col-4"
              :error="decimal_digits_data ? true : false"
              :error-message='decimal_digits_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_decimal_digits')]"
            /><!-- decimal_digits -->

            <q-input
              filled
              type="text"
              v-model="rate"
              :label="$t('rate')"
              lazy-rules class="col-4"
              :error="rate_data ? true : false"
              :error-message='rate_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_rate')]"
            /><!-- rate -->

            <q-input
              filled
              lazy-rules
              type="text"
              v-model="from_name"
              :label="$t('from_name')" clearable
              :error="from_name_data ? true : false"
              :error-message='from_name_data' class="col-6"
              :rules="[val => val && val.length > 0 || $t('add_from_name')]"
            /><!-- from_name -->

            <q-input
              filled
              lazy-rules
              type="text"
              v-model="to_name"
              :label="$t('to_name')" clearable
              :error="to_name_data ? true : false"
              :error-message='to_name_data' class="col-6"
              :rules="[val => val && val.length > 0 || $t('add_to_name')]"
            /><!-- to_name -->

            <q-input
              filled
              type="text"
              v-model="amount"
              :label="$t('amount')"
              lazy-rules class="col-6"
              :error="amount_data ? true : false"
              :error-message='amount_data' clearable
              :rules="[val => val && val.length > 0 || $t('add_amount')]"
            /><!-- amount -->

            <q-input
              filled
              type="text"
              v-model="result"
              :label="$t('result')"
              lazy-rules class="col-6"
              :error="result_data ? true : false"
              :error-message='result_data' clearable
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
            <q-btn color="primary" round icon="fas fa-sync"
              class="float-right"
              @click.prevent="Edit({})"
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
          <q-td key="from" :props="props">{{ props.row.from }}</q-td>
          <q-td key="to" :props="props">{{ props.row.to }}</q-td>
          <q-td key="from_to" :props="props">{{ props.row.from_to }}</q-td>
          <q-td key="from_name" :props="props">{{ props.row.from_name }}</q-td>
          <q-td key="to_name" :props="props">{{ props.row.to_name }}</q-td>
          <q-td key="decimal_digits" :props="props">{{ props.row.decimal_digits }}</q-td>
          <q-td key="rate" :props="props">{{ props.row.rate }}</q-td>
          <q-td key="amount" :props="props">{{ props.row.amount }}</q-td>
          <q-td key="result" :props="props">{{ props.row.result }}</q-td>
          <template v-if="currenciesData=='currencies'">
            <q-td key="edit" :props="props"><!-- TagEdit: currencyModule -->
              <q-btn icon="edit" rounded class="q-ma-md" @click.prevent="Edit(props.row)"/>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn icon="delete" rounded class="*q-mb-md" @click.prevent="Delete(props.row)"/>
            </q-td><!-- TagDelete: currencyModule -->
          </template>
          <template v-else>
            <q-td key="edit" :props="props"><!-- TagRestore: currencyModule -->
              <q-btn icon="restore" rounded class="q-ma-md" @click="restore(props.row)"/>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn icon="delete_forever" rounded class="*q-mb-md" @click.prevent="delete_forever(props.row)"/>
            </q-td><!-- TagDeleteForever: currencyModule -->
          </template>
        </q-tr>
      </template>

      <template v-slot:top-right class="*row">
        <q-btn-toggle
          v-model="currenciesData"
          push toggle-color="primary"
          glossy class="q-ma-xs col-md-3"
          :options="[
            {label: $t('currencies'), value: 'currencies'},
            {label: $t('duplicated'), value: 'duplicated'},
            {label: $t('trashed'), value: 'trashed'},
          ]"
        /><!-- TagPeriod: PeriodModule -->

        <q-btn icon="add" color="primary" class="q-ma-xs *col-md-1"
          :label="$t('Add Currency')"
          @click="editCurrency=true"
        /><!-- TagAdd: currencyModule -->

        <q-btn icon="fas fa-rotate" color="primary"
          class="q-ma-xs *col-md-1"
          :label="amount*rate/1000" :loading="loader"
          @click="fromAnalytics"
        />
        <!-- <font-awesome-icon icon="fa-sharp fa-solid fa-rotate" /> -->

        <!-- <q-btn icon="fas fa-cut" color="primary" class="q-ma-xs *col-md-1"
          label="Truncate" :loading="loader"
          @click="truncate"
        /> -->

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
// import { useQuasar, copyToClipboard } from 'quasar'
// import { useRouter, useRoute } from 'vue-router'
import {  useStore } from 'vuex'
import { i18n, api, crudAction, notifyAction } from 'boot/axios'

/**
 * Tags:
 *
 * @from UserController
 */
export default {
  setup () {
    const $t = i18n.global.t
    const $store = useStore()

    const loader = ref(false)
    const editCurrency = ref(false)
    const currenciesData = ref('currencies')
    const Currency = ref(null)

    const from = ref('XAU')
    const to = ref(null)
    const from_name = ref('One Troy Ounce Of Gold')
    const to_name = ref(null)
    const decimal_digits = ref(null)
    const rate = ref(null)
    const amount = ref(null)
    const result = computed(() => rate.value*amount.value)

    const token = $store.getters['users/tokenGetter']

    onMounted(() => onload({ currenciesData: 'currencies' }))
    watch(currenciesData, val => onload({ currenciesData: val }))

    function onload(payload) {
      crudAction({ ...payload, ...{
        url: 'api/users/currencies', method: 'get',
      }}).then(users => $store.commit('users/usersMutation', { users }))
        .catch(e => notifyAction({error: 'currenciesAction', e}))
    }

    function Delete (currency) {
      if (token && confirm('Are You Sure You Want To '+(currency.forever?'Delete Forever':'Delete')+' Currency '+ currency.to) === true) crudAction({
          url: `/api/users/${currency.id}`,
          method: 'delete', currency: true
        }).then(() => onload({currenciesData: currenciesData.value}))
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
          rate: Number(rate.value.replace(/[, ]+/g, '').trim()),
          amount: amount.value,
          result: result.value
        }).then(() => onload({ currenciesData: currenciesData.value }))
          .catch(e => notifyAction({error: 'addCurrency', e}))
      }, // TagAdd: currencyModule
      update(currency) {
        console.log('currency', currency)
        // loader.value = true
        crudAction({
          success: 'Currency Updated Successfully',
          url: 'api/users',
          method: 'post',
          from: from.value||currency.from||'',
          to: to.value||currency.to||'',
          decimal_digits: decimal_digits.value||currency.decimal_digits||'',
          rate: Number((rate.value||currency.rate||'').replace(/[, ]+/g, '').trim()),
          amount: amount.value||currency.amount||'',
          result: result.value||currency.result||'',
          from_name: from_name.value||currency.from_name||'',
          to_name: to_name.value||currency.to_name||'',
        }).then(() => onload({ currenciesData: currenciesData.value}))
          .catch(e => notifyAction({error: 'updateCurrency', e}))
      }, // TagUpdate: currencyModule
      Edit (currency) {
        editCurrency.value = true
        from.value = currency.from||''
        to.value = currency.to||''
        decimal_digits.value = currency.decimal_digits||''
        rate.value = currency.rate||''
        from_name.value = currency.from_name||''
        to_name.value = currency.to_name||''
        amount.value = currency.amount||''
        result.value = currency.result||''
        Currency.value = currency
      }, // TagEdit: currencyModule
      Delete, // TagDelete: currencyModule
      delete_forever (currency) { // AddPasswordBeforeDeleteForever
        Delete({...currency, ...{forever: 1}})
      },// TagDeleteForever: currencyModule
      restore (currency) {
        api.post('api/users', {currency_id: currency.id}).then(() => {
          onload({ currenciesData: 'trashed' })
        })
      }, // TagRestore: currencyModule
      fromAnalytics() {
        // if (token && confirm('Are You Sure You Want To Add currencies From Analytics') === true)
        // loader.value = true; else return
        // api.post('api/users', {fromAnalytics: true}).then(() => {
        //   onload({ currenciesData: 'currencies' })
        //   loader.value = false
        // }).catch(e => notifyAction({error: 'fromAnalytics', e}))
      },

      truncate () {
        if (token && confirm('Are You Sure You Want To Truncate currencies') === true)
        loader.value = true; else return
        api.delete('api/users/truncate', {truncate: true}).then(() => {
          onload({ currenciesData: 'currencies' })
          loader.value = false
        }).catch(e => notifyAction({error: 'truncate', e}))
      },

      columns: computed(() => [ // Currency
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
      ]), rows: computed(() => $store.getters['users/usersGetter'])
    }
  }
}
</script>
