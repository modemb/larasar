<template>
    <q-page class="q-pa-md flex-center">

<<<<<<< HEAD
      <q-form class="q-gutter-md">
=======
      <div class="q-gutter-md">
>>>>>>> modemb/dev
        <div class="row">

          <!-- Profile Info -->
          <div class="col-md-6 q-pa-md">

            <q-card class="my-card text-white">
              <q-card-section class="bg-primary">
                <div class="text-h6">{{$t('your_info')}}</div>
              </q-card-section>

<<<<<<< HEAD
              <form class="q-pa-md">

                <q-uploader
                  url="http://localhost/larasar/public/images/profile/default.jpg"
                  style="max-width: 300px"
                  class="q-mb-xl"
                />

                <q-input
                  filled
=======
              <q-form class="q-pa-md">

                <q-img
                  :src="user.new.avatar || url+'/'+user.avatar"
                  style="width: 100%"
                  class="q-mb-xl"
                  native-context-menu
                />

                <!-- <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
                <q-input type="file" v-model="avatar" />

                <q-uploader
                  style="max-width: 100%"
                  class="q-mb-xl"
                  label="Upload"
                  auto-upload
                  :factory="factoryFn"
                />

                <q-uploader
                  url='http://localhost/larasar/public/api/users/1'
                  method='PUT'
                  style="max-width: 100%"
                /> -->

                <q-input
                  filled
                  type="text"
>>>>>>> modemb/dev
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

<<<<<<< HEAD
              </form>
=======
              </q-form>
>>>>>>> modemb/dev

            </q-card>

          </div>
          <!-- Profile Info End -->
<<<<<<< HEAD
=======

>>>>>>> modemb/dev
          <!-- Password Reset -->
          <div class="col-md-6 q-pa-md">

            <q-card class="my-card text-white">
              <q-card-section class="bg-primary">
                <div class="text-h6">{{$t('your_password')}}</div>
              </q-card-section>

<<<<<<< HEAD
              <form class="q-pa-md">
=======
              <q-form class="q-pa-md">
>>>>>>> modemb/dev

                <q-input
                  filled
                  v-model="password"
                  :type="isPwd ? 'password' : 'text'"
                  :label="$t('your_password')"
                  :hint="password_data"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || $t('your_password')]"
                />

                <q-input
                  filled
                  :type="isPwd ? 'password' : 'text'"
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

<<<<<<< HEAD
              </form>
=======
              </q-form>
>>>>>>> modemb/dev

            </q-card>

          </div>
          <!-- Password Reset End -->

        </div>
<<<<<<< HEAD
      </q-form>
=======
      </div>
>>>>>>> modemb/dev

    </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
<<<<<<< HEAD
=======
const qs = params => Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
>>>>>>> modemb/dev

export default {
  name: 'updatePage',
  data () {
    return {
      name: null,
      email: null,
<<<<<<< HEAD
      password: null,
      new_password: null,
      password_confirmation: null,
      isPwd: true
=======
      avatar: null,
      password: null,
      new_password: null,
      password_confirmation: null,
      isPwd: true,
      file: '',
      url: process.env.DEV ? process.env.DEV_URL : process.env.API_URL
>>>>>>> modemb/dev
    }
  },
  computed: mapGetters({
    user: 'users/authGetter'
  }),
  methods: {
<<<<<<< HEAD
    info () {
      this.$store.dispatch('users/updateAction', {
        id: this.user.id,
        name: this.name,
        email: this.email
=======
    factoryFn (file) {
      return new Promise((resolve, reject) => {
        // Retrieve JWT token from your store.
        // const token = this.token
        // console.log(file[0])
        let fd = new FormData()
        fd.append('avatar', file)
        // fd.append('avatar', file[0])
        // fd = qs(file[0])
        // fd = { avatar: qs(file[0]) }
        // console.log(fd)
        resolve({
          url: `${this.url}/api/users/${this.user.id}?${qs(fd)}`,
          method: 'PUT'
          // headers: [
          //   { name: 'Content-Type', value: 'application/json-patch+json' }
          // ]
        })
>>>>>>> modemb/dev
      })
    },
    pwd () {
      this.$store.dispatch('users/updateAction', {
        pwd: true,
        id: this.user.id,
        password: this.password,
        new_password: this.new_password,
        password_confirmation: this.password_confirmation
      })
<<<<<<< HEAD
=======
    },
    handleFileUpload () {
      // console.log(this.$refs.file.files[0])
      this.file = this.$refs.file.files[0]
    },
    info () {
      // eslint-disable-next-line no-unused-vars
      const data = {
        id: this.user.id,
        name: this.name,
        email: this.email
        // avatar: this.avatar
      }
      const formData = new FormData()// ToFix
      formData.append('avatar', this.avatar)
      // console.log(formData, this.avatar)
      this.$store.dispatch('users/updateAction', { ...formData, ...data })
>>>>>>> modemb/dev
    }
  }
}
</script>
