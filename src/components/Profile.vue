<template>
  <q-layout view="lHh lpr lFf" container :style="'height:' + height + 'px'" class="shadow-2 rounded-borders">
    <q-header elevated v-if="user">
      <q-bar>
        <q-icon name="fas fa-user" />
        <div>{{$t('profile')}}</div>

        <q-space />

        <!-- <q-btn dense flat icon="minimize" />
        <q-btn dense flat icon="crop_square" /> -->
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>
    </q-header>

    <q-page-container>
      <q-page class="flex flex-center q-pa-md">

        <div class="q-gutter-md">
          <div class="row">

            <!-- Profile Info -->
            <div class="col-md-6 q-pa-sm">

              <q-card class="my-card text-white">
                <q-card-section class="bg-primary">
                  <div class="text-h6">{{$t('your_info')}}</div>
                </q-card-section>

                <q-form class="q-pa-sm">

                  <q-card class="q-mb-md">
                    <q-img :src="avatar" id="sky"/>
                    <!-- <q-card-section> -->
                      <input type="file" v-on:change="onImageChange" class="q-ma-lg">
                      <q-btn color="primary" class="q-ma-md" :label="$t('remove_image')" @click="deleteAvatar"/>
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
                        <q-btn color="primary" class="q-ma-md" :label="$t('remove_image')" @click="deleteAvatar"/>
                      </div>
                  </q-card> -->

                  <div class="row">
                    <div class="col-12">
                      <q-select
                        filled class="col-12"
                        v-model="role" v-if="user"
                        :options="admins"
                        :label="$t('role')"
                        :error="role_data ? true : false"
                        :error-message='role_data'
                      />
                      <q-input
                        filled
                        type="text"
                        v-model="name"
                        :label="user_name||$t('user_name')"
                        lazy-rules
                        :rules="[val => val && val.length > 0 || $t('user_name')]"
                        :error="name_data ? true : false"
                        :error-message="name_data"
                      />
                    </div>
                    <div class="col-6">
                      <q-input
                        filled
                        type="text"
                        v-model="first_name"
                        :label="$t('first_name')"
                        lazy-rules
                        :rules="[val => val && val.length > 0 || $t('first_name')]"
                      />
                    </div>
                    <div class="col-6">
                      <q-input
                        filled
                        type="text"
                        v-model="last_name"
                        :label="$t('last_name')"
                        lazy-rules
                        :rules="[val => val && val.length > 0 || $t('last_name')]"
                      />
                    </div>
                  </div>

                  <q-input
                    filled
                    type="text"
                    v-model="address"
                    :label="$t('address')"
                    :error="address_data ? true : false"
                    :error-message='address_data'
                    :rules="[val => val && val.length > 0 || $t('add_address')]"
                  />

                  <div class="row">
                    <div class="col-8">
                      <q-input
                        lazy-rules
                        v-model="city"
                        filled type="text"
                        :label="$t('city')"
                        :rules="[val => val && val.length > 0 || $t('add_city')]"
                      />
                    </div>
                    <div class="col-4">
                      <q-input
                        filled
                        lazy-rules
                        type="text"
                        v-model="postal_code"
                        :label="$t('postal_code')"
                        :error="postal_code_data ? true : false"
                        :error-message='postal_code_data'
                        :rules="[val => val && val.length > 0 || $t('add_postal_code')]"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-6">
                      <q-input
                        v-model="country"
                        filled type="text"
                        :label="$t('country')"
                        lazy-rules
                        :rules="[val => val && val.length > 0 || $t('add_country')]"
                      />
                    </div>
                    <div class="col-6">
                      <q-input
                        v-model="phone"
                        filled type="tel"
                        :label="$t('phone')"
                        lazy-rules
                        :rules="[val => val && val.length > 0 || $t('add_phone')]"
                      />
                    </div>
                  </div>

                  <q-btn color="primary" :label="$t('update')" @click.prevent="update" />
                  <!-- <q-btn color="primary" :label="$t('update')" @click.prevent="info" /> -->

                </q-form>

              </q-card>

            </div><!-- Profile Info End -->

            <!-- Password Reset -->
            <div class="col-md-6 q-pa-sm">

              <q-card class="my-card text-white">
                <q-card-section class="bg-primary">
                  <div class="text-h6">{{$t('your_password')}}</div>
                </q-card-section>

                <q-form class="q-pa-sm">

                  <q-input
                    filled
                    v-model="password"
                    :type="isPwd ? 'password' : 'text'"
                    :label="$t('your_password')"
                    lazy-rules v-if="!user"
                    :rules="[val => val && val.length > 0 || $t('your_password')]"
                  />

                  <q-input
                    filled
                    :type="isPwd ? 'password' : 'text'"
                    v-model="new_password"
                    :label="$t('new_password')"
                    lazy-rules :disable="update_email" :readonly="update_email"
                    :rules="[val => val && val.length > 0 || $t('new_password')]"
                  />

                  <q-input
                    filled
                    v-model="password_confirmation"
                    :type="isPwd ? 'password' : 'text'"
                    :label="$t('confirm_password')"
                    lazy-rules :disable="update_email" :readonly="update_email"
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
                  <q-input
                    filled
                    type="email"
                    v-model="email"
                    :label="$t('email')"
                    lazy-rules v-if="update_email"
                    :rules="[val => val && val.length > 0 || $t('email')]"
                  /><!-- took off :val="auth.email" -->

                  <q-btn color="primary" :label="$t('update')" @click.prevent="pwd" />
                  <q-checkbox class="text-black"  v-model="update_email" :label="$t('update_email')" />

                </q-form>

              </q-card>

            </div><!-- Password Reset End -->

          </div>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, computed, watch } from 'vue'
