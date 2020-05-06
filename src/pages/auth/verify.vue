<template>
  <q-page class="q-pa-md">

      <div class="row flex justify-center">
          <q-card class="my-card text-white">
              <q-card-section class="bg-primary">
                <div class="text-h6">{{$t('verify_email')}}</div>
              </q-card-section>

              <div class="q-ma-sm text-black">
                <template v-if="success">
                    {{$t('verify_email_address')}} <br>
                </template>
                <template v-if="param_id">
                    {{ $t('failed_to_verify_email') }}
                </template>
                {{ $t('Before proceeding, please check your email for a verification link.') }}
                {{ $t('If you did not receive the email') }},
              </div>

              <q-btn
                color="primary"
                :label="$t('resend_verification_link')"
                class="q-ma-sm"
                @click.prevent="resend"
              />
              <q-btn
                color="primary"
                v-if="param_id"
                :loading="loader"
                :label="$t('verify_email')"
                class="q-ma-sm"
                @click.prevent="verify"
              />
          </q-card>
      </div>

  </q-page>
</template>

<script>
import { axiosInstance } from 'boot/axios'
const qs = (params) => Object.keys(params).map(key => `${key}=${params[key]}`).join('&')

export default {
  data: () => ({
    loader: false,
    param_id: '',
    success: '',
    error: ''
  }),
  async beforeRouteEnter (to, from, next) {
    try {
      const { data } = await axiosInstance.post(`api/email/verify/${to.params.id}/${to.params.hash}?${qs(to.query)}`)
      next(vm => {
        vm.$q.notify({
          color: 'positive',
          position: 'top',
          message: vm.$t(data),
          icon: 'check'
        }); next({ path: '/' })
      })
    } catch {
      axiosInstance.post('api/email/resend').then(rep => {
        next(vm => { vm.success = rep.status })
      }).catch(e => {
        next(vm => {
          vm.$q.notify({
            color: 'negative',
            position: 'top',
            message: e.response.data.message,
            icon: 'report_problem'
          }); next(vm => { vm.error = e.response.status })
        })
      })
    }
  },
  created () {
    if (this.$route.params.id) {
      this.param_id = this.$route.params.id
    }
  },
  methods: {
    resend () {
      this.$axios.post('api/email/resend').then(rep => {
        this.success = rep.status
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: this.$t('verify_email_address'),
          icon: 'check'
        })
      }).catch(e => {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: e.response.data.message,
          icon: 'report_problem'
        })
      })
      // this.$axios.reset()
    },
    verify () {
      this.loader = true
      this.$axios.post(`api/email/verify/${this.$route.params.id}/${this.$route.params.hash}?${qs(this.$route.query)}`)
        .then(rep => {
          // this.success = rep.data
          this.loader = false
          this.$q.notify({
            color: 'positive',
            position: 'top',
            message: this.$t(rep.data),
            icon: 'check'
          }); this.$router.push({ path: '/' })
        }).catch(e => {
          this.loader = false
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: e.response.data.message,
            icon: 'report_problem'
          })
        })
    }
  }
}
</script>
