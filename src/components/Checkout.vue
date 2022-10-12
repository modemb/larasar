<template>
  <q-dialog v-model="checkout"><!--========== Receipt PopUp ============-->
    <q-card class="my-card text-black">
      <q-card-section class="bg-primary text-white">
        <!-- <q-btn dense flat icon="close" class="float-right" v-close-popup /> -->
        <q-btn color="primary" text-color="white" class="float-right" dense round icon="close" v-close-popup />
        <div class="text-h6">{{$t('checkout')}}</div>
      </q-card-section>
      <Reports :post_id="post_id" />
    </q-card>
  </q-dialog><!--=========================== Receipt PopUp End ========-->

  <div class="*q-ma-md row">

      <div :class="profile?'col-11':'col-md-6'">

        <div class="q-gutter-md">
          <q-select
            filled
            v-model="currency"
            clearable
            fill-input
            use-input
            hide-selected
            transition-show="*flip-up"
            transition-hide="*flip-down"
            behavior="*dialog"
            input-debounce="0"
            @filter="filterFn"
            @filter-abort="abortFilterFn"
            :options="currencies"
            :disable="!(profile||ipDebug)"
            :label="Currencies[currency]?.name"
            :hint="$t(advance?'Advanced Filter':'Filter')"
            style="width: 100%; padding-bottom: 32px"
          ><!-- https://quasar.dev/vue-components/select#example--basic-filtering -->
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t('No results') }}
                </q-item-section>
              </q-item>
            </template>
            <!--<q-btn :color="advance?'negative':'grey'"
              @click="advance=!advance"
              icon="fas fa-search"
            /> TagAdvanceSearch: CurrencyModule -->
          </q-select><!-- use-input hide-selected -->
        </div><!-- TagSelectCurrency: CurrencyModule -->

        <q-btn flat :label="cy(xGain=xRate(auth?.gain))" v-if="!profile"><!-- FixGain -->
          <i class="fa-solid fa-minus q-ma-md" />{{ cy(xPayment=xRate(payload?.payment)) }}
          <i class="fa-solid fa-equals q-ma-md">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
              {{$t('Earned Money')}}
            </q-tooltip>
            <q-btn color="negative" flat @click="checkout=true"
              :label="cy((xGain<xPayment)?0:(xGain-xPayment))"
            /><q-icon name='fas fa-long-arrow-alt-right'/>
          </i>{{total=cy((diff=(xPayment>xGain)?(xPayment-xGain):0)||xPayment)}}
        </q-btn><!-- TagPaymentInfo: GainPaymentPostModule -->

      </div>

      <q-card class="col-md-6" v-if="!profile">
        <q-card-section id="card-element" />
        <div class="q-ma-md">{{$t('credit_card')}}</div>
        <q-btn color="primary" class="q-ma-md"
          icon="fa-solid fa-credit-card"
          :disabled="loader||!diff" @click="stripe"
          :label="loader ? $t('Processing') : $t('Pay Now')"
        /><!-- TagStripe: PaymentPostModule -->
        <q-btn color="primary" class="q-ma-md"
          :icon="diff?'fab fa-paypal':'fas fa-cent-sign'"
          :disabled="loader" :loading="loader"
          :label="$t(apiLinks?.[1]?.rel??(diff?'paypal':'Earned Money'))"
          @click.prevent="paypal(apiLinks?.[1]?.href)"
        /><!-- TagPaymentCreate: PayPalPostModule -->{{total}}<!-- FixGain -->
      </q-card><!-- TagPayment: PaymentPostModule -->

      <span v-if="false"><!-- TagPaymentCheckout: GainPaymentPostModule -->

        <div v-if="false">
          <q-btn color="primary" class="q-ma-md"
            v-for="(link, key) in apiLinks" :key="key"
            type="a" icon="fab fa-paypal"
            :href="link.href"
            :loading="loader"
            :label="$t(link.rel)"
          /><!-- TagPayment: LinkPaymentPostModule -->
          <q-btn flat round icon="fas fa-question">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
              {{JSON.stringify(apiLinks)}}
            </q-tooltip>
          </q-btn>
        </div><!-- TagImplementTestPayment: PaymentPostModule -->

        <div v-if="false" class="row">
          <q-btn color="primary"
            v-for="(link, key) in links" :key="key"
            :label="link.rel" type="a"
            icon="fab fa-paypal"
            :loading="loader"
            class="*col-md-2 q-ma-md"
            @click.prevent="linkTest(link)"
          /><!-- TagPayment: LinkPaymentPostModule -->
          <q-btn flat round icon="fas fa-question" v-if="links">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
              {{JSON.stringify(links)}}
            </q-tooltip>
          </q-btn>
          <q-btn color="primary"
            v-for="(link, key) in links" :key="key"
            target="_blank" type="a"
            :href="link.href"
            icon="fab fa-paypal"
            :loading="loader"
            :label="link.rel"
            class="*col-md-2 q-ma-md"
          />
        </div><!-- TagLinksPayment: PaymentPostModule -->

        <q-btn color="primary"
          class="q-ma-md"
          label="CreditCard" v-if="false"
          icon="fa-solid fa-credit-card"
          @click.prevent="creditCard()"
        /><!-- TagCreditCard: PaymentPostModule -->

      </span><!-- TagLinks: LinkPaymentPostModule PayPal -->

  </div><!-- TagPaymentCheckout: PaymentPostModule https://quasar.dev/vue-components/button-toggle#Example--Some-design-examples -->
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import {  useStore } from 'vuex'
// import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { cy, i18n, xRate, crudAction, notifyAction } from 'boot/axios'
import { loadStripe } from '@stripe/stripe-js'
import Currencies from './json/Currencies'
import Reports from './Reports'

