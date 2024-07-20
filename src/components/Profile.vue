<template>

  <q-dialog v-model="filesLibrary"><!-- TagFiles =============-->
    <!-- <q-card class="my-card col-12" style="width:100%; max-width: 1000px"> -->
      <UserFiles  :avatar="true" />
    <!-- </q-card>TagFiles: FilesModule v-on:reloadAv="reloadAv" -->
  </q-dialog><!--====================== TagFiles End =========-->

  <q-layout view="lHh lpr lFf" container :style="'height:' + height + 'px'" class="shadow-2 rounded-borders">
    <q-header elevated v-if="props.user">
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

              <q-card class="my-card">
                <q-card-section class="bg-primary text-white">
                  <div class="text-h6">{{ $t('your_info') }}</div>
                </q-card-section>

                <q-form class="q-pa-sm" @keyup.enter="update">

                  <q-card class="row text-center q-mb-md">
                    <q-card-section class="col-md-6">
                      <q-avatar size="300px">
                        <!-- <img :src="avatar" class="col-md-6"> -->
                        <q-img id="sky" height="300px"
                          :src="avatar" style="cursor: pointer;"
                          @click.prevent="filesLibrary = true"
                        /><!-- TagAvatar: UserModule -->
                      </q-avatar>
                    </q-card-section><!-- <q-separator dark /> -->

                    <q-card-section class="col-md-6">

                      <!-- <q-btn _v-if="ipDebug"
                        color="primary" class="q-ma-md"
                        :label="$t('library')"
                        icon="fas fa-photo-video"
                        @click.prevent="filesLibrary = true"
                      />TagFiles: FilesModule -->

                      <q-btn color="primary" class="q-ma-md" v-if="mobileApp"
                        icon="fas fa-camera" @click="async () => storeAV([await takePicture()])"
                      /><!-- TagTakePhotoApp: UserUpdate -->
                      <q-input filled clearable type="file" v-else
                        @update:model-value="(val: any) => readFile(val[0])"
                      /><!-- TagTakePhoto: UserUpdate <input type="file" v-on:change="onImageChange" class="q-ma-lg"/> -->

                      <!-- <q-input filled type="file" clearable
                        @update:model-value="(val: any) => storeAV(val[0])"
                      /> -->

                      <q-btn color="primary" class="q-ma-md" @click="deleteAvatar" :label="$t('remove_image')" />

                      <div>
                        <Share :shareData="shareData" />
                        <q-btn dense color="primary" class="q-ma-md" :label="cy(xRate(auth?.gain))">
                          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                            {{$t('gain_tooltip')}}
                          </q-tooltip>
                        </q-btn><!-- TagPayment: GainModule -->
                      </div><!-- TagPayment -->

                    </q-card-section><!-- TagAvatar: UserModule -->
                  </q-card><!-- https://quasar.dev/vue-components/input/#example--input-of-file-type -->

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
                    <div class="col-12" v-if="user">
                      <q-select
                        filled
                        v-model="role"
                        :options="admins"
                        :label="$t('role')" clearable
                      /><br/>
                    </div><!-- role -->
                    <div class="col-12" v-if="!auth?.[0]?.host_id">
                      <q-input
                        filled
                        type="text"
                        v-model="hostUserName"
                        lazy-rules clearable
                        :label="$t('Affiliate Code')"
                        :rules="[(val: string | any[]) => val && val.length > 0 || $t('user_name')]"
                        :hint="$t('Add The Code To Earn Money')"
                        :error="hostUserName_data ? true : false"
                        :error-message="hostUserName_data"
                      /><!-- TagPayment: HostUserName -->
                    </div><!-- hostUserName -->
                    <div class="col-12">
                      <q-input
                        filled
                        type="text"
                        v-model="name"
                        lazy-rules clearable
                        :label="user_name||$t('user_name')"
                        :rules="[(val: string | any[]) => val && val.length > 0 || $t('user_name')]"
                        :error="name_data ? true : false"
                        :error-message="name_data"
                      ><!-- TagUsername: UserModule -->
                        <q-btn dense flat round icon="fas fa-question" class="q-ma-md">
                          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-h6">
                            {{$t('To gain users and earn money, you can share your username, as your affiliate code. When new users sign up using this code, you\'ll earn a percentage of their spending.')}} |
                            <!-- {{$t('Share and earn credit with your affiliate link')}} {{ 'suguffie.com/'+auth.name }} -->
                          </q-tooltip>
                        </q-btn><!-- TagShare: ShareModule -->
                      </q-input>
                    </div><!-- name -->
                    <div class="col-6">
                      <q-input
                        filled
                        type="text"
                        v-model="first_name"
                        :label="$t('first_name')"
                        lazy-rules clearable
                        :rules="[(val: string | any[]) => val && val.length > 0 || $t('first_name')]"
                      />
                    </div><!-- first_name -->
                    <div class="col-6">
                      <q-input
                        filled
                        type="text"
                        v-model="last_name"
                        :label="$t('last_name')"
                        lazy-rules clearable
                        :rules="[(val: string | any[]) => val && val.length > 0 || $t('last_name')]"
                      />
                    </div><!-- last_name -->
                  </div><!--  -->

                  <q-input
                    filled
                    type="text"
                    v-model="address"
                    :label="$t('address')"
                    :error="address_data ? true : false"
                    :error-message='address_data' clearable
                    :rules="[(val: string | any[]) => val && val.length > 0 || $t('add_address')]"
                  /><!-- address -->

                  <div class="row">
                    <div class="col-4">
                      <q-input
                        lazy-rules
                        v-model="city"
                        filled type="text"
                        :label="$t('city')" clearable
                        :rules="[(val: string | any[]) => val && val.length > 0 || $t('add_city')]"
                      />
                    </div><!-- city -->
                    <div class="col-4">
                      <q-input
                        filled
                        lazy-rules
                        type="text"
                        v-model="region"
                        :label="$t('region')"
                        :error="region_data ? true : false"
                        :error-message='region_data' clearable
                        :rules="[(val: string | any[]) => val && val.length > 0 || $t('add_region')]"
                      />
                    </div><!-- region -->
                    <div class="col-4">
                      <q-input
                        filled
                        lazy-rules
                        type="text"
                        v-model="postal_code"
                        :label="$t('postal_code')"
                        :error="postal_code_data ? true : false"
                        :error-message='postal_code_data' clearable
                        :rules="[(val: string | any[]) => val && val.length > 0 || $t('add_postal_code')]"
                      />
                    </div><!-- postal_code -->
                  </div><!--  -->

                  <div class="row">
                    <div class="col-6">
                      <q-input
                        v-model="country"
                        filled type="text"
                        :label="$t('country')"
                        lazy-rules clearable
                        :rules="[(val: string | any[]) => val && val.length > 0 || $t('add_country')]"
                      />
                    </div><!-- country -->
                    <div class="col-6">
                      <q-input
                        v-model="phone"
                        filled type="tel"
                        :label="$t('phone')"
                        :hint="$t('Including area code')" lazy-rules clearable
                        :rules="[(val: string | any[]) => val && val.length > 0 || $t('add_phone')]"
                      />
                    </div><!-- phone -->
                    <div class="col-3">
                      <q-btn color="primary" :label="$t('update')" @click.prevent="update" />
                    </div><!-- update -->
                    <div class="col-9" v-if="user&&superAdmin">
                      <q-input v-model="gain" filled type="number"
                        :label="'Gain '+ cy(xRate(gain))" clearable
                      /><!-- TagPayment: GainModule -->
                    </div><!-- Users Popup -->
                    <div class="col-9" v-else-if="ipDebug">
                      <q-input v-model="table" filled type="text"
                        label="Fix Table" clearable
                      /><!-- TagFixTable -->
                    </div><!-- table -->
                    <div class="col-9 *q-pb-md" v-else>
                      <q-input clearable
                        v-model="credit" filled type="text"
                        :label="`${$t('Credit')} ${cy(xRate(auth.credit))} --> ${$t('Gain')} ${cy(xRate(auth.gain))}`"
                        :hint="$t('Add from your credit to money earned to pay for plans')"
                      ><!-- TagPayment: CreditModule -->
                      </q-input><br/>
                    </div><!-- credit -->

                  </div><!--  -->

                </q-form><!--  -->

              </q-card><!--  -->

            </div><!-- Profile Info -->

            <div class="col-md-6 q-pa-sm">

              <q-card class="my-card">
                <q-card-section class="bg-primary text-white">
                  <div class="text-h6">{{$t('your_password')}}</div>
                </q-card-section>

                <q-form class="q-pa-sm" @keyup.enter="pwd">

                  <q-input
                    filled
                    v-model="password"
                    :type="isPwd ? 'password' : 'text'"
                    :label="$t('your_password')"
                    lazy-rules v-if="!user" clearable
                    :rules="[(val: string | any[]) => val && val.length > 0 || $t('your_password')]"
                  />

                  <q-input filled
                    :type="isPwd ? 'password' : 'text'"
                    v-model="new_password"
                    :label="$t('new_password')" clearable
                    lazy-rules :disable="update_email||delete_account"
                    :rules="[(val: string | any[]) => val && val.length > 0 || $t('new_password')]"
                  /><!-- :disable="update_email" -->

                  <q-input filled
                    v-model="password_confirmation"
                    :type="isPwd ? 'password' : 'text'"
                    :label="$t('confirm_password')" clearable
                    lazy-rules :disable="update_email||delete_account"
                    :rules="[(val: string | any[]) => val && val.length > 0 || $t('confirm_password')]"
                    ><!-- :readonly="update_email" -->
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
                    :rules="[(val: string | any[]) => val && val.length > 0 || $t('email')]"
                  /><!-- took off :val="auth.email" -->

                  <span v-if="!delete_account">
                    <q-btn color="primary" class="q-ma-sm" :label="$t('update')" @click.prevent="pwd" />
                    <q-checkbox v-model="update_email" :label="$t('update_email')" />
                  </span>
                  <q-btn color="red" v-else
                    :label="$t('delete_account')"
                    @click.prevent="pwd"
                  /><!-- Delete Your Account -->

                  <q-checkbox class="q-ma-sm" v-model="delete_account" :label="$t('delete_account')" />

                </q-form>

              </q-card><!-- Password Reset -->

              <q-separator vertical inset />

              <q-card class="my-card">
                <q-card-section class="bg-primary text-white">
                  <select v-model="locale" class="float-right" v-if="ipDebug">
                    <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
                      {{ locale }}<!-- <select v-model="$i18n.locale"> -->
                    </option>
                  </select><!-- TagLocale: LocaleUserModule -->
                  <div class="text-h6">{{$t('settings')}}</div>
                </q-card-section>

                <div class="row q-ma-sm">

                  <div class="col-xs-12 col-md-4">

                    <Checkout
                      :profile="true"
                      :user="auth" filled
                      v-on:currency="$emit('update', { usersData: 'users' })"
                    /><!-- Update Users Currency^^^ -->

                  </div>
                  <div class="col-xs-12 col-md-8">

                    <q-input type="text" filled
                      v-model="ip" v-if="auth?.role === 'Admin'"
                      :label="$t('IP Address')" clearable
                      ><!-- IP Address -->
                      <q-btn :color="ipEqual?'red':'grey'"
                        label="IP" @click="getIP"
                      /><!-- TagIpDebug: IpDebugModule -->
                    </q-input><br/>

                  </div>

                </div>

              </q-card><!-- Settings -->

            </div><!-- Right Panel -->

          </div>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>

