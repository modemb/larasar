<template>

  <q-layout view="lHh lpr lFf" container style="height: 600px" class="shadow-2 rounded-borders">
    <q-header elevated v-if="auth">
      <q-bar>
        <q-icon name="fas fa-user" />
        <div>{{$t('add_user')}}</div>
        <!-- <div class="text-h6">{{$t('register')}}</div> -->

        <q-space />

        <!-- <q-btn dense flat icon="minimize" />
        <q-btn dense flat icon="crop_square" /> -->
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>
    </q-header>

    <q-page-container>
      <q-page :class="auth||'flex'+' flex-center q-pa-md'">
        <q-form class="q-gutter-md">
          <div class="q-pa-sm" v-if="!$route.path.includes('/email/verify')">
            <q-select
              filled class="col-12"
              v-model="role" v-if="auth"
              :options="(auth.id == 1 || auth.role == 'Admin')?admins:users"
              :label="$t('role')"
              :error="role_data ? true : false"
              :error-message='role_data'
            />

            <q-input
              filled
              v-model="first_name"
              :label="$t('first_name')"
              lazy-rules v-if="auth||$route.path == '/register'"
              :rules="[val => val && val.length > 0 || 'null']"
              :error="first_name_data ? true : false"
              :error-message='first_name_data'
            />

            <q-input
              filled
              v-model="last_name"
              :label="$t('last_name')"
              lazy-rules v-if="auth||$route.path == '/register'"
              :rules="[val => val && val.length > 0 || 'null']"
              :error="last_name_data ? true : false"
              :error-message='last_name_data'
            />

            <q-input
              filled
              type="email"
              v-model="email"
              lazy-rules
              bottom-slots
              :label="$t('email')"
              :rules="[val => val && val.length > 0 || 'null']"
              :error="email_data ? true : false"
              :error-message='email_data'
            /><!-- https://quasar.dev/vue-components/field#Validation -->

            <q-input
              filled
              v-model="password"
              :label="$t('password')"
              :type="isPwd ? 'password' : 'text'"
              lazy-rules v-if="$route.path != '/password/email'"
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
              v-model="password_confirmation"
              filled v-if="auth||$route.path == '/register'||$route.path == '/api/password/reset'"
              :type="isPwd ? 'password' : 'text'"
              :label="$t('confirm_password')"
              :rules="[val => val && val.length > 7 || 'min 8']"
            />

          </div><!-- Form -->

          <div class="row flex justify-center" v-if="$route.path.includes('/email/verify')">
            <q-card class="my-card text-white">
                <q-card-section class="bg-primary">
                  <div class="text-h6">{{$t('verify_email')}}</div>
                </q-card-section>

                <div class="q-ma-sm text-black">
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
                />
                <q-btn class="q-ma-sm" icon="fas fa-paper-plane"
                  color="amber-7" v-if="verify_email_data"
                  :label="$t(verify_email_data)"
                  @click.prevent="signature"
                /><!-- Invalid signature. -->
            </q-card>
          </div><!-- TagVerify: VerifyModule -->


          <div v-if="$route.path == '/api/password/reset'||$route.path.hasOwnProperty('token')">
            <q-btn color="primary"
              icon="fas fa-history"
              :loading="loader"
              :label="$t('reset_password')"
              @click.prevent="reset"
            /><!-- ('token' in $route.path.params) -->
          </div><!-- TagReset -->
          <div class="*row *q-pt-md" v-else-if="$route.path != '/password/email'&&!$route.path.includes('/email/verify')">
            <q-btn color="primary"
              icon="fas fa-sign-in-alt" v-if="$route.path == '/login'"
              :loading="loader" :label="$t('login')"
              @click.prevent="authenticateUser" class="q-ma-sm *col-lg-3"
            /><!-- TagLogin -->
            <q-btn color="primary"
              icon="fas fa-plus-circle" v-else
              :loading="loader" :label="auth?$t('add_user'):$t('register')"
              @click.prevent="authenticateUser" class="q-ma-sm *col-lg-3"
            /><!-- TagRegister - TagAdd -->
            <q-btn color="primary"
              icon="fas fa-sync" v-if="ipDebug"
              :loading="loader" :label="$t('reset')"
              @click.prevent="deleteAllCookies" class="q-ma-sm *col-lg-3"
            /><!-- TagDeleteAllCookies -->
            <q-btn color="primary" flat :label="$t('login')" to='/login' v-if="$route.path == '/register'"/>
            <q-btn color="primary" flat :label="$t('register')" to='/register'  v-else-if="!auth">
              <q-btn color="primary" flat :label="$t('forgot_password')" to="/password/email" class="*q-ma-sm *col-lg-12"/>
              <q-checkbox  v-model="remember" :label="$t('remember_me')" class="*text-black *q-ma-sm *col-lg-3"/>
            </q-btn><!--  -->
          </div>
          <div v-else-if="$route.path == '/password/email'">
            <q-btn
              color="primary"
              icon="fas fa-link"
              :loading="loader"
              :label="$t('send_password_reset_link')"
              class="q-ma-sm" @click.prevent="send"
            />
          </div>
          <div class="*col-md-12 *row" v-if="!auth">
            <login-with-social />
          </div><!-- login-with-social -->

        </q-form>
      </q-page>
    </q-page-container>
  </q-layout>

