<template>

  <q-page class="q-pa-md flex-center">
    <q-form class="q-gutter-md">
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
        <q-btn color="primary" :label="$t('reset_password')" @click.prevent="reset" />
      </div>
    </q-form>
  </q-page>

</template>

<script>
export default {
  name: 'resetPage',
  data () {
    return {
      token: '',
      email: '',
      password: '',
      isPwd: true,
      password_confirmation: ''
    }
  },
  created () {
    this.email = this.$route.query.email
    this.token = this.$route.params.token
  },
  methods: {
    async reset () {
<<<<<<< HEAD
      console.log({
        token: this.token,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      })
=======
>>>>>>> modemb/dev
      const { data } = await this.$axios.post('/api/password/reset', {
        token: this.token,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      })
      alert(data.status)
    }
  }
}
</script>