</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref, computed, onMounted, watch } from 'vue'
import { authAction, mobileApp, baseURL, ipData, configAction, shareMutation, xRate, cy , api, i18n, filesMutation} from 'boot/axios'
import { takePicture } from './Functions'
import { useCrudStore } from 'stores/crud'
import Checkout from './UserCheckout.vue'
import UserFiles from './UserFiles.vue'
import Share from 'components/UserShare.vue'

/**
 * Tags: IpDebugModule - CreditModule - GainModule
 *       TagTakePhoto - TagFixTable - TagPayment
 *
 * @to
 */
// export default {
  // name: 'ProfilePage',

  defineOptions({
    name: 'ProfilePage'
  })
  // components: {
  //   Checkout,
  //   UserFiles
  // },
  // props: ['user'],
  // setup (props, { emit }) {

    const emit = defineEmits(['update']);

    const props = defineProps(['user'])

    const $q = useQuasar()
    const store = useCrudStore()
    const { crudAction, notifyAction } = store
    const table = ref(null)
    const gain = ref(props.user?.gain)
    const credit = ref(props.user?.credit)
    const user = ref(props.user||store.authGetter)
    const auth = computed(() => user.value)
    const role = ref(auth.value?.role)
    const name = ref('')
    const name_data = ref('')
    const user_name = ref(auth.value?.name)
    const first_name = ref(auth.value?.first_name)
    const last_name = ref(auth.value?.last_name)
    const email = ref(auth.value?.email)
    const update_email = ref(false)
    const delete_account = ref(false)
    const phone = ref(auth.value?.phone)
    const address = ref(auth.value?.address)
    const address_data = ref('')
    const city = ref(auth.value?.city)
    const region = ref(auth.value?.region)
    const region_data = ref(auth.value?.region_data)
    const postal_code = ref(auth.value?.postal_code)
    const postal_code_data = ref(auth.value?.postal_code_data)
    const country = ref(auth.value?.country)
    // const country_data = ref(auth.value?.country_data)
    const password = ref(null)
    const new_password = ref(null)
    const password_confirmation = ref(null)
    const isPwd = ref(true)
    const locale = ref(auth.value?.locale)
    const ip = ref<string | null >($q.localStorage.getItem('ip'))
    const filesLibrary = ref(false)
    const hostUserName = ref('')
    const hostUserName_data = ref(auth.value?.hostUserName_data)

    const shareData = computed(() => store.shareDataGetter?.shareData)
    const ipEqual = computed(() => store.ipGetter?.ip === ipData?.ip)
    const superAdmin = computed(() => store.authGetter?.id === 1)
    const ipDebug = computed(() => store.configGetter?.ipDebug)
    const file = computed(() => store.filesGetter?.array)
    const avatar = computed(() => {
      if (auth.value?.avatar) {
        if (auth.value?.avatar.includes('files/')) return baseURL + '/' + auth.value?.avatar
        else return auth.value?.avatar // Social Avatar
      } else return auth.value?.new?.avatar // Email Avatar
    }) // Show Avatar

    // const ios = capacitor()?.Capacitor?.getPlatform()==='ios' // -> 'web', 'ios' or 'android'
    // const modembIos = navigator.userAgent.match(/(modembIos)/)
    // const height = ref(screen.height / 1.4)
    const height = ref(screen.height/($q.platform.is.mobile?1.2:1.35))
    const url = `api/users/${auth.value?.id}`
    const admins = [
      'Admin', 'User', 'Editor'
    ]

    // const reloadAv = () => authAction()
    const getIP = () => ip.value = ipData?.ip
    const storeAV = (avatar: string[]) => crudAction({
      url, method: 'put', update: true, avatar, refresh: ['reloadApp']
    }).then(( data: { user: object } ) => {
      if (props.user) user.value = data.user
      else store.authGetter = user.value = data.user
    }).catch((e: unknown) => notifyAction({error: 'storeAV', e}))

    watch(file, val => storeAV(val))
    watch([locale, ip], (val, oldVal) => {
      if (val[0] !== oldVal[0]) {
        setTimeout(() => props.user?emit('update', { usersData: 'users' }):
          authAction(), 1500); i18n.global.locale.value = val[0]
        store.authGetter.id = auth.value?.id // PopUp User
      } else $q.localStorage.set('ip', store.ipGetter.ip = val[1])

      configAction() // Master Locale Setting / Load ipDebug onMounted
    }) // TagLocale: LocaleUserModule - TagIpDebug: IpDebugModule

    onMounted(() => {
      const currency = auth.value.currency_code
      store.rateGetter = auth.value.rate
      shareMutation(auth.value)
      crudAction({ currency, mutate: 'currencyGetter', refresh: ['currencyGetter'] })
    })

    const readFile = (file: Blob) => filesMutation([file]) // TagReadFiles: FileModule

    function _readFiles(file: Blob) {
      // const formData = new FormData()// ToFix
      // formData.append('avatar', file)
      // console.log(formData, file)
      // return storeAV(file)

      const reader = new FileReader(); console.log('reader', reader)
      reader.onload = async (e) => storeAV([`${e.target?.result}`])
      reader.readAsDataURL(file)
    } // TagAvatar: UserModule

    function update() {
      api({ url, method: 'put', data: {
        hostUserName: hostUserName.value, // fixHere
        authCode: hostUserName.value?true:'',
        ip: hostUserName.value?ipData?.ip:'',
        id: hostUserName.value?auth.value?.id:'',

        update: true,
        table: table.value,
        gain: gain.value,
        credit: credit.value,
        role: role.value,
        name: name.value,
        first_name: first_name.value,
        last_name: last_name.value,
        phone: phone.value,
        address: address.value,
        city: city.value,
        region: region.value,
        postal_code: postal_code.value,
        country: country.value }
      }).then(({ data }) => notifyAction(data)).then(() => xRate(authAction()))
        .then(() => emit('update', { refresh: ['reloadApp'] }))
        .catch((error: { response: { data: { errors: { name: never[] }; message: never } } }) =>
          name_data.value = error.response?.data?.errors?.name?.[0] || error.response?.data?.message)
    } // TagUpdate: UserUpdate // hostUserName_data.value = error.response?.data?.errors?.hostUserName?.[0] || error.response?.data?.message

    function pwd() {
      api({
        url, method: 'put', data: {
          pwd: !props.user,
          update: true,
          email: email.value,
          update_email: update_email.value||ipDebug.value,
          delete_account: delete_account.value,
          password: props.user?false:password.value,
          update_password: props.user?new_password.value:false,
          new_password: new_password.value,
          password_confirmation: password_confirmation.value }
      }).catch(e => notifyAction({error: 'passwordAction', e}))
        .then(({ data }) => notifyAction(data))
    }

    function deleteAvatar() {
      crudAction({ url, method: 'delete',
        delete_avatar: 1, refresh:['reloadApp']
      }).then((data: { user: object }) => {
        if (props.user) user.value = data.user
        else store.authGetter = user.value = data.user
      }).catch((e: unknown) => notifyAction({error: 'deleteAvatar', e}))
    } // ============================================== \\

    // function imgSize() {
    //   // var currWidth = file.width
    //   // var currHeight = file.height
    // } // TODO http://image.intervention.io/api/filesize

</script>
