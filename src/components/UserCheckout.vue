<template>
  <q-dialog v-model="checkout"><!--========== Receipt PopUp ============-->
    <q-card class="my-card text-black">
      <q-card-section class="bg-primary text-white">
        <q-btn dense round icon="close" class="float-right" v-close-popup />
        <div class="text-h6">{{$t('checkout')}}</div>
      </q-card-section>
      <Reports :post_id="post_id" />
    </q-card>
  </q-dialog><!--=========================== Receipt PopUp End ========-->

  <div class="row">

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
          _behavior="dialog"
          input-debounce="0"
          @filter="filterFn"
          @filter-abort="abortFilterFn"
          :options="currencies"

          :label="Currencies[currency]?.name"
          :hint="$t('currency_code')"
          style="width: 100%; padding-bottom: 32px"
        ><!-- :disable="!(profile||ipDebug)" https://quasar.dev/vue-components/select#example--basic-filtering -->
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

      <div v-if="!profile"><!-- -->
        {{ cy(xGain=xRate(auth?.gain)) }}
        <i class="fa-solid fa-minus q-ma-md" />
        {{ cy(xPayment=xRate(payload?.data?.payment)) }}
        <i class="fa-solid fa-equals q-ma-md">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
            {{$t('Earned Money')}}
          </q-tooltip>
          <q-btn color="primary" class="q-ma-md" @click="checkout=true"
            :label="cy((xGain<xPayment)?0:(xGain-xPayment))"
          /><q-icon name='fas fa-long-arrow-alt-right'/>
        </i>{{total=cy(diff=($payment=(xPayment>xGain)?(xPayment-xGain):0)||xPayment)}}
        <p v-if="ipDebug">4242 4242 4242 4242</p>
      </div><!-- TagPaymentInfo: GainPaymentPostModule -->

    </div>

    <q-card class="col-md-6" v-if="!profile">
      <q-card-section :id="`${cardName}-element`" />
      <!-- <q-card-section ref="cardElement" /> -->
      <!-- <q-card-section id="card-element" /> -->
      <!-- <q-card-section id="payment-element" /> -->
      <div class="q-ma-md">{{$t('credit_card')}}</div>
      <q-btn color="primary" class="q-ma-md"
        icon="fa-solid fa-credit-card"
        :disabled="payload?.data?.token||loader||!$payment"
        :label="loader ? $t('Processing') : $t('Pay Now')" @click="stripeCharge"
      /><!-- TagStripeCharge: PaymentPostModule -->
      <q-btn color="primary" class="q-ma-md" v-if="diff>0"
        :icon="$payment?'fab fa-paypal':'fas fa-cent-sign'"
        :disabled="!apiLinks?.[1]?.rel&&payload?.data?.token||loader"
        :label="$t(apiLinks?.[1]?.rel??($payment?'paypal':'Earned Money'))"
        :loading="loader" @click.prevent="paypal(apiLinks?.[1]?.href)"
      /><!-- TagPaymentCreate: PayPalPostModule -->
      <q-btn color="primary" class="q-ma-md"
        :label="$t('More Payment Option')" v-if="ipDebug"
        @click.prevent="cardBool = !cardBool"
      /><!-- TagStripePaymentOption: PaymentPostModule -->
      <q-btn flat class="q-ma-md" :label="total"/>
    </q-card><!-- TagPayPal: PaymentPostModule -->

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

      <!-- <div v-if="false" class="row">
        <q-btn color="primary" class="q-ma-md"
          v-for="(link, key) in links" :key="key"
          icon="fab fa-paypal"
          :loading="loader"
          :label="link.rel" type="a"
          @click.prevent="linkTest(link)"
        /> TagPayment: LinkPaymentPostModule
        <q-btn flat round icon="fas fa-question" v-if="links">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
            {{JSON.stringify(links)}}
          </q-tooltip>
        </q-btn>
        <q-btn color="primary" class="q-ma-md"
          v-for="(link, key) in links" :key="key"
          target="_blank" type="a"
          :href="link.href"
          icon="fab fa-paypal"
          :loading="loader"
          :label="link.rel"
        />
      </div>TagLinksPayment: PaymentPostModule -->

    </span><!-- TagLinks: LinkPaymentPostModule PayPal -->

  </div><!-- TagPaymentCheckout: PaymentPostModule https://quasar.dev/vue-components/button-toggle#Example--Some-design-examples -->

