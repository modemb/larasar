<template>
    <q-page class="*flex flex-center q-pa-md">

      <div class="q-gutter-md">
        <div class="row">

          <!-- Profile Info -->
          <div class="col-md-6 q-pa-md">

            <q-card class="my-card text-white">
              <q-card-section class="bg-primary">
                <div class="text-h6">{{$t('your_info')}}</div>
              </q-card-section>

              <q-form class="q-pa-md">

                <q-card class="q-mb-md">
                  <q-img :src="avatar"/>
                  <!-- <q-card-section> -->
                    <input type="file" v-on:change="onImageChange" class="q-ma-lg">
                    <q-btn color="primary" class="q-ma-md" :label="$t('remove_image')" @click="deleteImage"/>
                  <!-- </q-card-section> --><!-- TagAvatar: UserModule -->
                </q-card>

                <!-- <q-img
                  :src="avatar"
                  style="width: 100%"
                  class="q-mb-xl"
                  native-context-menu
                />

                <q-card class="row q-mb-xl">
                    <div class="col-md-6">
                      <input type="file" v-on:change="onImageChange" class="q-ma-lg">
                    </div>
                    <div class="col-md-6">
                      <q-btn color="primary" class="q-ma-md" :label="$t('remove_image')" @click="deleteImage"/>
                    </div>
                </q-card> -->

                <!-- <q-uploader
                  style="max-width: 100%"
                  class="q-mb-xl"
                  label="Upload"
                  auto-upload
                  :factory="factoryFn"
                /> -->

                <q-input
                  filled
                  type="text"
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

              </q-form>

            </q-card>

          </div>
          <!-- Profile Info End -->

          <!-- Password Reset -->
          <div class="col-md-6 q-pa-md">

            <q-card class="my-card text-white">
              <q-card-section class="bg-primary">
                <div class="text-h6">{{$t('your_password')}}</div>
              </q-card-section>

              <q-form class="q-pa-md">

                <q-input
                  filled
                  v-model="password"
                  :type="isPwd ? 'password' : 'text'"
                  :label="$t('your_password')"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || $t('your_password')]"
                />

                <q-input
                  filled
                  :type="isPwd ? 'password' : 'text'"
                  v-model="new_password"
                  :label="$t('new_password')"
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

              </q-form>

            </q-card>

          </div>
          <!-- Password Reset End -->

        </div>
      </div>

    </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { url } from 'boot/axios'
// const qs = params => Object.keys(params).map(key => `${key}=${params[key]}`).join('&')

export default {
  name: 'ProfilePage',
  data () {
    return {
      name: null,
      email: null,
      password: null,
      new_password: null,
      password_confirmation: null,
      isPwd: true,
      file: '',
      url: url
    }
  },
  computed: {
    ...mapGetters({
      user: 'users/authGetter'
    }),
    avatar () {
      if (this.user.avatar) { // Stored Avatar
        if (this.user.avatar.includes('images/profile')) return this.url + '/' + this.user.avatar
        else return this.user.avatar // Social Avatar
      } else return this.user.new.avatar // Email Avatar
    }
  },
  methods: {
    info () {
      this.$store.dispatch('users/updateAction', {
        update: true,
        id: this.user.id,
        name: this.name,
        email: this.email,
        avatar: this.file
      })
    },
    pwd () {
      this.$store.dispatch('users/updateAction', {
        pwd: true,
        update: true,
        id: this.user.id,
        password: this.password,
        new_password: this.new_password,
        password_confirmation: this.password_confirmation
      })
    },
    onImageChange (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return; this.createImage(files[0])
    }, // TagAvatar: UserModule
    createImage (files) {
      // const formData = new FormData()// ToFix
      // formData.append('avatar', files)
      // console.log(formData, files)
      let reader = new FileReader()
      reader.onload = (e) => {
        this.file = e.target.result
      }; reader.readAsDataURL(files)
      setTimeout(() => { this.info() }, 500)
    },
    deleteImage () {
      this.$axios.delete(`api/users/${this.user.id}?avatar=delete`).then(response => {
        this.$store.dispatch('users/authAction')
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: this.$t(response.data.success),
          icon: 'check'
        })
      })
    }, // ============================================== \\
    factoryFn (files) {
      return new Promise((resolve, reject) => {
        // Retrieve JWT token from your store.
        // const token = this.token
        // console.log(files[0])
        // let fd = new FormData()
        // fd.append('avatar', file)
        // fd.append('avatar', file[0])
        // fd = qs(file[0])
        this.createImage(files[0])
        resolve(
          this.$axios.put(`api/users/${this.user.id}`, { avatar: this.avatar }).then(response => {
            if (response.data) {
              // alert(response.data)
              this.$q.notify({
                color: 'positive',
                position: 'top',
                message: this.$t(response.data),
                icon: 'check'
              })
            }
          })
        )
      })
    }, // NotInUse
    handleFileUpload () {
      // console.log(this.$refs.file.files[0])
      // this.image = this.$refs.file.files[0]
      this.createImage(this.$refs.file.files[0])
    } // NotInUse
  }
}
</script>
