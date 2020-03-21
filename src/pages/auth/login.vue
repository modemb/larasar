<template>

    <q-page class="q-pa-md">

      <q-form class="q-gutter-md">
        <div class="row flex justify-center">

          <div class="col-md-6 q-pa-md">

            <q-card class="my-card text-white">
              <q-card-section class="bg-primary">
                <div class="text-h6">{{$t('login')}}</div>
                <!-- <div class="text-subtitle2">by John Doe</div> -->
              </q-card-section>

              <div class="q-pa-md">

                <q-input
                  filled
                  v-model="email"
                  type="email"
                  lazy-rules
                  :label="$t('email')"
                  :rules="[val => val && val.length > 0 || 'null']"
                  :error="email_data ? true : false"
                  :error-message='email_data'
                />

                <q-input
                  filled
                  v-model="password"
                  :type="isPwd ? 'password' : 'text'"
                  :label="$t('password')"
                  lazy-rules
                  :rules="[val => val && val.length > 7 || 'min 8']"
                  :error="password_data ? true : false"
                  :error-message='password_data'
                  >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
                <template class="*col-md-12">
                  <q-btn color="primary" :loading="loader" :label="$t('login')" @click.prevent="login" class="q-ma-sm"/>
                  <login-with-social />
                  <q-checkbox v-model="remember" :label="$t('remember_me')" />
                  <q-btn color="primary" flat :label="$t('forgot_password')" to="/password/reset" class="q-ma-sm"/>
                </template>

              </div>

            </q-card>

          </div>

        </div>
      </q-form>

    </q-page>

</template>

<script>
import LoginWithSocial from '../../components/LoginWithSocial'
const qs = params => Object.keys(params).map(key => `${key}=${params[key]}`).join('&')

export default {
  name: 'loginPage',
  components: {
    LoginWithSocial
  },
  data () {
    return {
      loader: false,
      email: process.env.DEV ? 'modembfr@gmail.com' : null,
      email_data: null,
      password: process.env.DEV ? '88888888' : null,
      password_data: null,
      isPwd: true,
      remember: false
    }
  },
  methods: {
    async login () {
      this.loader = true
      this.$store.dispatch('users/loginAction', {
        email: this.email,
        password: this.password,
        remember: this.remember,
        // id: this.$route.params.id,
        hash: this.$route.params.hash,
        // query: this.$route.query,
        query: qs(this.$route.query),
        api: 'login'
        // scope: ''
      })
        .then(() => {
          this.loader = false
        })
        .catch(error => {
          this.loader = false
          this.email_data = error.response.data.errors.email[0] || error.response.data.message
          this.password_data = error.response.data.errors.password[0] || error.response.data.message
        })
    }
  }
}
</script>
