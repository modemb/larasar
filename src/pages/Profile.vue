<template>

    <q-page class="q-pa-md flex-center">

      <q-form class="q-gutter-md">
        <div class="row">

          <!-- Profile Info -->
          <div class="col-md-6 q-pa-md">

            <q-card class="my-card text-white">
              <q-card-section class="bg-primary">
                <div class="text-h6">{{$t('your_info')}}</div>
              </q-card-section>

              <form class="q-pa-md">

                <q-uploader
                  url="http://localhost/larasar/public"
                  style="max-width: 300px"
                  class="q-mb-xl"
                />

                <q-input
                  filled
                  v-model="name"
                  :label="user.name || $t('name')"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || $t('name')]"
                />

                <!-- <q-input
                  v-model="tel"
                  filled type="tel"
                  :label="user.phone || $t('phone')"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || $t('add_phone')]"
                /> -->

                <q-input
                  filled
                  type="email"
                  v-model="email"
                  :label="user.email || $t('email')"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || $t('email')]"
                />

                <q-btn color="primary" :label="$t('update')" @click.prevent="info" />

              </form>

            </q-card>

          </div>
          <!-- Profile Info End -->
          <!-- Password Reset -->
          <div class="col-md-6 q-pa-md">

            <q-card class="my-card text-white">
              <q-card-section class="bg-primary">
                <div class="text-h6">{{$t('your_password')}}</div>
              </q-card-section>

              <form class="q-pa-md">

                <q-input
                  filled
                  v-model="password"
                  type="password"
                  :label="$t('your_password')"
                  :hint="password_data"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || $t('your_password')]"
                />

                <q-input
                  filled
                  type="password"
                  v-model="new_password"
                  :label="$t('new_password')"
                  :hint="new_password_data"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || $t('new_password')]"
                />

                <q-input
                  filled
                  v-model="password_confirmation"
                  :type="isPwd ? 'password' : 'text'"
                  :label="$t('confirm_password')"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || $t('confirm_password')]"
                  >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>

                <q-btn color="primary" :label="$t('update')" @click.prevent="pwd" />

              </form>

            </q-card>

          </div>
          <!-- Password Reset End -->

        </div>
      </q-form>

    </q-page>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'updatePage',
  meta () {
    return {
      name: null,
      email: null,
      password: null,
      password_confirmation: null,
      new_password: null,
      isPwd: true
    }
  },
  computed: mapGetters({
    user: 'users/authGetter'
  }),
  methods: {
    info () {
      this.$store.dispatch('users/updateAction', {
        id: this.user.id,
        name: this.name,
        email: this.email
      })
    },
    pwd () {
      this.$store.dispatch('users/updateAction', {
        id: this.user.id,
        password: this.password,
        password_confirmation: this.password_confirmation
      })
    }
  }
}
</script>
