<template>

    <div class="q-pa-md flex-center">

      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
        >
        <q-input v-model="email" filled type="email" hint="Email" />

        <q-input v-model="password" filled type="password" hint="Password" />

        <div>
          <q-btn color="primary" label="LogIn" @click.prevent="login"/>
          <!-- <q-btn label="loadData" type="reset" color="primary" flat class="q-ml-sm" @click.prevent="loadData" /> -->
        </div>
      </q-form>

    </div>
</template>

<script>
// import LoginWithGithub from '~/components/LoginWithGithub'

export default {
  name: 'public.login',
  data () {
    return {
      email: 'modemb@modemb.com',
      password: '88888888',
      isPwd: true
    }
  },
  methods: {
    login () {
      var data = {
        // grant_type: 'password',
        // client_id: 2,
        // client_secret: 'BeCXauYX2wRcLgNDnX9btRpKHsAC0MXDQTgJGZp2',
        username: this.email,
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

      // Redirect home.
      this.$router.push({ path: '/' })
    }
  }
}
</script>