/**
 * Tags: TagPayment - TagCheckout - TagActivePlan - TagImplementTestPayment - TagCreditCard
 *       LinkPaymentPostModule - FavoriteModule - PaymentPostModule
 *
 * @from CategoryController
 */
export default {
  components: {
    Reports
  },
  props: ['payload', 'profile', 'user'],
  setup (props, { emit }) {
    const $t = i18n.global.t
    const $store = useStore()
    // const $route = useRoute()
    // const $router = useRouter()
    const $q = useQuasar()
    const post_id = ref(true)
    const apiLinks = ref(false)
    // === TagPayment ====== \\
    const diff = ref(0)
    const loader = ref(false)
    const stripe = ref({})
    const cardElement = ref(null)
    const currencies = ref([])
    // const currency = ref(props.user?.currency_code)
    const currency = ref(props.user?.currency_code||props.payload?.currency_code)

    const auth = computed(() => props.user||$store.getters['users/authGetter'])
    const getCurrencies = computed(() => $store.getters['users/usersGetter'])

    const decimal = Currencies[currency.value]?.decimal_digits
    const digits = decimal?(decimal===2?100:1000):1

    watch(currency, currency => {
      $store.commit('users/currencyMutation', { currency })
      $store.commit('users/rateMutation', { rate: null })
      xRate(); crudAction({ auth })
    }) // TagSelectCurrency: CurrencyModule

    onMounted(async () => {
      const STRIPE_KEY = props.payload?.liveMode ?
                        process.env.STRIPE_KEY :
                        process.env.STRIPE_TEST_KEY
      stripe.value = await loadStripe(STRIPE_KEY)
      const elements = stripe.value.elements()

      if (!props.profile) {
        cardElement.value = elements.create('card', {
            classes: { base: 'bg-grey-3' }
        }); cardElement.value.mount('#card-element')
      }
    })

    function paypal(api) {
      // loader.value = true
      if (api) return location.href = api;
      if (diff.value||confirm($t('Confirm Payment'))) crudAction({...props.payload, ...{
        paypal: diff.value,
        // ==============Order=============== \\
        paymentAmount: Number(diff.value.toFixed(decimal)), //paymentAmount.value,
        // ==============Capture============= \\
      }}).then(res => { // TagPayment: LinkPaymentPostModule - ApiLinks - TagLinks
        const result = res?.response?.result
        loader.value = false
        apiLinks.value = result?.links
        // result.statusCode: 201
        // result.create_time
        // result.id = token
        // result.intent
        // result.status: "CREATED"
        // result.links
        // result.purchase_units
        post_id.value = props.payload?.post_id
        emit('paypal', apiLinks.value)
      }).catch(e => notifyAction({error: 'paypalPayment', e})) // TagCreatePayment

    } // TagPayPal: PaymentPostModule

    return {
      post_id,
      ipDebug: computed(() => $store.getters['config/ipDebugGetter']),
      auth,
      checkout: ref(false),
      // === TagPayment ====== \\
      cardHeight: ref('height: 200px;'),
      currency,
      diff,
      // total,
      apiLinks,
      options: [1,2,3,4,6,7,8,9,10,11,12],
      // === TagPayment end === \\
      loader,

      darkMode: computed(() => $q.localStorage.getItem('darkMode')),

      paypal,
      xRate, cy,
      Currencies,
      currencies,

      async stripe() {
          loader.value = true

          const { paymentMethod, error } = await stripe.value.createPaymentMethod(
              'card', cardElement.value, {
                  billing_details: {
                      name: auth.value?.first_name + ' ' + auth.value?.last_name,
                      email: auth.value?.email,
                      phone:  auth.value?.phone,
                      address: {
                          line1: auth.value?.address,
                          line2: null,
                          city: auth.value?.city,
                          state: auth.value?.region,
                          postal_code: auth.value?.postal_code,
                          country: null
                      }
                  }
              }
          )

          if (error) {
              loader.value = false; // console.error(error);
              notifyAction({ message: error?.message })
          } else {
              crudAction({...props.payload, ...{
                stripe: diff.value,
                paymentAmount: Number(diff.value.toFixed(decimal))*digits,
                payment_method_id: paymentMethod.id
              }}).then(() => {
                loader.value = false; emit('paypal')
                post_id.value = props.payload?.post_id // TagCreatePayment
              }).catch(e => notifyAction({error: 'stripePayment', e}))
          }
      }, // TagStripe: PaymentPostModule

      // onSubmit() {
      // },

      filterFn (val, update) { // ===== TagChooseLocation ================= \\
        update(async () => {
          const needle = val.toLowerCase()
          if (!getCurrencies.value?.length) crudAction({
              url: 'api/users/currencies', method: 'get',
              currenciesData: 'currencies'
            }).then(users => $store.commit('users/usersMutation', { users }))
              .catch(e => notifyAction({error: 'getCurrencies', e}))

          const array = getCurrencies.value?.filter(c => (c.to_name||c.to).toLowerCase().includes(needle))

          currencies.value = Object.keys(Currencies).filter(v => v.toLowerCase().indexOf(needle) > -1)
          array?.forEach(c => currencies.value.includes(c.to)||currencies.value.push(c.to))

        }) // https://quasar.dev/vue-components/select#example--selecting-option-after-filtering
      }, // TagSelectCurrency: CurrencyModule

      abortFilterFn () {
        // console.log('delayed filter aborted')
        notifyAction({message: 'delayed filter aborted'})
      },


      creditCard() {
        crudAction({...props.payload, ...{
          // url: 'api/categories',
          // url: 'https://api-m.sandbox.paypal.com/v1/identity/generate-token',
          // method: 'post',
          // stripe: true,
          // post_id: props.payload?.post_id,
          // auth: auth.value,
          creditCard: true
        }}).then(crud => { // https://developer.paypal.com/docs/checkout/advanced/integrate
          console.log('creditCard', crud)
        }).catch(e => notifyAction({error: 'creditCard', e})) // TagImplementTestPayment
      }, // TagCreditCard: PaymentPostModule NotInUse

      linkTest(link) {
        // api({
        // axios({
        crudAction({
          url: link.href,
          method: link.method,
          // [{"href":"https://api.sandbox.paypal.com/v2/checkout/orders/5RD73651FT4932711","rel":"self","method":"GET"},{"href":"https://www.sandbox.paypal.com/checkoutnow?token=5RD73651FT4932711","rel":"approve","method":"GET"},{"href":"https://api.sandbox.paypal.com/v2/checkout/orders/5RD73651FT4932711","rel":"update","method":"PATCH"},{"href":"https://api.sandbox.paypal.com/v2/checkout/orders/5RD73651FT4932711/capture","rel":"capture","method":"POST"}]
        }).then(crud => { // https://stackoverflow.com/questions/54277277/paypal-php-sdk-authentication-failed-due-to-invalid-authentication-credentials
          console.log('linkTest', crud)
        }).catch(e => notifyAction({error: 'linkTest', e})) // TagImplementTestPayment
      }, // TagPayment: LinkPaymentPostModule // https://developer.paypal.com/docs/integration/direct/payments/paypal-payments
    }
  }
}
</script>
