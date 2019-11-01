<template>

    <div class="q-pa-md flex-center">

      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
        >
        <q-input
          filled
          v-model="name"
          label="Your name *"
          hint="Name and surname"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <q-input v-model="email" filled type="email" hint="Email" />

        <q-input v-model="password" filled type="password" hint="Password" />

        <q-input v-model="password_confirmation" filled :type="isPwd ? 'password' : 'text'" hint="Password with toggle">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div>
          <q-btn color="primary" label="Register" @click.prevent="register"/>
          <q-btn label="clients" type="reset" color="primary" flat class="q-ml-sm" @click.prevent="clients" />
        </div>
      </q-form>

    </div>

</template>

<script>
export default {
  name: 'public.register',
  data () {
    return {
      password: '',
      password_confirmation: '',
      isPwd: true,
      email: '',
      name: ''
    }
  },
  methods: {
    register () {
      const data = {
        // grant_type: 'password',
        // client_id: 2,
        // client_secret: 'BeCXauYX2wRcLgNDnX9btRpKHsAC0MXDQTgJGZp2',
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
        user: 'register'
        // scope: ''
      }
      this.$store.dispatch('users/registerAction', data)
    },
    clients () {
      const data = {
        name: 'modemb@modemb.com',
        secret: 'iI7ZtHQAGTNY5l24YfGAvqeKCNyRkwSbbYHIAAcQ',
        redirect: 'http://localhost:8080'
      }
      this.$axios.get('/oauth/clients', data)
        .then(response => {
          console.log(response.data)
        })
        .catch(response => {
          // List errors on response...
        })
    }
  }
}
</script>
