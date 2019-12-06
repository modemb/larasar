<template>

    <q-page class="q-pa-md flex-center">

      <q-form class="q-gutter-md">
        <q-input v-model="email" filled type="email" :hint="$t('email')" />

        <q-input v-model="password" filled type="password" :hint="$t('password')" />

        <q-btn color="primary" :label="$t('login')" @click.prevent="login"/>
        <login-with-github />
      </q-form>

    </q-page>
</template>

<script>
import LoginWithGithub from '../../components/LoginWithGithub'

export default {
  components: {
    LoginWithGithub
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
