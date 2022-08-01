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

  <div class="q-ma-md">

      <q-btn flat icon="fas fa-dollar-sign" :label="auth.gain" @click="checkout=true">
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
          {{$t('Earned Money')}}
        </q-tooltip>
        <i class="fa-solid fa-minus">{{ payload.payment }}</i>
        <i class="fa-solid fa-equals">
          <q-btn flat icon="fas fa-dollar-sign"
            :label="(auth.gain<payload.payment)?0:(auth.gain-payload.payment).toFixed(2)"
          />
        </i>
      </q-btn><!-- TagPaymentInfo: GainPaymentPostModule -->


      <span ><!-- TagPaymentCheckout: GainPaymentPostModule -->

        <q-btn color="primary" class="q-ma-md"
          :icon="(diff=(payload.payment>auth.gain)?(payload.payment-auth.gain).toFixed(2):0)
            ?'fab fa-paypal':'fas fa-dollar-sign'"
          :label="`${apiLinks?.[1]?.rel??(diff?'paypal':$t('Earned Money'))}`"
          :loading="loader" @click.prevent="paypal(apiLinks?.[1]?.href)"
        />${{diff||payload.payment}}

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

      </span><!-- TagLinks: LinkPaymentPostModule PayPal -->


      <div>{{$t('credit_card')}}</div><!-- TagPaymentCreate: PayPalPostModule -->


  </div><!-- TagPaymentCheckout: PaymentPostModule https://quasar.dev/vue-components/button-toggle#Example--Some-design-examples -->
</template>

<script>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
// import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { crudAction, notifyAction } from 'boot/axios'
import Reports from './Reports'

/**
 * Tags: TagPayment - TagCheckout - TagActivePlan - FavoriteModule - PaymentPostModule
 *       LinkPaymentPostModule - TagImplementTestPayment - ipDebugPaymentPostModule
 *
 * @from CategoryController
 */
export default {
  components: {
    Reports
  },
  props: ['payload'],
  setup (props, { emit }) {
    const $store = useStore()
    const $q = useQuasar()
    // const $route = useRoute()
    // const $router = useRouter()
    // const token = ref(null)
    const post_id = ref(true)
    const apiLinks = ref(false)
    // === TagPayment ====== \\
    // const count = ref(0)
    // const payment = ref(0)
    const diff = ref(0)
    // const amount = ref(10)
    // const recurring = ref(1)
    const loader = ref(false)

    const ipDebug = computed(() => $store.getters['config/ipDebugGetter'])
    const auth = computed(() => $store.getters['users/authGetter'])

    function paypal(api) {

      if (api) return location.href = api; crudAction({
        url: props.payload?.url,
        method: props.payload?.method,
        post_id: props.payload?.post_id,
        sAdminIP: props.payload?.sAdminIP,
        auth: auth.value,
        PostPayment: true,
        recurring: props.payload?.recurring,
        // ==============Order=============== \\
        order: props.payload?.order,
        href: props.payload?.href,
        currency_code: 'USD',
        plans: props.payload?.plans,
        paymentAmount: diff.value, //(props.payload?.payment>auth.value.gain)?(props.payload?.payment-auth.value.gain).toFixed(2):0, //props.payload?.payment,
        // ==============Capture============= \\
        capture: props.payload?.capture,
        token: props.payload?.token, // ToFix
        PayerID: props.payload?.PayerID // ||false
      }).then(res => { // TagPayment: LinkPaymentPostModule - ApiLinks - TagLinks
        const result = res?.response?.result
        loader.value = false//; emit('paypal')
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

    }

    return {
      ipDebug,
      auth,
      post_id,
      checkout: ref(false),
      // === TagPayment ====== \\
      cardHeight: ref('height: 200px;'),
      // count,
      // payment,
      diff,
      paypal,
      // amount,
      // recurring,
      apiLinks,
      options: [1,2,3,4,6,7,8,9,10,11,12],
      // === TagPayment end === \\
      loader,

      darkMode: computed(() => $q.localStorage.getItem('darkMode')),

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
      }, // TagPayment: LinkPaymentPostModule //TODO https://developer.paypal.com/docs/integration/direct/payments/paypal-payments
    }
  }
}
</script>
