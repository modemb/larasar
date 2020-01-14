<template>

    <q-page class="q-pa-md flex-center">

      <q-form class="q-gutter-md">
        <q-input
          filled
          v-model="name"
          :label="$t('name')"
          :hint="name_data"
          lazy-rules
          :rules="[val => val && val.length > 0 || name_data]"
        />

        <q-input
          v-model="email"
          filled
          :label="$t('email')"
          type="email"
          :hint="email_data"
          lazy-rules
          :rules="[val => val && val.length > 0 || email_data]"
        />

        <q-input
          v-model="password"
          filled
          :label="$t('password')"
          type="password"
          :hint="password_data"
          lazy-rules
          :rules="[val => val && val.length > 0 || password_data]"
        />

        <q-input
          v-model="password_confirmation"
          filled
          :type="isPwd ? 'password' : 'text'"
          :label="$t('confirm_password')"
          >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div>
          <q-btn color="primary" :label="$t('register')" @click.prevent="register" />
        </div>
      </q-form>

    </q-page>

</template>

<script>
export default {
  name: 'registerPage',
  data () {
    return {
      name: null,
      name_data: null,
      email: null,
      email_data: null,
      password: null,
      password_data: null,
      password_confirmation: null,
      isPwd: true
    }
  },
  methods: {
    register () {
      this.$store.dispatch('users/registerAction', {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
        role: 'User',
        user: 'register',
        scope: ''
      })
        .catch(error => {
          console.log(error.response.data)
          // console.log(error.response.data.message)
          // console.log(error.response.data.errors.email[0])
          this.name_data = [error.response.data.errors.name][0] || error.response.data.message
          this.email_data = [error.response.data.errors.email][0] || error.response.data.message
          this.password_data = [error.response.data.errors.password][0] || error.response.data.message
        })
    }
  }
}
</script>
