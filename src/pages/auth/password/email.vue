<template>
    <q-page class="q-pa-md flex-center">

      <q-form class="q-gutter-md">
        <q-input
          v-model="email"
          filled
          type="email"
          :label="$t('email')"
          :hint="email_data"
          lazy-rules
          :rules="[val => val && val.length > 0 || email_data,
            val => val !== null && val !== '' || email_data]"
        />
        <div class="col-md-12">
          <q-btn color="primary" :label="$t('send_password_reset_link')" class="q-ma-sm" @click.prevent="send" />
        </div>
      </q-form>

    </q-page>
</template>

<script>
import { locale } from 'boot/axios'

export default {
  name: 'resetPage',
  data () {
    return {
      email: '',
      email_data: ''
    }
  },
  methods: {
    async send () {
      const { data } = await this.$axios.post('/api/password/email', {
        email: this.email,
        locale: locale
      })
        .catch(error => {
          this.email_data = error.response.data.email || error.response.data.errors.email[0]
        })
      alert(data.status)
    }
  }
}
</script>
