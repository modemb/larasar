import { Notify } from 'quasar'
import axios from 'axios'

// const headers = axiosInstance.defaults.headers.common

console.log(process.env)

// We create our own axios instance and set a custom base URL.
// Note that if we wouldn't set any config here we do not need
// a named export, as we could just `import axios from 'axios'`
const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8000'
  baseURL: 'http://localhost/larasar/public'
})

export default ({ router, store, Vue }) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(request => {
    const token = store.getters['users/tokenGetter']
    if (token) {
      request.headers.common['Authorization'] = `Bearer ${token}`
    }

    const locale = store.getters['lang/locale']
    if (locale) {
      request.headers.common['Accept-Language'] = locale
    }

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
        message: status,
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
}

// Here we define a named export
// that we can later use inside .js files:
export { axiosInstance }
