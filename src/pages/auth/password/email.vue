<template>

    <q-page class="q-pa-md">

      <q-form class="q-gutter-md">
        <div class="row flex justify-center">

          <div class="col-md-6 q-pa-md">

            <q-card class="my-card text-white">
              <q-card-section class="bg-primary">
                <div class="text-h6">{{$t('reset_password')}}</div>
                <!-- <div class="text-subtitle2">by John Doe</div> -->
              </q-card-section>

              <div class="q-pa-md">
                <q-input
                  v-model="email"
                  filled
                  type="email"
                  :label="$t('email')"
                  :hint="email_data"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || 'null']"
                  :error="email_data ? true : false"
                  :error-message='email_data'
                />

                <q-btn color="primary" :loading="loader" :label="$t('send_password_reset_link')" class="q-ma-sm" @click.prevent="send" />

              </div>

            </q-card>

          </div>

        </div>
      </q-form>

    </q-page>

</template>

<script>
import { locale } from 'boot/axios'

export default {
  name: 'resetPage',
  data () {
    return {
      loader: false,
      email: '',
      email_data: ''
    }
  },
  methods: {
    send () {
      this.loader = true
      this.$axios.post('/api/password/email', {
        email: this.email,
        locale: locale
      })
        .then(rep => {
          this.loader = false
          this.$q.notify({
            color: 'positive',
            position: 'top',
            message: rep.data.status,
            icon: 'check'
          })
        })
        .catch(error => {
          this.loader = false
          this.email_data = error.response.data.email || error.response.data.errors.email[0]
        })
    }
  }
}
</script>
