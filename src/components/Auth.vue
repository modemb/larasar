<template>

  <q-layout view="lHh lpr lFf" container style="height: 600px" class="shadow-2 rounded-borders">
    <q-header elevated v-if="auth">
      <q-bar>
        <q-icon name="fas fa-user" />
        <div>{{$t('add_user')}}</div>

        <q-space />

        <!-- <q-btn dense flat icon="minimize" />
        <q-btn dense flat icon="crop_square" /> -->
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>
    </q-header>

    <q-page-container>
      <q-page :class="auth||'flex'+' flex-center q-pa-md'">
        <q-form class="q-gutter-md">
          <div class="q-pa-sm" v-if="!$route.path.includes('email/verify')">
            <q-select
              filled class="col-12"
              v-model="role" v-if="auth"
              :options="(auth.id == 1 || auth.role == 'Admin')?admins:users"
              :label="$t('role')"
              :error="role_data ? true : false"
              :error-message='role_data'
            />

            <q-input
              filled clearable
              v-model="first_name"
              :label="$t('first_name')"
              lazy-rules v-if="auth||$route.path.includes('register')"
              :rules="[val => val && val.length > 0 || 'null']"
              :error="first_name_data ? true : false"
              :error-message='first_name_data'
            />

            <q-input
              filled clearable
              v-model="last_name"
              :label="$t('last_name')"
              lazy-rules v-if="auth||$route.path.includes('register')"
              :rules="[val => val && val.length > 0 || 'null']"
              :error="last_name_data ? true : false"
              :error-message='last_name_data'
            />

            <q-input
              filled
              type="email"
              v-model="email"
              lazy-rules
              bottom-slots clearable
              :label="$t('email')" autocomplete="on"
              :rules="[val => val && val.length > 0 || 'null']"
              :error="email_data ? true : false"
              :error-message='email_data'
            /><!-- https://quasar.dev/vue-components/field#Validation -->

            <q-input
              v-model="password" filled lazy-rules
              v-if="!$route.path.includes('password/email')"
              :label="$t('password')" clearable
              :type="isPwd ? 'password' : 'text'"
              :rules="[val => val && val.length > 7 || 'min 8']"
              :error="password_data ? true : false"
              :error-message='password_data'
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
              v-model="password_confirmation" filled
              v-if="auth||$route.path.includes('register')||$route.path.includes('reset-password')"
              :type="isPwd ? 'password' : 'text'"
              :label="$t('confirm_password')" clearable
              :rules="[val => val && val.length > 7 || 'min 8']"
            /><!-- TagReset: reset-password - api/password/reset -->

          </div><!-- Form -->

          <div class="row flex justify-center" v-if="$route.path.includes('email/verify')">
            <q-card class="my-card text-white">
                <q-card-section class="bg-primary">
                  <div class="text-h6">{{$t('verify_email')}}</div>
                </q-card-section>

                <div class="q-ma-sm q-dark">
                  <template v-if="success">
                      {{$t('verify_email_address')}} <br>
                  </template>
                  <template v-if="param_id">
                      {{ $t('failed_to_verify_email') }}
                  </template>
                  {{ $t('before_email_verification') }}
                  {{ $t('receive_email') }},
                </div>

                <q-btn
                  color="primary"
                  :label="$t('resend_verification_link')"
                  class="q-ma-sm"
                  @click.prevent="resend"
                /><!-- TagResend: ResendModule -->
                <q-btn class="q-ma-sm"
                  color="primary"
                  v-if="param_id"
                  :loading="loader"
                  :label="$t('verify_email')"
                  @click.prevent="verify($route)"
                /><!-- TagVerify: RetryVerifyModule -->
                <q-btn class="q-ma-sm" icon="fas fa-paper-plane"
                  color="amber-7" v-if="verify_email_data"
                  :label="$t(verify_email_data)"
                  @click.prevent="signature"
                /><!-- Invalid signature. -->
            </q-card>
          </div><!-- TagVerify: VerifyModule -->

          <div v-if="$route.path.includes('reset-password')">
            <q-btn color="primary"
              icon="fas fa-history"
              :loading="loader"
              :label="$t('reset_password')"
              @click.prevent="reset"
            /><!-- ('token' in $route.path.params) -->
          </div><!-- TagReset: reset-password - api/password/reset-->
          <div v-else-if="!$route.path.includes('password/email')&&!$route.path.includes('email/verify')">
            <q-btn color="primary"
              icon="fas fa-sign-in-alt" v-if="$route.path.includes('login')"
              :loading="loader" :label="$t('login')"
              @click.prevent="authenticateUser" class="q-ma-sm"
            /><!-- TagLogin -->
            <q-btn color="primary"
              icon="fas fa-plus-circle" v-else
              :loading="loader" :label="auth?$t('add_user'):$t('register')"
              @click.prevent="authenticateUser" class="q-ma-sm"
            /><!-- TagRegister - TagAdd -->
            <q-btn color="primary"
              icon="fas fa-sync" v-if="ipDebug"
              :loading="loader" :label="$t('reset')"
              @click.prevent="deleteAllCookies" class="q-ma-sm"
            /><!-- TagDeleteAllCookies -->
            <q-btn color="primary" flat :label="$t('login')" to='/login' v-if="$route.path.includes('register')"/>
            <q-btn color="primary" flat :label="$t('register')" to='/register'  v-else-if="!auth">
              <q-btn color="primary" flat :label="$t('forgot_password')" to="/password/email" />
              <q-checkbox  v-model="remember" :label="$t('remember_me')" />
            </q-btn><!--  -->
          </div>
          <div v-else-if="$route.path.includes('password/email')">
            <q-btn
              color="primary"
              icon="fas fa-link"
              :loading="loader"
              :label="$t('send_password_reset_link')"
              class="q-ma-sm" @click.prevent="send"
            />
          </div>
          <div v-if="!auth&&!mobil||ipDebug">
            <LoginWithSocial />
          </div><!--  -->

        </q-form>
      </q-page>
    </q-page-container>
  </q-layout>

