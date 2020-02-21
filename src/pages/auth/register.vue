<template>

    <q-page class="q-pa-md">

      <q-form class="q-gutter-md">
        <div class="row flex justify-center">

          <div class="col-md-6 q-pa-md">

            <q-card class="my-card text-white">
              <q-card-section class="bg-primary">
                <div class="text-h6">{{$t('register')}}</div>
                <!-- <div class="text-subtitle2">by John Doe</div> -->
              </q-card-section>

              <div class="q-pa-md">

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

                <q-input
                  filled
                  v-model="password"
                  :label="$t('password')"
<<<<<<< HEAD
                  type="password"
=======
                  :type="isPwd ? 'password' : 'text'"
>>>>>>> modemb/dev
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

                <div class="q-pt-md">
                  <q-btn color="primary" :label="$t('register')" @click.prevent="register" />
                </div>

              </div>

            </q-card>

          </div>

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
        api: 'register',
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
