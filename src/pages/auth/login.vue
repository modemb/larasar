<template>

    <q-page class="q-pa-md flex-center">

      <q-form class="q-gutter-md">
        <q-input v-model="email" filled type="email" :hint="$t('email')" />

        <q-input v-model="password" filled type="password" :hint="$t('password')" />
        <div class="col-md-12">
          <q-btn color="primary" :label="$t('login')" @click.prevent="login" class="q-ma-sm"/>
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
<<<<<<< HEAD
      email: 'modembfr@gmail.com',
      password: '88888888',
=======
      email: '',
      password: '',
>>>>>>> modemb/dev
      isPwd: true,
      remember: false
    }
  },
  methods: {
    login () {
      var data = {
        email: this.email,
        password: this.password,
        remember: this.remember,
        user: 'login'
        // scope: ''
      }
      this.$store.dispatch('users/loginAction', data) // Action
    }
  }
}
</script>
