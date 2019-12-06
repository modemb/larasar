<template>

    <q-page class="q-pa-md flex-center">

      <q-form class="q-gutter-md">
        <q-input v-model="email" filled type="email" :hint="$t('email')" />

        <q-input v-model="password" filled type="password" :hint="$t('password')" />
        <div class="col-md-12">
          <q-btn color="primary" :label="$t('login')" @click.prevent="login" class="q-ma-sm"/>
          <login-with-social />
        </div>
      </q-form>

    </q-page>
</template>

<script>
import LoginWithSocial from '../../components/LoginWithSocial'

export default {
  components: {
    LoginWithSocial
  },
  name: 'PageIndex',
  data () {
    return {
      email: 'modembfr@gmail.com',
      password: '88888888',
      isPwd: true
    }
  },
  methods: {
    login () {
      var data = {
        email: this.email,
        password: this.password,
        user: 'login'
        // scope: ''
      }
      this.$store.dispatch('users/loginAction', data) // Action
    }
  }
}
</script>
