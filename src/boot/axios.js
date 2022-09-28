import { Cookies, LocalStorage } from 'quasar'
import { boot } from 'quasar/wrappers'
import { format, register } from 'timeago.js'
import Currencies from '../components/json/Currencies'
// import collect from 'collect.js' // https://collect.js.org
import { i18n } from './i18n'
import Echo from 'laravel-echo'
import axios from 'axios'

window.Pusher = require('pusher-js')

const qs = params => Object.keys(params).map(key => `${key}=${params[key]}`).join('&')

let locale = Cookies.get('locale')||'en'; const location = Cookies.get('location')
let currency; let cy; let xRate
let userData; let ipDebug = 0; let crudAction; let notifyAction; let timeago

const mobil = (process.env.MODE === 'capacitor')||(process.env.MODE === 'cordova')
const API_URL = (process.env.DEV||(process.env.LOCAL_PROD==='1'?1:0))
              ?process.env.DEV_URL:process.env.API_URL
const URL = mobil?(process.env.PROD?API_URL:process.env.DEV_MOBIL_URL):API_URL

// const SANCTUM = process.env.SANCTUM_API==='true'?true:false
const SANCTUM_API = true//(process.env.DEV&&url==process.env.DEV_URL)?false:SANCTUM

const ipDebugData = [ // Add Your IP To Debug App
  process.env.DEV_1_IP
] // TagIpDebug: IpDebugModule

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client) api.defaults.withCredentials = true
const api = axios.create({ baseURL: URL, withCredentials: true })