</template>

<script>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {  useStore } from 'vuex'
import LoginWithSocial from './LoginWithSocial'
import { i18n, SANCTUM_API, api, crudAction, notifyAction, ipDebug } from 'boot/axios'
// import { i18n } from 'boot/i18n'

/**
 * Tags: TagRegister - TagAdd - TagLogin TagUser - login-with-social
 *
 * @from /Auth/
 */
export default {
  components: {
    LoginWithSocial // login-with-social
  },name: 'registerPage',
  props: ['auth'],
  setup (props) {
    const $t = i18n?.global?.t
    const $route = useRoute()
    const $router = useRouter()
    const $store = useStore()
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

    function catchErr (error) {
      const data = error?.response?.data; loader.value = false
      const errors = data?.errors; const message = data?.message
      role_data.value = errors?.role?.[0] || message
      first_name_data.value = errors?.first_name?.[0] || message
      last_name_data.value = errors?.last_name?.[0] || message
      email_data.value = data?.['email'] || errors?.email?.[0] || message
      password_data.value = errors?.password?.[0] || message
    } // Wth Optional Chaining

    return {
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
      authenticateUser () {
        const data = {
          auth: props.auth,
          role: role.value,
          first_name: first_name.value,
          last_name: last_name.value,
          email: email.value,
          password: password.value,
          password_confirmation: password_confirmation.value,
          remember: remember.value,
          api: props.auth?'add':'register'
        }; const store = $route.path == '/login'?'users/loginAction':'users/registerAction'
        $store.dispatch(store, data).then(() => {
          loader.value = false //name.value =
          role.value =  first_name.value = last_name.value = email.value = password.value = password_confirmation.value = ''
        }).catch(error => catchErr(error)); loader.value = true
      }, // TagRegister - TagAdd - TagLogin TagUser
      send () {
        // loader.value = true
        const url = SANCTUM_API?'forgot-password':'api/password/email'; api.post(url, {
          email: email.value,
          locale: i18n?.global?.locale
        }).then(res => {
          // console.log('send', res)
          loader.value = false
          notifyAction({success: res.data.status})
        }).catch(error => catchErr(error)); loader.value = true
      }, // Send Email To Reset Password
      reset () {
        loader.value = true
        const data = {
          api: 'login',
          locale: i18n?.global?.locale,
          token: token.value,
          email: email.value,
          password: password.value,
          password_confirmation: password_confirmation.value
        }; const url = SANCTUM_API?'reset-password ':'api/password/reset'
        api.post(url, data).then(() => {
          loader.value = false
          notifyAction({success: $t('password_updated')})
          $store.dispatch('users/loginAction', data)
        }).catch(error => catchErr(error))
      }, // TagReset: Send Password Email reset
      resend () {
        const url = SANCTUM_API ? 'email/verification-notification' : 'api/email/resend'

        crudAction({
          message: $t('verify_email_address'),
          url: url,
          method: 'post'
        }).then(token => {
          console.log('resendAction', token)
        }).catch(e => notifyAction({error: 'resendAction', e}))

      }, // TagVerify: ResendModule
      verify (route) {
        loader.value = true
        if (!route.params.id) { loader.value = false; return }
        else param_id.value = route.params.id
        crudAction({
          url: route.path,
          method: SANCTUM_API ? 'get' : 'post',
        }).then(token => {
          console.log('token', token)
          param_id.value = false
          notifyAction({message: $t('email_verified_successfully')})
          $router.push({ path: '/' })
        }).catch(e => {
          loader.value = false; try {
            verify_email_data.value = e.response.data.message
          } catch (error) { verify_email_data.value = null}
          notifyAction({error: 'verifyAction', e})
        })
      }, // TagVerify: VerifyModule
      signature () {
        crudAction({
          url: `api/users/${$store.getters['users/authGetter'].id}`,
          method:'put',
          update:true,
          signature: true
        }).then(() => {
          notifyAction({message: $t('email_verified_successfully')})
          $router.push({ path: '/' })
        })
      }, // Invalid signature.
      deleteAllCookies () {
        let cookies = document.cookie.split(';')
        for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i]
          let eqPos = cookie.indexOf('=')
          let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
        } location.reload()
      } // TagDeleteAllCookies
    }
  }
}
</script>