// import { useRouter, useRoute } from 'vue-router'
import {  useStore } from 'vuex'
import { url, api, crudAction, notifyAction } from 'boot/axios'

export default {
  name: 'ProfilePage',
  props: ['user'],
  setup (props) {
    const $q = useQuasar()
    // const route = useRoute()
    // const router = useRouter()
    // const addUser = ref(false)
    // const editUser = ref(false)
    // const user = ref(null)
    // const rows = ref([])
    // const usersData = ref('users')
    const user = ref(props.user)
    const $store = useStore()
    const auth = computed(() => user.value||$store.getters['users/authGetter'])
    const role = ref(auth.value.role)
    const name = ref(null)
    // const user_name = ref(auth.value.name)
    const name_data = ref(null)
    const first_name = ref(auth.value.first_name)
    const last_name = ref(auth.value.last_name)
    const email = ref(auth.value.email)
    const update_email = ref(false)
    const phone = ref(auth.value.phone)
    const address = ref(auth.value.address)
    // const address_data = ref(auth.address_data)
    const city = ref(auth.value.city)
    const postal_code = ref(auth.value.postal_code)
    const postal_code_data = ref(auth.value.postal_code_data)
    const country = ref(auth.value.country)
    const country_data = ref(auth.value.country_data)
    const password = ref(null)
    const new_password = ref(null)
    const password_confirmation = ref(null)
    const isPwd = ref(true)

    watch(user, () => props.user||$store.dispatch('users/authAction'))

    // function reloadUsers () {
    //   return $store.dispatch('users/usersAction', { usersData: 'users' })
    // }

    function createImage (files) {
      // const formData = new FormData()// ToFix
      // formData.append('avatar', files)
      // console.log(formData, files)
      let reader = new FileReader()
      reader.onload = (e) => {
        setTimeout(() => {
          api({
            url: 'api/users/' + auth.value.id,
            method: 'put',
            data: { update: true, avatar: e.target.result }
          }).then(res => {user.value = res.data.user; notifyAction(res.data)})
            .catch(e => notifyAction({error: 'createImage', e}))
        }, 500)//emit('reload', props.user),
      }; reader.readAsDataURL(files)
    }

    function update () {
      crudAction({
        // $store.dispatch('users/updateAction', {
        url: 'api/users/' + auth.value.id,
        method: 'put',
        update: true,
        // id: auth.id,
        role: role.value,
        name: name.value,
        first_name: first_name.value,
        last_name: last_name.value,
        phone: phone.value,
        address: address.value,
        city: city.value,
        postal_code: postal_code.value,
        country: country.value,
        // avatar: file.value
      }).then($store.dispatch('users/usersAction', { usersData: 'users' })).catch(error => {
        try { name_data.value = error.response.data.errors.name[0] || error.response.data.message } catch (e) { name_data.value = null }
      })
    }

    return {
      auth,
      role,
      name,
      height: screen.height/($q.platform.is.mobile?1.2:1.35),
      // height: ref(screen.height / 1.4),
      user_name: ref(auth.value.name),
      name_data,
      first_name,
      last_name,
      email,
      update_email,
      phone,
      address,
      // address_data: ref(null),
      city,
      postal_code,
      postal_code_data,
      country,
      country_data,
      password,
      new_password,
      password_confirmation,
      isPwd,
      url,
      admins: [
        'Admin', 'User', 'Editor'
      ],
      users: [
        'User', 'Editor'
      ],//NotInUse

      avatar: computed(() => {
        if (auth.value?.avatar) { // Stored Avatar
          if (auth.value.avatar.includes('images/profile')) return url + '/' + auth.value.avatar
          else return auth.value.avatar // Social Avatar
        } else return auth.value.new.avatar // Email Avatar
      }),
      update, // TagUpdate: UserUpdate
      pwd () {
        $store.dispatch('users/updateAction', {
          pwd: !props.user,
          // pwd: true,
          update: true,
          id: auth.value.id,
          email: email.value,
          update_email: update_email.value,
          password: props.user?false:password.value,
          update_password: props.user?new_password.value:false,//added
          new_password: new_password.value,
          password_confirmation: password_confirmation.value
        })
      },
      imgSize () {
        // var currWidth = file.width
        // var currHeight = file.height
      }, // TODO http://image.intervention.io/api/filesize
      onImageChange (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return; createImage(files[0])
      }, // TagAvatar: UserModule
      deleteAvatar () {
        crudAction({
          url: `api/users/${auth.value.id}`,
          method: 'delete',
          delete_avatar: 1
        }).then(res => user.value = res.user)
          .catch(e => notifyAction({error: 'deleteAvatar', e}))
      } // ============================================== \\
    }
  }
}
</script>
