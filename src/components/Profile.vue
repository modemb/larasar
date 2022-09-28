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
                        :label="$t('role')" clearable
                        :error="role_data ? true : false"
                        :error-message='role_data'
                      />
                      <q-input
                        filled
                        type="text"
                        v-model="name"
                        :label="$t('user_name')"
                        lazy-rules clearable
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
                        lazy-rules clearable
                        :rules="[val => val && val.length > 0 || $t('first_name')]"
                      />
                    </div>
                    <div class="col-6">
                      <q-input
                        filled
                        type="text"
                        v-model="last_name"
                        :label="$t('last_name')"
                        lazy-rules clearable
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
                    :error-message='address_data' clearable
                    :rules="[val => val && val.length > 0 || $t('add_address')]"
                  />

                  <div class="row">
                    <div class="col-6">
                      <q-input
                        lazy-rules
                        v-model="city"
                        filled type="text"
                        :label="$t('city')" clearable
                        :rules="[val => val && val.length > 0 || $t('add_city')]"
                      />
                    </div>
                    <div class="col-3">
                      <q-input
                        filled
                        lazy-rules
                        type="text"
                        v-model="region"
                        :label="$t('region')"
                        :error="region_data ? true : false"
                        :error-message='region_data' clearable
                        :rules="[val => val && val.length > 0 || $t('add_region')]"
                      />
                    </div>
                    <div class="col-3">
                      <q-input
                        filled
                        lazy-rules
                        type="text"
                        v-model="postal_code"
                        :label="$t('postal_code')"
                        :error="postal_code_data ? true : false"
                        :error-message='postal_code_data' clearable
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
                        lazy-rules clearable
                        :rules="[val => val && val.length > 0 || $t('add_country')]"
                      />
                    </div>
                    <div class="col-6">
                      <q-input
                        v-model="phone"
                        filled type="tel"
                        :label="$t('phone')"
                        lazy-rules clearable
                        :rules="[val => val && val.length > 0 || $t('add_phone')]"
                      />
                    </div>
                    <div class="col-6">
                      <q-btn color="primary" :label="$t('update')" @click.prevent="update" />
                    </div>
                    <div class="col-6" v-if="user">
                      <q-input v-model="gain" filled type="number"
                        :label="'Gain '+ cy(xRate(gain))" clearable
                      />
                    </div>

                  </div>

                </q-form>

              </q-card>

            </div><!-- Profile Info -->

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
                    lazy-rules v-if="!user" clearable
                    :rules="[val => val && val.length > 0 || $t('your_password')]"
                  />

                  <q-input
                    filled
                    :type="isPwd ? 'password' : 'text'"
                    v-model="new_password"
                    :label="$t('new_password')" clearable
                    lazy-rules :disable="update_email" :readonly="update_email"
                    :rules="[val => val && val.length > 0 || $t('new_password')]"
                  />

                  <q-input filled
                    v-model="password_confirmation"
                    :type="isPwd ? 'password' : 'text'"
                    :label="$t('confirm_password')" clearable
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
                    lazy-rules v-if="update_email" clearable
                    :rules="[val => val && val.length > 0 || $t('email')]"
                  /><!-- took off :val="auth.email" -->

                  <q-btn color="primary" :label="$t('update')" @click.prevent="pwd" />
                  <q-checkbox class="q-dark"  v-model="update_email" :label="$t('update_email')" />

                </q-form>

              </q-card><!-- Password Reset -->

              <q-separator vertical inset />

              <q-card class="my-card text-white">
                <q-card-section class="bg-primary">
                  <div class="text-h6">{{$t('Parameters')}}</div>
                </q-card-section>

                <div class="q-ma-sm">
                  <Checkout :profile="true" :user="auth" v-on:currency="save" />
                </div>

              </q-card><!-- Parameters -->

            </div><!-- Right Panel -->

          </div>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, computed, onMounted, watch } from 'vue'
// import { useRouter, useRoute } from 'vue-router'
import {  useStore } from 'vuex'
import { URL, api, xRate, cy, crudAction, notifyAction } from 'boot/axios'
import Checkout from './Checkout'

