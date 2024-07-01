<template>

  <q-layout view="lHh lpr lFf" container style="height: 700px" class="shadow-2 rounded-borders">
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
      <q-page :class="auth||'flex flex-center *q-pa-md'">
        <q-form class="q-gutter-md">

          <div class="q-pa-sm" v-if="!$route.path.includes('email/verify')">
            <q-select
              filled class="col-12"
              v-model="role" v-if="auth"
              :options="(auth.id == 1 || auth?.role == 'Admin')?admins:users"
              :label="$t('role')"
              :error="role_data ? true : false"
              :error-message='role_data'
            /><!-- role -->

            <q-input
              filled clearable
              v-model="first_name"
              :label="$t('first_name')"
              lazy-rules v-if="auth||(privacy=$route.path.includes('register'))"
              :rules="[(val: string | any[]) => val && val.length > 0 || 'null']"
              :error="first_name_data ? true : false"
              :error-message="first_name_data"
            /><!-- first_name -->

            <q-input
              filled clearable
              v-model="last_name"
              :label="$t('last_name')"
              lazy-rules v-if="auth||$route.path.includes('register')"
              :rules="[(val: string | any[]) => val && val.length > 0 || 'null']"
              :error="last_name_data ? true : false"
              :error-message='last_name_data'
            /><!-- last_name -->

            <q-input
              filled
              type="email"
              v-model="email"
              lazy-rules
              bottom-slots clearable
              :label="$t('email')" autocomplete="on"
              :rules="[(val: string | any[]) => val && val.length > 0 || 'null']"
              :error="email_data ? true : false"
              :error-message='email_data'
            /><!-- email -->
            <!-- https://quasar.dev/vue-components/field#Validation -->

            <q-input
              v-model="password" filled lazy-rules
              v-if="!$route.path.includes('password/email')"
              :label="$t('password')" clearable
              :type="isPwd ? 'password' : 'text'"
              :rules="[(val: string | any[]) => val && val.length > 7 || 'min 8']"
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
            </q-input><!-- password -->

            <q-input v-model="password_confirmation" filled
              v-if="auth||$route.path.includes('register')||$route.path.includes('reset-password')"
              :type="isPwd ? 'password' : 'text'"
              :label="$t('confirm_password')" clearable
              :rules="[(val: string | any[]) => val && val.length > 7 || 'min 8']"
            /><!-- confirm_password --><!-- TagReset: reset-password - api/password/reset -->

          </div><!-- Form -->

          <div class="row flex justify-center" v-if="$route.path.includes('email/verify')">
            <q-card class="my-card text-white">

              <q-card-section class="bg-primary">
                <div class="text-h6">{{$t('verify_email')}} {{ verifyEmail }}</div>
              </q-card-section><!-- Verify Auth Email -->

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

              <q-btn color="primary" class="q-ma-sm"
                :label="$t('resend_verification')"
                @click.prevent="resend($route)"
              /><!-- TagResend: ResendModule -->

              <q-btn v-if="MAIL_VERIFY&&param_id"
                color="primary" class="q-ma-sm"
                :loading="loader"
                :label="$t('verify_email')"
                @click.prevent="verify($route)"
              /><!-- TagVerify: RetryVerifyModule -->

              <q-input clearable outlined v-model="code" v-if="MAIL_CODE"
                  :label="$t('Enter Code')" counter maxlength="4" class="q-ma-sm"
                  :rules="[(val: string | any[]) => val && val.length > 0 || 'null']"
                  :error="verify_email_data ? true : false"
                  :error-message="verify_email_data"
                >
                <template v-slot:append>
                  <q-btn round dense flat
                    :loading="loader" icon="send"
                    @click.prevent="verify($route)"
                  /><!-- TagVerify: VerifyModule -->
                </template>

              </q-input><!-- TagCode: VerifyModule - CodeModule -->

            </q-card><!-- TagVerify: VerifyModule -->
          </div><!-- VerifyModule -->

          <div @keyup.enter="reset" v-if="$route.path.includes('reset-password')">
            <q-btn color="primary"
              icon="fas fa-history"
              :loading="loader"
              :label="$t('reset_password')"
              @click.prevent="reset"
            /><!-- ('token' in $route.path.params) -->
          </div><!-- TagReset: reset-password - api/password/reset -->
          <div @keyup.enter="authenticateUser" v-else-if="!$route.path.includes('password/email')&&!$route.path.includes('email/verify')">

            <div class="q-ma-sm" v-if="privacy">
              <q-btn flat :label="$t('posting-policies')" to="page/posting-policies" />
              <q-btn flat :label="$t('privacy-policy')" to="page/privacy-policy" /><br>
              {{ $t('posting-&-privacy') }}
            </div><!-- TagRegister: PrivacyModule -->

            <q-btn color="primary" class="q-ma-sm"
              icon="fas fa-sign-in-alt" v-if="$route.path.includes('login')"
              :loading="loader" :label="$t('login')"
              @click.prevent="authenticateUser"
            /><!-- TagLogin -->
            <q-btn color="primary" class="q-ma-sm" icon="fas fa-plus-circle"
              :loading="loader" :label="auth?$t('add_user'):$t('register')"
              @click.prevent="authenticateUser" v-else
            /><!-- TagRegister - TagAdd -->
            <q-btn color="primary" class="q-ma-sm"
              :loading="loader" icon="fas fa-sync"
              :label="$t('reset')" v-if="ipDebug"
              @click.prevent="deleteAllCookies"
            /><!-- TagDeleteAllCookies -->
            <q-btn flat dense _color="primary" :label="$t('login')" to='/login' v-if="$route.path.includes('register')"/>
            <q-btn flat dense _color="primary" :label="$t('register')" to='/register'  v-else-if="!auth">
              <q-btn flat dense _color="primary" :label="$t('forgot_password')" to="/password/email" />
              <q-checkbox v-model="remember" :label="$t('remember_me')" />
            </q-btn><!-- register -->
          </div><!-- TagRegister - TagAdd - TagLogin TagUser -->
          <div @keyup.enter="send" v-else-if="$route.path.includes('password/email')">
            <q-btn color="primary" class="q-ma-sm"
              :label="$t('send_password_reset_link')"
              :loading="loader" icon="fas fa-link"
              @click.prevent="send"
            />
          </div><!-- password/email --><LoginWithSocial />

        </q-form>
      </q-page>
    </q-page-container>
  </q-layout>

