<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg">
    <div class="q-pa-md">
      <q-btn color="primary" label="loadDat" @click.prevent="loadData" />
      <q-btn color="primary" label="login" @click.prevent="login" />
      <q-btn color="primary" label="test" @click.prevent="test" />
      <q-btn color="primary" label="user" @click.prevent="user" />
      <q-btn color="primary" label="get" @click.prevent="get" />
      <div class="q-gutter-md row items-start">
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

        <q-input v-model="email" filled type="email" hint="Email" />

        <q-input v-model="name" filled type="name" hint="Name" />

        <q-input v-model="search" filled type="search" hint="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-input v-model="tel" filled type="tel" hint="Telephone number" />

        <q-input v-model="time" filled type="time" hint="Native time" />

        <q-input v-model="date" filled type="date" hint="Native date" />

        <q-btn color="primary" label="Register" @click.prevent="register"/>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      password: '',
      password_confirmation: '',
      isPwd: true,

      email: '',
      search: '',
      tel: '',
      name: '',
      time: '',
      date: ''
    }
  },
  methods: {
    user () {
      this.$axios.get('/api/auth')
        .then(response => {
          console.log(response.data)
        })
    },
    get () {
      this.$axios.get('/oauth/clients')
      // this.$axios.get('/api/todos')
        .then(response => {
          console.log(response.data)
        })
    },
    loadData () {
      this.$store.dispatch('users/nameAction') // Action
    },
    register () {
      const data = {
        // grant_type: 'password',
        // client_id: 2,
        // client_secret: 'BeCXauYX2wRcLgNDnX9btRpKHsAC0MXDQTgJGZp2',
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
        // scope: ''
      }
      this.$store.dispatch('users/registerAction', data)
    },
    test () {
      const data = {
        name: 'modemb@modemb.com',
        secret: 'BeCXauYX2wRcLgNDnX9btRpKHsAC0MXDQTgJGZp2',
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
