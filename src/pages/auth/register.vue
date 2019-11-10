<template>

    <q-page class="q-pa-md flex-center">

      <q-form class="q-gutter-md">
        <q-input
          filled
          v-model="name"
          :label="$t('name')"
          :hint="$t('name')"
          lazy-rules
          :rules="[ val => val && val.length > 0 || $t('error_alert_title')]"
        />

        <q-input v-model="email" filled type="email" :hint="$t('email')" />

        <q-input v-model="password" filled type="password" :hint="$t('password')" />

        <q-input v-model="password_confirmation" filled :type="isPwd ? 'password' : 'text'" :hint="$t('confirm_password')">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div>
          <q-btn color="primary" :label="$t('register')" @click.prevent="register"/>
          <q-btn label="clients" type="reset" color="primary" flat class="q-ml-sm" @click.prevent="clients" />
        </div>
      </q-form>

    </q-page>

</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      password: '88888888',
      password_confirmation: '88888888',
      isPwd: true,
      email: 'modembfr@gmail.com',
      name: 'Mohamed'
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
        user: 'login'
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
