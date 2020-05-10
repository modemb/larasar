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
                  lazy-rules
                  :rules="[val => val && val.length > 0 || 'null']"
                  :error="email_data ? true : false"
                  :error-message='email_data'
                />

                <q-input
                  filled lazy-rules
                  v-model="password"
                  :label="$t('password')"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[val => val && val.length > 7 || 'min 8']"
                  :error="password_data ? true : false"
                  :error-message='password_data'
                />

                <q-input
                  v-model="password_confirmation"
                  filled lazy-rules
                  :type="isPwd ? 'password' : 'text'"
                  :label="$t('confirm_password')"
                  :rules="[val => val && val.length > 7 || 'min 8']"
                  >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>

                <div class="q-pt-md">
                  <q-btn color="primary"
                    icon="fas fa-history"
                    :loading="loader"
                    :label="$t('reset_password')"
                    @click.prevent="reset"
                  />
                </div>

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
      token: '',
      email: '',
      email_data: '',
      password: '',
      password_data: '',
      isPwd: true,
      password_confirmation: ''
    }
  },
  created () {
    this.email = this.$route.query.email
    this.token = this.$route.query.token || this.$route.params.token
  },
  methods: {
    async reset () {
      this.loader = true
      const data = {
        api: 'login',
        locale: locale,
        token: this.token,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      }
      this.$axios.post('/api/password/reset', data)
        .then(() => {
          this.loader = false
          this.$store.dispatch('users/loginAction', data)
          this.$q.notify({
            color: 'positive',
            position: 'top',
            message: this.$t('password_updated'),
            icon: 'check'
          })
        })
        .catch(error => {
          this.loader = false
          const data = error.response.data
          this.email_data = data['email'] || data.message
          this.password_data = data.errors.password[0] || data.message
        })
    }
  }
}
</script>
