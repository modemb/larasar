import { Notify, Cookies, LocalStorage } from 'quasar'
import { i18n } from './i18n'
import axios from 'axios'

const cookie = false // Use Cookies
let locale = cookie ? Cookies.get('locale') : LocalStorage.getItem('locale') || i18n.locale
let env = process.env

// We create our own axios instance and set a custom base URL.
// Note that if we wouldn't set any config here we do not need
// a named export, as we could just `import axios from 'axios'`
const axiosInstance = axios.create({
  baseURL: env.DEV ? env.DEV_URL : env.LOCAL_PROD ? env.DEV_URL : env.API_URL
})

export default ({ router, store, Vue }) => {
  // Router Authentication
  router.beforeEach((to, from, next) => {
    if (store.getters['users/tokenGetter']) next()
    else next(!to.meta.requiresAuth || { path: '/login' })
  })

  // Request interceptor
  axiosInstance.interceptors.request.use(request => {
    const token = store.getters['users/tokenGetter']
    locale = store.getters['config/localeGetter']
    if (token) request.headers.common['Authorization'] = `Bearer ${token}`
    if (locale) request.headers.common['Accept-Language'] = locale
    request.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    request.headers.common['Content-Type'] = 'multipart/form-data'

    // request.headers['X-Socket-Id'] = Echo.socketId()

    return request
  })

  // Response interceptor
  axiosInstance.interceptors.response.use(response => response, error => {
    const { status } = error.response

    if (status >= 500) {
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'Response interceptor ' + status,
        icon: 'report_problem'

        // type: 'error',
        // title: i18n.t('error_alert_title'),
        // text: i18n.t('error_alert_text'),
        // reverseButtons: true,
        // confirmButtonText: i18n.t('ok'),
        // cancelButtonText: i18n.t('cancel')
      })
    }

    if (status === 401 && store.getters['users/authGetter']) {
      store.dispatch('users/logoutAction').then(() => {
        router.push({ path: '/login' }).then(() => {
          Notify.create({
            color: 'negative',
            position: 'top',
            message: i18n.t('token_expired_alert_title'),
            icon: 'report_problem'

            // type: 'warning',
            // title: i18n.t('token_expired_alert_title'),
            // text: i18n.t('token_expired_alert_text'),
            // reverseButtons: true,
            // confirmButtonText: i18n.t('ok'),
            // cancelButtonText: i18n.t('cancel')
          })
        })
      })
    } return Promise.reject(error)
  })

  // for use inside Vue files through this.$axios
  Vue.prototype.$axios = axiosInstance

  // Auth User Check
  store.dispatch('users/authAction')

  // Config
  store.dispatch('config/configAction', locale)
}

// Here we define a named export
// that we can later use inside .js files:
export { axiosInstance, cookie, locale }