</template>

<script>
import { LocalStorage } from 'quasar'
import { ref, computed, onMounted, onUpdated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {  useStore } from 'vuex'
import LoginWithSocial from './LoginWithSocial.vue'
import { i18n, mobil, api, SANCTUM_API, ipDebug } from 'boot/axios'

import { useCrudStore } from 'stores/crud'

/**
 * Tags: TagRegister - TagAdd - TagLogin TagUser
 *
 * @from /Auth/
 */
export default {
  components: {
    LoginWithSocial
  },name: 'registerPage',
  props: ['auth'],
  setup (props) {
    const $t = i18n?.global?.t
    const $route = useRoute()
    const $router = useRouter()
    const $store = useStore()
    const { crudAction, notifyAction } = useCrudStore()
    const loader = ref(false)
    const token = ref($route.query.token || $route.params.token)
    const verify_email_data = ref(null)
    const param_id = ref(false)
    const role = ref(null)
    const role_data = ref(null)
    const first_name = ref(null)
    const first_name_data = ref(null)
    const last_name = ref(null)
    const last_name_data = ref(null)
    const email = ref($route.query.email||null)
    const email_data = ref(null)
    const password = ref(null)
    const password_data = ref(null)
    const password_confirmation = ref(null)
    const remember = ref(true)
    const darkMode = ref(LocalStorage.getItem('darkMode'))

    const data = computed(() => ({
      locale: i18n?.global?.locale.value,
      auth: props.auth,
      role: role.value,
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
      remember: remember.value,
      token: token.value||'csrf', path: $route.path
    }))

    onMounted(() => {
      verify($route)
      darkModeClass(darkMode.value)
    }); onUpdated(() => resend())

    function darkModeClass(val) {
      const QDarkClass = document.querySelector('.q-dark')
      if (val==='null') val = false
      if (QDarkClass) QDarkClass.style.color = val?'#fff':'var(--q-dark)'
      if (QDarkClass) QDarkClass.style.background = val?'var(--q-dark)':'#fff'
    }

    function resend() {
      const url = SANCTUM_API ? 'email/verification-notification' : 'api/email/resend'

      if ($route.path.includes('email/verify')) crudAction({
        success: $t('verify_email_address'),
        url, method: 'post', token: 'csrf'
      }).then(token => {
        console.log('resendAction', token)
      }).catch(e => notifyAction({error: 'resendAction', e}))

    } // TagVerify: ResendModule

    function verify(route) {
      loader.value = true
      if (!route.params.id) { loader.value = false; return }
      else param_id.value = route.params.id
      crudAction({
        url: route.path, token: 'csrf',
        method: SANCTUM_API ? 'get' : 'post',
      }).then(token => {
        console.log('token', token)
        $router.push({ path: '/' }); param_id.value = false
        notifyAction({message: $t('email_verified_successfully')})
      }).catch(e => {
        verify_email_data.value = e?.response?.data?.message
        notifyAction({error: 'verifyAction', e}); loader.value = false
      }) // RetryVerifyModule
    } // TagVerify: VerifyModule

    function catchErr(error) {
      const data = error?.response?.data; loader.value = false
      const errors = data?.errors; const message = data?.message
      role_data.value = errors?.role?.[0] || message
      first_name_data.value = errors?.first_name?.[0] || message
      last_name_data.value = errors?.last_name?.[0] || message
      email_data.value = data?.['email'] || errors?.email?.[0] || message
      password_data.value = errors?.password?.[0] || message
    } // Wth Optional Chaining

    return {
      mobil,
      ipDebug,
      param_id,
      token,
      verify_email_data,
      loader,
      role,
      role_data,
      first_name,
      first_name_data,
      last_name,
      last_name_data,
      email,
      email_data,
      password,
      password_data,
      password_confirmation,
      isPwd: ref(true),
      remember,
      admins: [
        'Admin', 'User', 'Editor'
      ],
      users: [
        'User', 'Editor'
      ],
      authenticateUser() {
        const store = $route.path.includes('login')?'users/loginAction':'users/registerAction'
        $store.dispatch(store, data.value).then(() => {
          setTimeout(() => role.value = first_name.value = last_name.value =
            email.value = password.value = password_confirmation.value = null
          , 2000); loader.value = false // name.value =
        }).catch(error => catchErr(error)); loader.value = true
      }, // TagRegister - TagAdd - TagLogin TagUser
      send() {
        // loader.value = true
        const url = SANCTUM_API?'forgot-password':'api/password/email'; api.post(url, data.value).then(res => {
          console.log('send', res)
          loader.value = false
          notifyAction({success: res.data.message})
        }).catch(error => catchErr(error)); loader.value = true
      }, // Send Email To Reset Password
      reset() {
        loader.value = true
        const url = SANCTUM_API?'reset-password':'api/password/reset'
        api.post(url, data.value).then(() => {
          loader.value = false
          notifyAction({success: $t('password_updated')})
          $store.dispatch('users/loginAction', data.value)
        }).catch(error => catchErr(error))
      }, // TagReset: Reset Password
      resend, // TagVerify: ResendModule
      verify, // TagVerify: VerifyModule
      signature() {
        crudAction({
          url: `api/users/${$store.getters['users/authGetter']?.id}`,
          method:'put', update:true, signature: true
        }).then(() => {
          notifyAction({message: $t('email_verified_successfully')})
          $router.push({ path: '/' })
        })
      }, // Invalid signature.
      deleteAllCookies() {
        let cookies = document.cookie.split(';')

        for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i]
          let eqPos = cookie.indexOf('=')
          let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
          if (cookies.length===1) notifyAction({message: 'All Cookies Deleted', timeout: 6000})
          // else deleteAllCookies()
        } //location.reload() - history.go
      } // TagDeleteAllCookies
    }
  }
}
</script>
