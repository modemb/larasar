<template>

    <q-page class="q-pa-md flex-center">

      <q-form class="q-gutter-md">
        <q-input
          v-model="email"
          filled
          type="email"
          :label="$t('email')"
          :hint="email_data"
          lazy-rules
          :rules="[val => val && val.length > 0 || email_data]"
        />

        <q-input
          v-model="password"
          filled
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
          <q-btn color="primary" :loading="loader" :label="$t('login')" @click.prevent="login" class="q-ma-sm"/>
          <login-with-social />
          <q-checkbox v-model="remember" :label="$t('remember_me')" />
          <q-btn color="primary" flat :label="$t('forgot_password')" to="/password/reset" class="q-ma-sm"/>
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
          // console.log(error.response.data)
          // console.log(error.response.data.message)
          // console.log(error.response.data.errors.email[0])
          this.email_data = [error.response.data.errors.email][0] || error.response.data.message
          this.password_data = [error.response.data.errors.password][0] || error.response.data.message
        })
    }
  }
}
</script>
