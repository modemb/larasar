<template>
    <q-page class="q-pa-md flex-center">

      <q-form class="q-gutter-md">
        <q-input v-model="email" filled type="email" :hint="$t('email')" />
        <div class="col-md-12">
          <q-btn color="primary" :label="$t('send_password_reset_link')" class="q-ma-sm" @click.prevent="send" />
        </div>
      </q-form>

    </q-page>
</template>

<script>
export default {
  name: 'resetPage',
  data () {
    return {
      email: ''
    }
  },
  methods: {
    async send () {
      const { data } = await this.$axios.post('/api/password/email', { email: this.email })
      alert(data.status)
    }
  }
}
</script>
