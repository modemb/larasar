<template>

    <q-page class="q-pa-md flex-center">

      <q-form class="q-gutter-md">
        <div class="row">

          <div class="col-md-6 q-pa-md">

            <q-card class="my-card text-white">
              <q-card-section class="bg-primary">
                <div class="text-h6">{{$t('your_info')}}</div>
                <!-- <div class="text-subtitle2">by John Doe</div> -->
              </q-card-section>

              <div class="q-pa-md">

                <q-uploader
                  url="http://localhost:8080/upload"
                  style="max-width: 300px"
                  class="q-mb-xl"
                />

                <q-input
                  filled
                  v-model="name"
                  :label="$t('name')"
                  :hint="name_data"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || name_data]"
                />

                <q-input
                  filled
                  v-model="email"
                  :label="$t('email')"
                  type="email"
                  :hint="email_data"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || email_data]"
                />

                <q-btn color="primary" :label="$t('update')" @click.prevent="update" />

              </div>

            </q-card>

          </div>

          <div class="col-md-6 q-pa-md">

            <q-card class="my-card text-white">
              <q-card-section class="bg-primary">
                <div class="text-h6">{{$t('your_password')}}</div>
                <!-- <div class="text-subtitle2">by John Doe</div> -->
              </q-card-section>

              <div class="q-pa-md">

                <q-input
                  filled
                  v-model="name"
                  type="password"
                  :label="$t('Current Password')"
                  :hint="name_data"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || name_data]"
                />

                <q-input
                  filled
                  v-model="email"
                  :label="$t('New Password')"
                  type="password"
                  :hint="email_data"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || email_data]"
                />

                <q-input
                  v-model="password_confirmation"
                  filled
                  :type="isPwd ? 'password' : 'text'"
                  :label="$t('Confirm New Password')"
                  :hint="password_data"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || password_data]"
                  >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>

                <q-btn color="primary" :label="$t('update')" @click.prevent="update" />

              </div>

            </q-card>

          </div>

        </div>
      </q-form>

    </q-page>

</template>

<script>
export default {
  name: 'updatePage',
  meta () {
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
    update () {
      this.$store.dispatch('users/updateAction', {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
        role: 'User',
        user: 'update',
        scope: ''
      })
        .catch(error => {
          this.name_data = [error.response.data.errors.name][0] || error.response.data.message
          this.email_data = [error.response.data.errors.email][0] || error.response.data.message
          this.password_data = [error.response.data.errors.password][0] || error.response.data.message
        })
    }
  }
}
</script>
