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
                  :label="$t('email')"
                  :hint="email_data"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || email_data]"
                />

                <q-input
                  filled
                  v-model="password"
                  :type="isPwd ? 'password' : 'text'"
                  :label="$t('password')"
                  :hint="password_data"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || password_data]"
                  >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
                <div class="col-md-12">
                  <q-btn color="primary" :loading="loader" :label="$t('login')" @click.prevent="login" class="*q-ma-sm"/>
                  <login-with-social />
                  <q-checkbox v-model="remember" :label="$t('remember_me')" />
                  <q-btn color="primary" flat :label="$t('forgot_password')" to="/password/reset" class="*q-ma-sm"/>
                </div>

              </div>

            </q-card>

          </div>

        </div>
      </q-form>

    </q-page>

</template>

<script>
import LoginWithSocial from '../../components/LoginWithSocial'

export default {
  name: 'loginPage',
  components: {
    LoginWithSocial
  },
  data () {
    return {
      loader: false,
      email: null,
      email_data: null,
      password: null,
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
        user: 'login'
        // scope: ''
      })
        .then(() => {
          this.loader = false
        })
        .catch(error => {
          this.loader = false
          this.email_data = [error.response.data.errors.email][0] || error.response.data.message
          this.password_data = [error.response.data.errors.password][0] || error.response.data.message
        })
    }
  }
}
</script>