</template>

<script lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useCrudStore } from 'stores/crud'
import { api, i18n, cy, xRate, currenciesAction, ipData } from 'boot/axios'
import { loadStripe } from '@stripe/stripe-js'
import Currencies from './json/Currencies.json'
import Reports from './UserReports.vue'

/**
 * Tags: TagPayment - TagCheckout - TagActivePlan - TagImplementTestPayment - TagStripePayment
 *       LinkPaymentPostModule - FavoriteModule - PaymentPostModule - TagStripeCharge
 *
 * @to CategoryController
 */
export default {
  components: {
    Reports
  },
  props: ['payload', 'profile', 'user'],
  setup (props, { emit }) {
    const $t = i18n.global.t
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const $q = useQuasar()
    const post_id = ref(true)
    const apiLinks = ref<any>(false)
    // === TagPayment ====== \\
    const $payment = ref(0)
    const loader = ref(false)
    const stripe = ref<any>(null)
    const cardElement = ref<any>(null)
    const cardBool = ref(true)
    const currencies = ref<string[]>([])
    // const currency = ref('USD')
    // const currency = ref(props.user?.currency_code)
    // const currency = ref(props.user?.currency_code||props.payload?.currency_code)

    const auth = computed(() => props.user||store.authGetter)
    const getCurrencies = computed(() => store['currenciesGetter'])

    const currency = ref<'USD'>(auth.value?.currency_code)

    const clientSecret = computed(() => store.clientSecretGetter)
    const cardName = computed(() => cardBool.value?'card':'payment')
    const decimal = computed(() => Currencies[currency.value]?.decimal_digits)
    const digits = computed(() => decimal.value?(decimal.value===2?100:1000):1)

    watch(cardName, val => stripePaymentOption(val))
    watch(currency, () => {
      store['rateGetter'] = null // crudAction({ rate: null, mutate: 'rateGetter' })
      // if (props.user) store.authGetter = props.user
      if (props.user) store.authGetter.id = props.user.id // PopUpUser
      crudAction({ currency, mutate: 'currencyGetter', refresh: ['currencyGetter'] })
      xRate(auth.value) // Refresh Updated Currency On the Database
      setTimeout(() => emit('currency'), 1500) // Update Popup Users' Currency
    }) // TagSelectCurrency: CurrencyModule

    onMounted(() => stripePaymentOption(cardName.value))

    function paypal(url: string) {
      // loader.value = true
      console.log(
        'url', url
        // 'props.payload', props.payload,
        // 'auth.value?.currency_code', auth.value?.currency_code
      )
      if (url) return location.href = url;

      // if ($payment.value||confirm($t('Confirm Payment'))) crudAction({...props.payload, ...{
      //   paypal: $payment.value,
      //   // ==============Order=============== \\
      //   currency_code: currency.value,
      //   paymentAmount: Number($payment.value.toFixed(decimal)),
      //   // ==============Capture============= \\
      // }})

      if ($payment.value||confirm($t('Confirm Payment'))) api({
        url: props.payload.url,
        method: props.payload.method,
        data: { ...props.payload.data,
          paypal: $payment.value,
          // ==============Order=============== \\
          currency_code: currency.value,
          paymentAmount: Number($payment.value.toFixed(decimal.value)),
          // ==============Capture============= \\
        }}).then(({ data }) => {
          // .then(({data: { success, response: { result } }}) => { // TagPayment: LinkPaymentPostModule - ApiLinks - TagLinks
          const result = data?.response?.result
          loader.value = false
          notifyAction({ success: data.success })
          apiLinks.value = result?.links
          // result.statusCode: 201
          // result.create_time
          // result.id = token
          // result.intent
          // result.status: "CREATED"
          // result.links
          // result.purchase_units
          post_id.value = props.payload?.data?.post_id
          emit('paypal', apiLinks.value)
      }).catch((e) => notifyAction({error: 'paypalPayment', e})) // TagCreatePayment

    } // TagPayPal: PaymentPostModule

    const elements = ref<any>({})
    // let elements: { create: (arg0: string, arg1: { classes: { base: string } }) => any }

    async function stripePaymentOption(card: string) {

      const STRIPE_KEY: any = props.payload?.data?.liveMode ?
                        process.env.STRIPE_KEY :
                        process.env.STRIPE_TEST_KEY
      stripe.value = await loadStripe(STRIPE_KEY)

      if (!props.profile) { // https://docs.stripe.com/payments/klarna
        let params
        const appearance = { /* appearance */ }
        if (cardName.value === 'payment') { // Payment Intent
          const clientSecret = await stripePayment({ pay: true })
          params = { clientSecret, appearance }
        } else params = { appearance } // Payment
        const options = { classes: { base: 'bg-grey-3' } }
        elements.value = stripe.value.elements(params)
        cardElement.value = elements.value.create(card, options)
        cardElement.value.mount(`#${card}-element`) // paymentElement
      } // https://docs.stripe.com/identity/verification-sessions#client-secret

    } // TagStripePaymentOption: PaymentPostModule

    function stripePayment(params: { pay?: boolean; paymentMethod?: any; refresh?: string[] }) {

      return crudAction({
        ...props.payload.data, ...params,
        url: props.payload.url,
        method: props.payload.method,
        currency_code: currency.value,
        mutate: 'clientSecretGetter',
        stripe: $payment.value, // https://docs.stripe.com/upgrades/manage-payment-methods
        paymentAmount: Number($payment.value.toFixed(decimal.value))*digits.value,
      }).catch((e: unknown) => notifyAction({error: 'stripePayment', e}))

    } // TagStripePayment: PaymentPostModule

    return {
      ipDebug: computed(() => store['configGetter']?.ipDebug),
      // darkMode: computed(() => $q.localStorage.getItem('darkMode')),
      // darkMode: computed(() => store.darkModeGetter?.darkMode),
      // darkMode: ref($q.localStorage.getItem('darkMode')),
      auth, post_id,
      checkout: ref(false),
      // === TagPayment ====== \\
      cardHeight: ref('height: 200px;'),
      apiLinks, cardName, cardBool,
      options: [1,2,3,4,6,7,8,9,10,11,12],
      // === TagPayment end === \\
      loader,

      // ==========
      total: ref(''),
      diff: ref(0),
      xGain: ref(0),
      xPayment: ref(0),
      // ==========

      paypal,
      xRate, cy,
      Currencies,
      currencies,
      currency,
      $payment, cardElement,

      async stripeCharge() {
          loader.value = true
          console.log('clientSecret', clientSecret)

          const { paymentMethod, error } = await stripe.value.createPaymentMethod(
            cardName.value, cardElement.value,
            {
                // type: cardName.value,
                // card: cardElement.value,
                billing_details: {
                    name: auth.value?.first_name + ' ' + auth.value?.last_name,
                    email: auth.value?.email,
                    phone: auth.value?.phone,
                    address: {
                        line1: auth.value?.address,
                        line2: null,
                        city: auth.value?.city,
                        state: auth.value?.region,
                        postal_code: auth.value?.postal_code,
                        country: null
                    }
                }, // https://docs.stripe.com/payments/payment-card-element-comparison
            } // https://docs.stripe.com/upgrades/manage-payment-methods
          )

          if (clientSecret.value&&(paymentMethod.type !== 'card'))
          stripe.value.confirmPayment({
            clientSecret: clientSecret.value,
            elements: elements.value,
            payment_method: {
              klarna: {}, // Or other relevant payment method data
            },
            mandate_data: {
              customer_acceptance: {
                type: 'online',
                online: {
                  ip_address: ipData?.ip, // Replace with customer's IP address
                  user_agent: navigator.userAgent, // Customer's user agent
                },
              },
            },
            confirmParams: {
              return_url: 'https://your-domain.com/checkout/complete', // Your return URL
            }, redirect: 'if_required',
          }).then((result: { error: { message: any } }) => {
            if (result.error) {
              // Show error to your customer
              // console.error(result.error.message)
              notifyAction({ message: result.error.message })
            } else {
              // The payment has been processed!
              console.log('Payment succeeded!');

              notifyAction({ success: 'yyy' })
            } console.log('result', result)
          }) // ToMakeItWorks

          if (error) {
            loader.value = false; // console.error('error', error);
            notifyAction({ message: error?.message })
          } else stripePayment({ paymentMethod }).then((data: any) => {
            loader.value = false; notifyAction(data); emit('paypal')
            post_id.value = props.payload?.data?.post_id
          }) // TagStripeCharge: PaymentPostModule

          // api({ // https://docs.stripe.com/upgrades/manage-payment-methods
          //   url: props.payload.url,
          //   method: props.payload.method,
          //   data: {...props.payload.data,
          //     stripe: $payment.value,
          //     currency_code: currency.value,
          //     paymentAmount: Number($payment.value.toFixed(decimal.value))*digits.value,
          //     payment_method_id: paymentMethod.id, paymentMethod
          // }}).then(({ data }) => { notifyAction(data)
          //   loader.value = false; emit('paypal')
          //   post_id.value = props.payload?.data?.post_id // TagCreatePayment
          // }).catch(e => notifyAction({error: 'stripePayment', e}))

      }, // TagStripeCharge: PaymentPostModule

      filterFn (val: string, update: (arg0: () => Promise<void>) => void) { // ===== TagChooseCurrency ================= \\
        update(async () => {

          if (!getCurrencies.value?.length) currenciesAction()

          const needle = val.toLowerCase()
          const array = getCurrencies.value?.filter((c: { to_name: string; to: string }) => (c.to_name||c.to)?.toLowerCase().includes(needle))

          currencies.value = Object.keys(Currencies).filter(v => v.toLowerCase().indexOf(needle) > -1)
          array?.forEach((c: { to: never }) => currencies.value.includes(c.to)||currencies.value.push(c.to))

        }) // https://quasar.dev/vue-components/select#example--selecting-option-after-filtering
      }, // TagSelectCurrency: CurrencyModule

      abortFilterFn: () => notifyAction({message: 'delayed filter aborted'}),

      stripePayment, // TagStripePayment: PaymentPostModule NotInUse

      linkTest(link: { href: string; method: string }) {
        // api({
        // axios({
        api({
          url: link.href,
          method: link.method
          // [{"href":"https://api.sandbox.paypal.com/v2/checkout/orders/5RD73651FT4932711","rel":"self","method":"GET"},{"href":"https://www.sandbox.paypal.com/checkoutnow?token=5RD73651FT4932711","rel":"approve","method":"GET"},{"href":"https://api.sandbox.paypal.com/v2/checkout/orders/5RD73651FT4932711","rel":"update","method":"PATCH"},{"href":"https://api.sandbox.paypal.com/v2/checkout/orders/5RD73651FT4932711/capture","rel":"capture","method":"POST"}]
        }).then(({ data }) => { // https://stackoverflow.com/questions/54277277/paypal-php-sdk-authentication-failed-due-to-invalid-authentication-credentials
          console.log('linkTest', data)
        }).catch((e) => notifyAction({error: 'linkTest', e})) // TagImplementTestPayment
      }, // TagPayment: LinkPaymentPostModule // https://developer.paypal.com/docs/integration/direct/payments/paypal-payments
    }
  }
}
</script>
