import { Cookies, LocalStorage } from 'quasar'
import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { createPinia } from 'pinia'
import { format, register, TDate } from 'timeago.js'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import Currencies from 'components/json/Countries.json'
import { i18n } from './i18n'
import { useCrudStore } from 'stores/crud'

const qs = (params: { [x: string]: unknown; method?: string; url?: string | undefined }) => Object.keys(params).map(key => `${key}=${params[key]}`).join('&')

let locale = Cookies.get('locale')||'en'; const location = Cookies.get('location')
let currency: string; let cy; let ipDebug = 0; let timeago
let ipData: object
let xRate: (arg0: number) => void // https://collect.js.org

const mobil = (process.env.MODE === 'capacitor')||(process.env.MODE === 'cordova')
const API_URL = (process.env.DEV||origin?.includes('localhost'))
                ?process.env.DEV_URL:process.env.API_URL
const baseURL = mobil?(process.env.PROD?API_URL:process.env.DEV_MOBIL_URL):API_URL

const SANCTUM_API = process.env.SANCTUM_API==='true'?true:false

const ipDebugData = [ // Add Your IP To Debug App
  process.env.DEV_1_IP, '142.182.3.235'
] // TagIpDebug: IpDebugModule

declare global {
  interface Window { Pusher: unknown; Echo: unknown }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client) api.defaults.withCredentials = true
const api = axios.create({ baseURL, withCredentials: true })