export default {
  name: 'ProfilePage',
  components: {
    Checkout
  }, props: ['user'],
  setup (props, { emit }) {
    const $q = useQuasar()
    // const route = useRoute()
    // const router = useRouter()
    // const addUser = ref(false)
    // const editUser = ref(false)
    // const user = ref(null)
    // const rows = ref([])
    const gain = ref(props.user?.gain)
    const user = ref(props.user)
    const $store = useStore()
    const auth = computed(() => user.value||$store.getters['users/authGetter'])
    const role = ref(auth.value?.role)
    const name = ref(null)
    const name_data = ref(null)
    const first_name = ref(auth.value?.first_name)
    const last_name = ref(auth.value?.last_name)
    const email = ref(auth.value?.email)
    const update_email = ref(false)
    const phone = ref(auth.value?.phone)
    const address = ref(auth.value?.address)
    const city = ref(auth.value?.city)
    const region = ref(auth.value?.region)
    const region_data = ref(auth.value?.region_data)
    const postal_code = ref(auth.value?.postal_code)
    const postal_code_data = ref(auth.value?.postal_code_data)
    const country = ref(auth.value?.country)
    const country_data = ref(auth.value?.country_data)
    const password = ref(null)
    const new_password = ref(null)
    const password_confirmation = ref(null)
    const isPwd = ref(true)
    const darkMode = ref($q.localStorage.getItem('darkMode'))

    const url = `api/users/${auth.value?.id}`

    watch(user, () => props.user||$store.dispatch('users/authAction'))

    onMounted(() => darkModeClass(darkMode.value))

    function darkModeClass(val) {
      const QDarkClass = document.querySelector('.q-dark')
      if (val==='null') val = false
      if (QDarkClass) QDarkClass.style.color = val?'#fff':'var(--q-dark)'
      if (QDarkClass) QDarkClass.style.background = val?'var(--q-dark)':'#fff'
    }

    function createImage (files) {
      // const formData = new FormData()// ToFix
      // formData.append('avatar', files)
      // console.log(formData, files)
      let reader = new FileReader()
      reader.onload = (e) => {
        setTimeout(() => {
          api({
            url, method: 'put',
            data: { update: true, avatar: e.target.result }
          }).then(res => {user.value = res.data.user; notifyAction(res.data)})
            .catch(e => notifyAction({error: 'createImage', e}))
        }, 500)//emit('reload', props.user),
      }; reader.readAsDataURL(files)
    }

    function update() {
      crudAction({
        url, method: 'put',
        update: true,
        gain: gain,
        role: role.value,
        name: name.value,
        first_name: first_name.value,
        last_name: last_name.value,
        phone: phone.value,
        address: address.value,
        city: city.value,
        region: region.value,
        postal_code: postal_code.value,
        country: country.value,
        // currency_code,
        // avatar: file.value
      }).then(() => emit('update', { usersData: 'users' }))
        .catch(error => name_data.value = error.response?.data?.errors?.name?.[0] ||
                                          error.response?.data?.message)
    }

    return {
      auth,
      role,
      name: ref(auth.value?.name),
      gain,
      xRate, cy,
      height: screen.height/($q.platform.is.mobile?1.2:1.35),
      locale: computed(() => $store.getters['config/localeGetter']),
      // height: ref(screen.height / 1.4),
      // user_name,
      name_data,
      first_name,
      last_name,
      email,
      update_email,
      phone,
      address,
      // address_data: ref(null),
      city,
      region,
      region_data,
      postal_code,
      postal_code_data,
      country,
      country_data,
      password,
      new_password,
      password_confirmation,
      isPwd,
      URL,
      admins: [
        'Admin', 'User', 'Editor'
      ],
      users: [
        'User', 'Editor'
      ],//NotInUse

      update, // TagUpdate: UserUpdate
      pwd() {
        crudAction({
          url, method: 'put',
          pwd: !props.user,
          update: true,
          email: email.value,
          update_email: update_email.value,
          password: props.user?false:password.value,
          update_password: props.user?new_password.value:false,//added
          new_password: new_password.value,
          password_confirmation: password_confirmation.value
        }).catch(e => notifyAction({error: 'passwordAction', e}))
      },
      avatar: computed(() => {
        if (auth.value?.avatar) { // Stored Avatar
          if (auth.value?.avatar.includes('images/profile')) return URL + '/' + auth.value?.avatar
          else return auth.value?.avatar // Social Avatar
        } else return auth.value?.new.avatar // Email Avatar
      }),
      onImageChange(e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return; createImage(files[0])
      }, // TagAvatar: UserModule
      deleteAvatar() {
        crudAction({
          url, method: 'delete',
          delete_avatar: 1
        }).then(res => user.value = res.user)
          .catch(e => notifyAction({error: 'deleteAvatar', e}))
      }, // ============================================== \\
      imgSize() {
        // var currWidth = file.width
        // var currHeight = file.height
      } // TODO http://image.intervention.io/api/filesize
    }
  }
}
</script>
