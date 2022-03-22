<template>
  <div class="q-pa-md"><q-btn icon="fas fa-print" class="q-ma-md"  @click="print" />
    <table class="*print-only *print-hide" style="max-width:670px;margin:50px auto 10px;background-color:#fff;padding:50px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);-moz-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); border-top: solid 10px #027be3;">
      <thead>
        <tr>
          <th style="text-align:left;"><img style="max-width: 150px;" src="https://suguffie.com/images/backup/suguffie_fb.png" alt="Suguffiè"/></th>
          <th style="text-align:right;font-weight:400;">{{payment_sale_date}}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="height:35px;"></td>
        </tr>
        <tr>
          <td colspan="2" style="border: solid 1px #ddd; padding:10px 20px;">
            <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:150px">Order status</span><b style="color:#027be3;font-weight:normal;margin:0">{{payment_token?'Success':'Canceled'}}</b></p>
            <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Transaction ID</span>{{payment_post_id}} {{payment_end_date}}</p>
            <p style="font-size:14px;margin:0 0 0 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Order amount</span>{{payment_amount}} {{payment_currency_code}}</p>
            <p style="font-size:14px;margin:0 0 0 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Duration</span>{{payment_start_date}} <q-icon name='fas fa-long-arrow-alt-right'/> {{payment_end_date}}</p>
          </td>
        </tr>
        <tr>
          <td style="height:35px;"></td>
        </tr>
      </tbody>
      <tfooter>
        <tr>
          <td colspan="2" style="font-size:14px;padding:50px 15px 0 15px;">
            <strong style="display:block;margin:0 0 10px 0;">Regards</strong>

            <b>{{ appName }} Marketplace</b> <br>
            <!-- Site: {{env('APP_URL')}} -->
            <q-btn icon="fas fa-hand-point-right" class="q-ma-md" :label="$t('post')+payment_post_id" :to="'/post/'+payment_post_id"/>

          </td>
        </tr>
      </tfooter>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Payment',
  data () {
    return {
      payment_token: null,
      payment_post_id: null,
      payment_amount: null,
      payment_sale_date: null,
      payment_start_date: null,
      payment_end_date: null,
      payment_currency_code: null,
      location_data: null
    }
  },
  computed: mapGetters({
    appName: 'config/appNameGetter'
  }),
  mounted () {
    if (this.$route.query.PayerID) {
      this.updatePostAction({
        rank: 1,
        message: this.$t('Payment Successful'),
        post_id: this.$route.params.id,
        token: this.$route.query.token,
        PayerID: this.$route.query.PayerID
      }) // TagPayment: PostUpdatePaymentModule
    }
  },
  methods: {
    updatePostAction (payload) {
      this.$store.dispatch('categories/updatePostAction', payload).then(res => {
        let payment = res.payment
        this.payment_token = payment.token
        this.payment_post_id = payment.post_id
        this.payment_sale_date = payment.sale_date
        this.payment_amount = payment.amount
        this.payment_end_date = payment.end_date
        this.payment_start_date = payment.start_date
        this.payment_currency_code = payment.currency_code
        // this.postsAction({ post_id: payload.post_id }) // Show Picture
      }).catch(e => {
        // this.loader = false
        try { this.location_data = e.response.data.errors.location[0] || e.response.data.message } catch (e) { this.location_data = null }
      })
    }
  }
}
</script>

<style scoped>
</style>
