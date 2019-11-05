<template>

    <q-page class="q-pa-md flex-center">

      <q-form class="q-gutter-md">
        <q-input v-model="email" filled type="email" hint="Email" />

        <q-input v-model="password" filled type="password" hint="Password" />

        <div>
          <q-btn color="primary" label="LogIn" @click.prevent="login"/>
        </div>
      </q-form>

    </q-page>
</template>

<script>
// import LoginWithGithub from '~/components/LoginWithGithub'

export default {
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
      // this.$store.commit('users/someMutation', data) // Mutation

      // Save the token.
      // this.$store.dispatch('auth/saveToken', {
      //   token: data.token,
      //   remember: this.remember
      // })
      // Fetch the user.await
      // this.$store.dispatch('auth/fetchUser')
    }
  }
}
</script>