</template>

<script lang="ts">
import { ref, computed, reactive, onMounted, onUpdated } from 'vue'
import { useRouter, useRoute, RouteLocationNormalizedLoaded } from 'vue-router'
import { deleteAllCookies, loginMutation, i18n, api, mobileApp, authAction,
  SANCTUM_API, MAIL_VERIFY, MAIL_CODE, xRate} from 'boot/axios'
import { useCrudStore } from 'stores/crud'
import LoginWithSocial from './LoginWithSocial.vue'

/**
 * Tags: TagRegister - TagAdd - TagLogin TagUser - TagCode
 *       PrivacyModule
 *
 * @to /Auth/
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
    const store = useCrudStore()
    const { notifyAction } = store
    const loader = ref(false)
    // const token = ref($route.query.token||$route.params.token||'csrf')
    const code = ref('')
    const verify_email_data = ref('')
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

    const ipDebug = computed(() => store['configGetter']?.ipDebug)
    const auth = computed(() => store.authGetter)//$store.getters['users/authGetter']
    const payload = reactive({
      app: mobileApp,
      auth: props.auth, role,
      first_name, last_name,
      email, password,
      password_confirmation,
      remember,//, path: $route.path
      locale: i18n?.global?.locale.value,
      token: $route.query.token||$route.params.token||'csrf',
      device_name: navigator.userAgent.match(/\(([^)]+)\)/)?.[1].split(';')[0].split(' ')[0]
    })

    onMounted(() => {
      if (MAIL_VERIFY) verify($route)
      // darkModeClass(darkMode.value)
    }); onUpdated(() => resend($route))

    // function darkModeClass(val: string | number | boolean | object | null) {
    //   const QDarkClass: any = document.querySelector('.q-dark') // if (val==='null') val = false
    //   if (QDarkClass) QDarkClass.style.color = val?'#fff':'var(--q-dark)'
    //   if (QDarkClass) QDarkClass.style.background = val?'var(--q-dark)':'#fff'
    // }

    function resend(route: RouteLocationNormalizedLoaded) {
      const url = SANCTUM_API ? // Sanctum Api
        MAIL_CODE?'api/users':'email/verification-notification'
        : 'api/email/resend' // Passport Api

      // if (!ipDebug.value?mobileApp:'') return // AppsNeedVerification
      if (route.params.id) return

      // if (route.path.includes('email/verify')) crudAction({
      //   success: 'verify_email_address',
      //   url, method: 'post', token: 'csrf'
      // })

      if (route.path.includes('email/verify')) api({
        url, method: 'post', data: {token: 'csrf'}
      }).then(() => notifyAction({success: 'verify_email_address'}))
        .catch(e => notifyAction({error: 'resendAction', e}))
    } // TagVerify: ResendModule

    function verify(route: RouteLocationNormalizedLoaded) {
      loader.value = true
      // if (!route.params.id) { loader.value = false; return }
      // if (!auth.value) notifyAction({message: 'Please Login And Retry'})
      // else param_id.value = route.params.id
      if (code.value) api({
        url: MAIL_CODE?'api/users':route.path,
        method: 'post', data: {code: code.value, token: 'csrf'}
      }).then(token => { console.log('token', token)
        loader.value = param_id.value = false
        authAction()?.then(() => $router.push({ path: '/profile' }))
        xRate(auth.value) // Refresh Updated Currency On the Database
        notifyAction({success: 'Email Verified Successfully'})
      }).catch(e => catchErr(e)); else loader.value = false // RetryVerifyModule
    } // TagVerify: VerifyModule

    function catchErr(error: { response: { data: any } }) {
      const data = error?.response?.data; loader.value = false
      const errors = data?.errors; let message = data?.message
      if (message?.includes('CSRF')) message = 'error_alert_text'
      role_data.value = $t(errors?.role?.[0] || message)
      first_name_data.value = $t(errors?.first_name?.[0] || message)
      last_name_data.value = $t(errors?.last_name?.[0] || message)
      email_data.value = $t(data?.['email'] || errors?.email?.[0] || message)
      password_data.value = $t(errors?.password?.[0] || message)
      verify_email_data.value = errors?.code?.[0] || message
    } // Wth Optional Chaining

    return {
      verifyEmail: computed(() => auth.value?.email),
      MAIL_VERIFY,
      MAIL_CODE,
      code,
      ipDebug,
      param_id,
      // token,
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
      privacy: ref(false),
      admins: [
        'Admin', 'User', 'Editor'
      ],
      users: [
        'User', 'Editor'
      ],
      authenticateUser() {

        const url = $route.path?.includes('login') ?
          (SANCTUM_API ? (false?'api/sanctum/token':'login') : 'api/login') :
          ($route.path?.includes('register') ? 'api/register' : 'api/users')

        // payload.device_name = navigator.userAgent.match(/\(([^)]+)\)/)[1].split(';')[0].split(' ')[0]
        // payload.url = url
        api.post(url, payload).then(({ data }) => {
          loader.value = false // access_token ^^^

          if ($route.path === '/register') $router.push({ path: '/login' })
            .then(() => notifyAction({ success: data })) // Register
          else loginMutation({token: data, remember: payload.remember}) // Login

        }).catch(error => catchErr(error)); loader.value = true

      }, // TagRegister - TagAdd - TagLogin TagUser
      send() {
        // loader.value = true
        const url = SANCTUM_API?'forgot-password':'api/password/email'
        api.post(url, payload).then(({ data }) => {
          console.log('send', data)
          loader.value = false
          notifyAction({success: data.message})
        }).catch(error => catchErr(error)); loader.value = true
      }, // Send Email To Reset Password
      reset() {
        loader.value = true
        const url = SANCTUM_API?'reset-password':'api/password/reset'
        api.post(url, payload).then(() => {
          loader.value = false//$store.dispatch('users/loginAction', payload)
          $router.push({ path: '/login' }).then(() => notifyAction({success: 'password_updated'}))
        }).catch(error => catchErr(error))
      }, // TagReset: Reset Password
      resend, // TagVerify: ResendModule
      verify, // TagVerify: VerifyModule
      deleteAllCookies // TagDeleteAllCookies
    }
  }
}
</script>