export default boot(async ({ app, router, store }) => {

  // i18n = app?.__VUE_I18N__
  // i18n = app?.i18n
  const $t = i18n.global.t

  app.use(createPinia())
  const { crudAction, notifyAction } = useCrudStore()

  // https://quasar.dev/quasar-plugins/cookies#introduction
  // const allCookies = $q.cookies.getAll() // {index: data}
  // console.log('cookies', Cookies.getAll().location)
  // console.log('process.env.MODE', process.env.MODE)

  api.interceptors.request.use(request => {

    console.log(
      `%curl: %c${baseURL}`,
      'color: red; font-size: 24px', 'color: green; font-size: 24px',
      // 'SANCTUM_API', SANCTUM_API
    ) // Console With Style

    if (request.data?.token?.includes('csrf')&&!Cookies.get('XSRF-TOKEN')&&SANCTUM_API)
      api.get('/sanctum/csrf-cookie').catch(e => { // https://laravel.com/docs/9.x/sanctum#issuing-api-tokens
        notifyAction({error: 'XSRF-TOKEN-GET', e}); Cookies.remove('XSRF-TOKEN')
      }).then(() => store.dispatch('users/loginAction', JSON.parse(request.data))
        .catch((e: string) => notifyAction({error: 'XSRF-TOKEN-POST', e})))

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

    if (status >= 500) notifyAction({ message: $t('error_alert_text') })//, timeout: 6000
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

  const localeFn = (_number: number, index: string | number) => {
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

  timeago = (date: TDate) => format(date, locale) // https://timeago.org

  // const echoUrl = (process.env.APP_URL===baseURL)?'/broadcasting/auth':'/api/broadcasting/auth'
  // const echoUrl = SANCTUM_API?'/broadcasting/auth':'/api/broadcasting/auth'

  window.Pusher = Pusher; window.Echo = new Echo({
    broadcaster: 'pusher',
    cluster: process.env.PUSHER_APP_CLUSTER,
    key: process.env.PUSHER_APP_KEY,
    // cluster: process.env.VITE_PUSHER_APP_CLUSTER,
    // key: process.env.VITE_PUSHER_APP_KEY,
    forceTLS: true,
    encrypted: true,
    // authEndpoint: baseURL + '/broadcasting/auth'
    authorizer: (channel: { name: string }/* options */) => {
      return {
        authorize: (socketId: number, callback: (arg0: boolean, arg1: unknown) => unknown) => api.post('/api/broadcasting/auth', {
          socket_id: socketId,
          channel_name: channel.name
        }).then(response => callback(false, response.data))
          // .catch(error => callback(true, error))
          .catch(e => notifyAction({error: 'EchoErr', e}))
      }// client: window.Pusher // https://pusher.com/docs/channels/server_api/http-api#publishing-events
    } // https://www.youtube.com/watch?v=zooUbo0tz6U&t=341s
  }) // https://laravel.com/docs/9.x/broadcasting#server-side-installation

  const session: string[] = []; const Format = 'json' // json, jsonp, xml, csv, yaml
  const { data } = await axios.get(`https://ipapi.co/${''/* IP */}/${Format}`)
    .catch(e => notifyAction({error: 'ipData', e}))
                || await axios.get(`http://ip-api.com/${Format}/${''/* IP */}`)

  if (!data?.ip) data.ip = 'noip'+Date.now()

  ipDebugData.forEach(ip => {
    if (data?.ip === ip) ipDebug = Number(LocalStorage.getItem('debug')) //1
  }) // TagIpDebug: IpDebugModule

  xRate = (amount: number | {[x: string]: unknown | {[x: string]: number}}) => {

    const auth = store.getters['users/authGetter']
    currency = store.getters['users/currencyGetter']
      || amount?.currency_code // PopUp Users
      || auth?.currency_code // Auth User
      || data?.currency // Api Currency

    const currencyInfo = Currencies[currency]

    const myHeaders = new Headers()
    myHeaders.append('apikey', process.env.EXCHANGE_RATES_API)

    const apiData = {
      url: 'api/users/xRate',
      method: 'PUT',
      auth_id: amount?.id||auth?.id,
      rate: amount?.info?.rate,
      result: amount?.result,
      updateUser: !!amount?.id, // Update PopUp User
      apiMessage: amount?.message||amount?.error?.code,
      from_name: 'Gold Ounce',
      to_name: currencyInfo?.name,
      decimal_digits: currencyInfo?.decimal_digits,
      // ====Api===== \\
      redirect: 'follow',
      headers: myHeaders,
      amount: amount?.query?.amount||Number(amount),
      from: 'XAU', // XAU - XAG
      to: currency
      // to: data.currency_code = currency
      // ====Api End=== \\
    }; if (Number(store.getters['users/rateGetter'])===0||apiData.apiMessage||apiData.rate>0)
    crudAction(apiData).then((rate: number) => {

      if (amount?.id) store.dispatch('users/authAction') // Update Currency On the Database
      if (rate > 0) return store.commit('users/rateMutation', { rate })
      else if (session.includes(currency)) return notifyAction({ error: 'include', e:currency }) // Validate Currency Api
      // else if (!isNaN(amount)) return notifyAction({ error: 'amount', e:amount }) // Validate Amount
      else if (Number.isNaN(amount)) return notifyAction({ error: 'amount', e:amount }) // Validate Amount
      else apiData.method = 'GET' // Get Exchanged Rate

      notifyAction({success: 'Currency Rate Updated'}) // Wont Be Updated On the Database

      if (store.getters['config/appEnvGetter']==='local') xRate({
        'date': '2022-10-01',
        'info': {
          'rate': Math.floor(Math.random() * 1234.567890),
          'timestamp': 1664618404
        },
        'query': {
          'amount': 1,
          'from': apiData.from,
          'to': apiData.to
        },
        'result': Math.floor(Math.random() * 1234.567890),
        'success': true,
        toFixed: function (): string {
          throw new Error('Function not implemented.')
        },
        toExponential: function (): string {
          throw new Error('Function not implemented.')
        },
        toPrecision: function (): string {
          throw new Error('Function not implemented.')
        }
      }) // fetch('https://api.apilayer.com/exchangerates_data/convert', apiData)

      else fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${apiData.to}&from=${apiData.from}&amount=1`, apiData)
        .then(response => response.json()) // https://apilayer.com/marketplace/exchangerates_data-api#details-tab
        .then(result => xRate(result)) //, console.log('resultRate', result?.info?.rate)
        .catch(e => notifyAction({error: 'fetchCurrency', e})) // https://gist.github.com/ksafranski/2973986
        session.includes(currency)||session.push(currency) // Validate API Request
        store.commit('users/rateMutation', { rate })

    }).catch((e: string) => notifyAction({error: 'getCurrency', e}))//.finally(() => /* always executed */)

    const rate = store.getters['users/rateGetter']

    while (!rate||rate==='abort')  break

    const customRate = rate/1500 // Get Custom Exchanged Rate
    const xRateAmount = customRate*apiData?.amount||0

    return xRateAmount // Suguffiè Coin
  } // Exchange Rate // 1 gram 0.035274 once // 1 once - 28.3495 gram

  cy = (a: { toLocaleString: (arg0: string, arg1: { style: string; currency: string | number }) => unknown }) => a?.toLocaleString(locale, { style: 'currency', currency })

  store.dispatch('config/configAction',{ locale, ipDebug }) // Config
  store.commit('users/locationMutation', {
    location: location || (data?.city+' '+data?.region||data?.country).toLowerCase()
  }) // TagAddLocation: LocationModule

  router.beforeEach(async (to, _from, next) => {
    const path = !session.includes(to.path)
    const postID = (to.path=='/post/'+to.params.id)?to.params.id:null
    const error = to.meta.error ? to.meta.error || { path: '*' } : false
    if (store.getters['users/tokenGetter']) { // Authenticated Router
      const auth = store.getters['users/authGetter'] ||
             await store.dispatch('users/authAction').catch(() => {
                   store.commit('users/logoutMutation') // Auth Check
      }); ipData = { ...data, ...{ id: auth?.id } }
      const verify = !auth?.email_verified_at && process.env.MUST_VERIFY_EMAIL
        ? error || to.meta.verify || { path: '/email/verify' }
        : to.meta.public || to.meta.auth || { path: '/' }; next(verify)
      if (auth?.[0]?.ip !== data?.ip || path) crudAction({...ipData, ...{
        url: `api/users/${auth.id}`,
        method: 'put',
        post_id: postID, // Post Views
        slug: to.path // Page Views
      }}).catch((e: string) => notifyAction({error: 'AuthenticatedAction', e}))
    } else { // Guest & Unauthenticated Route
      if (to.meta.auth) notifyAction({success: 'Please Login'})
      next(error || to.meta.public || to.meta.guest || { path: '/login' })
      if (data && path) crudAction({ ...data, ...{
        url: 'api/users',
        method: 'post',
        hostUser: to.query.hostUser, // Invite Users To Gain Money
        post_id: postID, // Post Views
        slug: to.path // Page Views
      }}).catch((e: string) => notifyAction({error: 'GuestUnauthenticatedAction', e}))
    } session.includes(to.path)||session.push(to.path) // TagBoot: AnalyticModule
  }) // Authentication
})

// Here we define a named export
// that we can later use inside .js files:
export { cy, qs, timeago, mobil, i18n, api, SANCTUM_API, baseURL, ipData, ipDebug, xRate }
