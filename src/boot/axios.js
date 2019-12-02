<<<<<<< HEAD
import { Notify, Cookies } from 'quasar'
=======
import { Notify, LocalStorage } from 'quasar'
>>>>>>> modemb/dev
import axios from 'axios'
// console.log(process.env)
// Use Cookies
const cookie = false

// We create our own axios instance and set a custom base URL.
// Note that if we wouldn't set any config here we do not need
// a named export, as we could just `import axios from 'axios'`
const axiosInstance = axios.create({
  // baseURL: 'http://127.0.0.1:8000'
<<<<<<< HEAD
  // baseURL: 'http://192.168.2.11:8000'
  baseURL: 'http://localhost/larasar/public'
=======
  // baseURL: 'http://192.168.2.11:9000'
  // baseURL: 'http://localhost/larasar/public'
  baseURL: 'http://modemb.com/larasar/public'
>>>>>>> modemb/dev
})

export default ({ router, store, Vue }) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(request => {
    const token = store.getters['users/tokenGetter']
<<<<<<< HEAD
    if (token) request.headers.common['Authorization'] = `Bearer ${token}`
    // const locale = store.getters['config/localeGetter']
    // if (locale) request.headers.common['Accept-Language'] = locale
=======
    const locale = store.getters['config/localeGetter']
    // request.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    if (token) request.headers.common['Authorization'] = `Bearer ${token}`
    if (locale) request.headers.common['Accept-Language'] = locale
>>>>>>> modemb/dev

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

    if (status === 401 && store.getters['auth/check']) {
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'Token Expired',
        icon: 'report_problem'

        // type: 'warning',
        // title: i18n.t('token_expired_alert_title'),
        // text: i18n.t('token_expired_alert_text'),
        // reverseButtons: true,
        // confirmButtonText: i18n.t('ok'),
        // cancelButtonText: i18n.t('cancel')
      }).then(() => {
        store.commit('users/logoutAction')

        router.push({ name: 'public.login' })
      })
    }

    return Promise.reject(error)
  })
  // for use inside Vue files through this.$axios
  Vue.prototype.$axios = axiosInstance
  // Auth User Check
  store.dispatch('users/authAction')
  // Config
<<<<<<< HEAD
  store.dispatch('config/configAction', Cookies.get('locale'))
=======
  store.dispatch('config/configAction', LocalStorage.getItem('locale'))
>>>>>>> modemb/dev
}

// Here we define a named export
// that we can later use inside .js files:
export { axiosInstance, cookie }