export default boot(async ({ app, router, store }) => {

  // i18n = app?.__VUE_I18N__
  // i18n = app?.i18n
  const $t = i18n.global.t

  // https://quasar.dev/quasar-plugins/cookies#introduction
  // const allCookies = $q.cookies.getAll() // {index: data}
  // console.log('cookies', Cookies.getAll().location)
  // console.log('process.env.MODE', process.env.MODE)

  crudAction = payload => store.dispatch('crud/Action', {
    ...payload,
    ...{
      method: payload.method,
      url: payload.url
    } // Create, Read, Update, Delete, Action
  }); notifyAction = payload => store.dispatch('crud/notifyAction', payload)

  api.interceptors.request.use(request => {

    // console.log(
    //   `%curl: %c${url}`,
    //   'color: red; font-size: 24px', 'color: green; font-size: 24px',
    //   'includes', request.data?.token?.includes('csrf'),
    // ) // Console With Style

    if (request.data?.token?.includes('csrf')&!Cookies.get('XSRF-TOKEN'))
      api.get('/sanctum/csrf-cookie').catch(e => notifyAction({error: 'XSRF-TOKEN-GET', e}))
        .then(() => store.dispatch('users/loginAction', JSON.parse(request.data))
          .catch(e => notifyAction({error: 'XSRF-TOKEN-POST', e}))) // https://laravel.com/docs/9.x/sanctum#issuing-api-tokens

    locale = store.getters['config/localeGetter']
    const token = store.getters['users/tokenGetter']
    if (token) request.headers.common['Authorization'] = `Bearer ${token}`
    if (locale) request.headers.common['Accept-Language'] = locale
    request.headers.common['DEV'] = process.env.DEV
    request.headers.common['IP-DEBUG'] = ipDebug
    // if (window.Echo.socketId()) request.headers['X-Socket-ID'] = window.Echo.socketId()
    // request.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    // request.headers.common['Content-Type'] = 'multipart/form-data'
    return request
  })// Request interceptor

  api.interceptors.response.use(response => response, error => {
    const { status } = error?.response

    if (status >= 500) notifyAction({ message: $t('error_alert_text'), timeout: 6000 })
    if (status === 401 && store.getters['users/authGetter'])
      store.dispatch('users/logoutAction').then(() => {
        router.push({ path: '/login' }).then(() => notifyAction({
          message: $t('token_expired_alert_title')+' '+status,
          timeout: 6000
        }))
      }); return Promise.reject(error)
  }) // Response interceptor

  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  app.config.globalProperties.$crudAction = crudAction
  app.config.globalProperties.$notifyAction = notifyAction

  // $t = app.__VUE_I18N__.global.t
  // $t = i18n?.global?.t

  const localeFn = (_number, index) => {
    // number: the time ago / time in number;
    // index: the index of array below;
    // totalSec: total seconds between date to be formatted and today's date;
    return [
      [$t('just now'), 'right now'],
      [$t('%s seconds ago'), 'in %s seconds'],
      ['1 minute ago', 'in 1 minute'],
      ['%s minutes ago', 'in %s minutes'],
      ['1 hour ago', 'in 1 hour'],
      ['%s hours ago', 'in %s hours'],
      ['1 day ago', 'in 1 day'],
      ['%s days ago', 'in %s days'],
      ['1 week ago', 'in 1 week'],
      ['%s weeks ago', 'in %s weeks'],
      ['1 month ago', 'in 1 month'],
      ['%s months ago', 'in %s months'],
      ['1 year ago', 'in 1 year'],
      ['%s years ago', 'in %s years']
    ][index];
  };register(locale, localeFn);

  timeago = date => format(date, locale) // https://timeago.org

  const echoUrl = (process.env.APP_URL===URL)?'/broadcasting/auth':'/api/broadcasting/auth'
  // const echoUrl = SANCTUM_API?'/broadcasting/auth':'/api/broadcasting/auth'

  window.Echo = new Echo({
    broadcaster: 'pusher',
    cluster: process.env.PUSHER_APP_CLUSTER,
    key: process.env.PUSHER_APP_KEY,
    // cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    // key: process.env.MIX_PUSHER_APP_KEY,
    forceTLS: true,
    encrypted: true,
    // authEndpoint: URL + '/broadcasting/auth'
    authorizer: (channel/* options */) => {
      return {
        authorize: (socketId, callback) => api.post(echoUrl, {
          socket_id: socketId,
          channel_name: channel.name
        }).then(response => callback(false, response.data))
          .catch(error => callback(true, error))
      }// client: window.Pusher // https://pusher.com/docs/channels/server_api/http-api#publishing-events
    } // https://www.youtube.com/watch?v=zooUbo0tz6U&t=341s
  }) // https://laravel.com/docs/9.x/broadcasting#server-side-installation

  let ip = ''; const Format = 'json' // json, jsonp, xml, csv, yaml
  try { // Users Analytics
    ip = await axios.get(`https://ipapi.co/${ip}/${Format}/`)
    // ip = await axios.get(`http://ip-api.com/${Format}/${ip}`)
  } catch (e) { // User Location
    notifyAction({error: 'location ', e})
  } let { data } = ip; userData = data; let session = []

  ipDebugData.forEach(ip => {
    if (data?.ip === ip) ipDebug = Number(LocalStorage.getItem('debug')) //1
  }) // TagIpDebug: IpDebugModule

  xRate = amount => {

      const user = store.getters['crud/Getter']?.auth // Users PopUp
      const auth = user||store.getters['users/authGetter']

      currency = store.getters['users/currencyGetter']||auth?.currency_code||userData.currency

      const currencyInfo = Currencies[currency]; console.log('check')

      const myHeaders = new Headers()
      myHeaders.append('apikey', process.env.EXCHANGE_RATES_API)

      const apiData = {
        url: 'api/users',
        method: 'POST',
        auth_id: auth?.id,
        apiMessage: amount?.message,
        rate: amount?.info?.rate,
        result: amount?.result,
        from_name: 'Gold Ounce',
        to_name: currencyInfo?.name,
        decimal_digits: currencyInfo?.decimal_digits,
        // ====Api===== \\
        redirect: 'follow',
        headers: myHeaders,
        amount: amount?.query?.amount||amount,
        from: 'XAU', // XAU - XAG
        to: userData.currency = currency
        // ====Api End=== \\
      }; if (Number(store.getters['users/rateGetter'])===0||apiData.apiMessage)
      crudAction(apiData).then(rate => {

        if (rate > 0) return store.commit('users/rateMutation', { rate })
        else if (session.includes(currency)) return // Validate Currency Api
        else apiData.method = 'GET' // Get Exchanged Rate

        fetch('https://api.apilayer.com/exchangerates_data/convert', apiData)
          .then(response => response.json()) // https://apilayer.com/marketplace/exchangerates_data-api#details-tab
          .then(result => xRate(result)) // console.log('result', result)
          .catch(e => notifyAction({error: 'fetchCurrency', e}))
          session.includes(currency)||session.push(currency) // Validate API Request
          store.commit('users/rateMutation', { rate })

      }).catch(e => notifyAction({error: 'getCurrency', e})) //.finally(() => /* always executed */)

      const rate = store.getters['users/rateGetter']

      while (!rate||rate==='abort')  break

      const customRate = rate/1500 // Get Custom Exchanged Rate
      const xRateAmount = customRate*apiData?.amount||0

      return xRateAmount
  } // Exchange Rate // 1 gram 0.035274 once // 1 once - 28.3495 gram

  cy = a => a?.toLocaleString(locale, { style: 'currency', currency })

  store.dispatch('config/configAction',{ locale, ipDebug }) // Config
  store.commit('users/locationMutation', {
    location: location || (data?.city+' '+data?.region||data?.country).toLowerCase()
  }) // TagAddLocation: LocationModule

  router.beforeEach(async (to, _from, next) => {
    const path = !session.includes(to.path)
    const postID = (to.path=='/post/'+to.params.id)?to.params.id:null
    const error = to.meta.error ? to.meta.error || { path: '*' } : false
    if (store.getters['users/tokenGetter']) { // Authenticated Router
      const auth = await store.dispatch('users/authAction').catch(() => {
        store.commit('users/logoutMutation') // Auth Check
      }); data = { ...data, ...{ id: auth?.id } }
      let verify = !auth?.email_verified_at & process.env.MUST_VERIFY_EMAIL
        ? error || to.meta.verify || { path: '/email/verify' }
        : to.meta.public || to.meta.auth || { path: '/' }; next(verify)
      if (auth?.[0]?.ip !== data?.ip || path) crudAction({...data, ...{
        url: `api/users/${auth.id}`,
        method: 'put',
        post_id: postID, // Post Views
        slug: to.path // Page Views
      }}).catch(e => notifyAction({error: 'AuthenticatedAction', e}))
    } else { // Guest & Unauthenticated Route
      if (to.meta.auth) notifyAction({success: 'Please Login'})
      next(error || to.meta.public || to.meta.guest || { path: '/login' })
      if (data && path) crudAction({...data, ...{
        url: 'api/users',
        method: 'post',
        hostUser: to.query.hostUser, // Invite Users To Gain Money
        post_id: postID, // Post Views
        slug: to.path // Page Views
      }}).catch(e => notifyAction({error: 'GuestUnauthenticatedAction', e}))
    } session.includes(to.path)||session.push(to.path) // TagBoot: AnalyticModule
  }) // Authentication
})

// Here we define a named export
// that we can later use inside .js files:
export { qs, cy, api, URL, i18n, SANCTUM_API, timeago, xRate, crudAction, notifyAction, userData, ipDebug }
