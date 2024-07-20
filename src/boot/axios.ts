import { Cookies, LocalStorage, QUploaderFactoryFn } from 'quasar'
import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { createPinia } from 'pinia'
import { useCrudStore } from 'stores/crud'
import { format, register, TDate } from 'timeago.js'
import Currencies from 'components/json/Countries.json'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { i18n } from './i18n'

// let i18n: { global: { t: any; locale: { value: string } } }

let ipData: any; let ipDebug = 0;
let timeago: (date: TDate) => string
let cy: (a: number) => string
// let cy: (a: { toLocaleString: (arg0: string, arg1: { style: string; currency: string | number }) => unknown }) => number
let xRate: (arg0: any) => number // https://collect.js.org
// let xRate: (arg0: {
//   error: {code: string}; message: string; currency_code: string; id: number; date: string;
//   info: { rate: number; timestamp: number }; result: number; success: boolean;
//   query: { amount: number; from: string; to: string };
// }) => number // https://collect.js.org
let getAppDisplayMode: (bool: boolean) => string | false | undefined
let deleteAllCookies: () => void
let categoriesAction: (params: object) => Promise<unknown>
let configAction: () => Promise<unknown>
let currenciesAction: () => Promise<unknown>
let authAction: () => Promise<unknown> | null
let logUserAction: (userId: number) => void
let logoutAction: () => void
let loginMutation: ({ token, remember }: { token: string; remember: boolean }) => void
let locationMutation: (location: string) => void
let shareMutation: (auth: { credit: number; name: string }) => any
let filesMutation: (files: Blob[]) => QUploaderFactoryFn

const session: string[] = []
const included = (e: string, s = false) => {
  if (session.includes(e)) s = session.includes(e)
  else session.push(e); return s // Session Management
} // TagSession: SessionModule
const mSession = (elements: string[]) => {
  if (elements[0] === 'reloadApp') session.length = 0
  elements.forEach(elementToRemove => {
    const index = session.indexOf(elementToRemove)
    if (index !== -1) session.splice(index, 1)
  }) // Remove Elements
} // TagSession: ManagementSessionModule

const ipDebugData = [LocalStorage.getItem('ip')] // TagIpDebug: IpDebugModule
const mobile = (process.env.MODE === 'capacitor')||(process.env.MODE === 'cordova')
const API_URL = (process.env.DEV||origin?.includes('localhost'))
                ?process.env.DEV_URL:process.env.API_URL
const baseURL = mobile?(process.env.PROD?API_URL:process.env.DEV_MOBIL_URL):API_URL
const mobileApp = mobile||('app' in navigator)

const MAIL_VERIFY = process.env.MAIL_VERIFY==='true'?true:false
const MAIL_CODE = process.env.MAIL_CODE==='true'?true:false
const SANCTUM_API = process.env.SANCTUM_API==='true'?true:false

const http = // mobileApp ? capacitor()?.CapacitorHttp.request :
  axios.create

declare global {
  interface Window {
    Pusher: any;
    Echo: any;
    array: any;
    deferredPrompt: Event | null;
    location: Location;
  }
  interface Navigator {
    standalone: boolean
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client) api.defaults.withCredentials = true
const api = http({ baseURL, withCredentials: true })

export default boot(async ({ app, router }) => {

  // i18n = app?.__VUE_I18N__
  // i18n = app?.i18n

  let currency: any;
  const $t = i18n.global.t
  const locale = i18n.global.locale.value

  const authenticate = (payload: { url: string; remember: boolean }) => api.post(payload.url, payload)
    .then(({ data }) => loginMutation({ token: data, remember: payload.remember }))
    .catch(e => notifyAction({error: 'authenticate', e}))

  app.use(createPinia())
  const store = useCrudStore()
  const { crudAction, notifyAction } = store

  // https://quasar.dev/quasar-cli-vite/handling-process-env#introduction

  // https://quasar.dev/quasar-plugins/cookies#introduction
  // const allCookies = $q.cookies.getAll() // {index: data}
  // console.log('cookies', Cookies.getAll().location)
  // console.log('process.env.MODE', process.env.MODE)

  deleteAllCookies = () => api.delete('api/users/deleteAllCookies')
    .then(() => notifyAction({e: 'ServerDeletedAllCookies' }))
    .catch(e => notifyAction({error: 'deleteAllCookiesErr', e}))
    .finally((cookies = document.cookie.split(';')) => {
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]; Cookies.remove('XSRF-TOKEN')
        const eqPos = cookie.indexOf('=') // let cookies = document.cookie.split(';')
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
        if (cookies.length===1) notifyAction({e: 'AllCookiesDeletedClient'})
      } // loginMutation({ token: true, remember: false })
    }) // TagDeleteAllCookie

  currenciesAction = () => crudAction({
    url: 'api/users/currencies', method: 'get',
    currenciesData: 'currencies', mutate: 'currenciesGetter'
  }).catch((e: unknown) => notifyAction({error: 'currenciesAction', e}))

  configAction = () => crudAction({
    url: 'api/users/config',
    method: 'put', // locale,
    mutate: 'configGetter',
    refresh: ['configGetter'],
    id: store.authGetter?.id,
    locale: i18n.global.locale.value,
    update: store.authGetter?.id
  }).catch((e: unknown) => notifyAction({error: 'configAction', e}))

  categoriesAction = (params: object) => crudAction({
    url: 'api/categories/categories', ...params,
    method: 'get', mutate: 'categoriesGetter'
  }).catch((e: unknown) => notifyAction({error: 'categoriesAction', e}))

  authAction = () => {

    if (Cookies.get('XSRF-TOKEN')) {
      const url = SANCTUM_API ? 'user' : 'api/user'

      // if (store.tokenGetter?.token)
      return crudAction({
        url, method: 'get',
        mutate: 'authGetter',
        refresh: ['authGetter']
      }).catch((e: unknown) => { if (Cookies.get('token'))
        notifyAction({error: 'authAction', e})//; logoutAction()
      }); //else return null
    } else return null
  } // TagAuth: UserModule

  logUserAction = (userId: number) => {
    if (userId!==1) {
      const authID = store.authGetter?.id
      crudAction({ authID, mutate: 'authIdGetter', refresh: ['authIdGetter'] }); api({
        url: 'api/users',
        method: 'post',
        data: { log: true, userId }
      }).then(() => {
        mSession(['reloadApp'])
        authAction()
        router.push({ path: '/' })
      }).catch(e => notifyAction({error: 'logUserAction', e}))
    } else notifyAction({message: 'Super Admin Not Allowed'})
  } // TagLogUser: UserModule

  logoutAction = () => {
    const url = SANCTUM_API ? 'logout' : 'api/logout'
    api.post(url, store.authGetter).then(() => {
      Cookies.remove('token')
      store.tokenGetter = store.authGetter = null
    }).catch(e => {
      notifyAction({error: 'logoutAction', e})
      setTimeout(() => deleteAllCookies(), 1500)
    }).finally(() => router.push({ path: '/login' }))
  } // TagLogout: UserModule

  filesMutation = (files: Blob[]): QUploaderFactoryFn => {
    const array: (string | ArrayBuffer | null)[] = []
    for (let i = 0; i < files?.length; i++) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) array.push(e.target.result)
        if (i+1 === files.length) crudAction({
          array, mutate: 'filesGetter',
          refresh: ['filesGetter']
        }) // readAsText - readAsBinaryString - readAsArrayBuffer
      }; reader.readAsDataURL(files[i])
    } return store.filesGetter?.array
  } // TagFilesMutation: FileModule

  loginMutation = ({ token, remember }) => {

    Cookies.set('token', token, { expires: remember ? 365 : '' })

    console.log('data', token, remember)
    crudAction({token, mutate: 'tokenGetter', refresh: ['tokenGetter']})
    authAction()?.then(() => router.push({ name: 'index' }))

  } // TagLogin: UserModule

  locationMutation = (location: string) => {
    Cookies.set('location', location, { expires: 365 })
    crudAction({ location, mutate: 'locationGetter', refresh: ['locationGetter'] })
  } // TagLocation: UserModule

  shareMutation = (auth: { credit: number; name: string }) => crudAction({ shareData: {
    credit: auth?.credit, // TagShare: UserModule - Navigator Share
    url:  window.origin + '/' + (auth?.name||''),
    banner: $t('Share Your Affiliate Link And Gain Users'),
    tooltip: $t('Share and earn credit with your affiliate link'),
    title: $t('One minute to register, share and earn money'),
    text: $t('One minute to register, share and earn money'),
  }, mutate: 'shareDataGetter', refresh: ['shareDataGetter']})

  api.interceptors.request.use(async (request) => {

    const { data } = request; console.log(
      // `%curl: %c${baseURL}`,
      // 'color: red; font-size: 24px', 'color: green; font-size: 24px',
      // 'NODE_ENV', process.env.NODE_ENV, 'MODE', process.env.MODE,
      // 'mobileApp', mobileApp, 'navigator', JSON.stringify(navigator),
      // 'target', JSON.stringify(process.env.TARGET),
      // 'userAgent', JSON.stringify(navigator.userAgent),
      // 'referrer', document.referrer.startsWith('capacitor://'),
      // 'CapacitorHttp', capacitor()?.CapacitorHttp.request,
      // 'canShare()', (await capacitor()?.Share.canShare())?.value
      // 'device_name', navigator.userAgent.match(/\(([^)]+)\)/)[1].split(';')[0].split(' ')[0],
      // 'navigator.language', navigator.language
      // 'i18n.global.locale', i18n.global.locale//.valueOf
      'filesGetter', store.filesGetter?.array
    ) // Console With Style

    if (data?.token?.includes('csrf')&&!Cookies.get('XSRF-TOKEN')&&SANCTUM_API)
      api.get('/sanctum/csrf-cookie').then(() => authenticate(data))
        .catch(e => notifyAction({error: 'XSRF-TOKEN-GET', e}))

    const token = Cookies.get('token') // store.tokenGetter?.token
    if (token) request.headers['Authorization'] = `Bearer ${token}`
    request.headers['Accept-Language'] = i18n.global.locale.value
    request.headers['DEV'] = process.env.DEV
    request.headers['IP-DEBUG'] = Number(LocalStorage.getItem('debug')) // 1
    // ipDebug //= store.configGetter?.ipDebug
    // if (window.Echo.socketId()) request.headers['X-Socket-ID'] = window.Echo.socketId()
    // request.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    // request.headers.common['Content-Type'] = 'multipart/form-data'
    return request // https://laravel.com/docs/10.x/sanctum#issuing-api-tokens
  }) // Request interceptor

  api.interceptors.response.use(response => response, error => {
    const { response: { status } } = error

    if (status >= 500) notifyAction({ message: 'error_alert_text' })//, timeout: 6000
    if (status === 401 && store.authGetter) {
      logoutAction(); notifyAction({
          message: 'token_expired_alert_title',
          timeout: 10000
      })
    } return Promise.reject(error)
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

  const localeFn = (_number: number, index: number): any => {
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
    ][index]
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
        }).then((response: { data: unknown }) => callback(false, response.data))
          // .catch(error => callback(true, error))
          // .catch(() => notifyAction({message: 'notifyErr'}))
          .catch((e: unknown) => notifyAction({error: 'EchoErr', e}))
      }// client: window.Pusher // https://pusher.com/docs/channels/server_api/http-api#publishing-events
    } // https://www.youtube.com/watch?v=zooUbo0tz6U&t=341s
  }) // https://laravel.com/docs/9.x/broadcasting#server-side-installation

  const Format = 'json' // json, jsonp, xml, csv, yaml
  const { data } = await axios.get(`https://ipapi.co/${''/* IP */}/${Format}`)
        .catch(e => notifyAction({error: 'ipData', e}))
          || await axios.get(`http://ip-api.com/${Format}/${''/* IP */}`)
        .catch(e => notifyAction({error: 'ipData', e}))
          || {data:{}} // No Network

  const location = Cookies.get('location') ||
   (data?.city+' '+data?.region||data?.country).toLowerCase()

  if (!data?.ip) data.ip = 'noip'+Date.now()

  ipDebugData.forEach(ip => {
    if (data?.ip === ip) ipDebug = Number(LocalStorage.getItem('debug')) // 1
  }) // TagIpDebug: IpDebugModule

  getAppDisplayMode = (bool: boolean) => {

    const userAgent = navigator.userAgent
    const twa = userAgent.includes('modembIos') ? 'iOS' :
    (userAgent.includes('modembAndroid') ? 'Android' : '')

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const success = mobileApp || document.referrer.startsWith('android-app://') ? twa :
      ((navigator.standalone || isStandalone) ? 'standalone' : 'browser')
    if (bool) return (success !== 'browser') ? success : false
    notifyAction({ success }) // Trusted Web Activity (TWA)
  }; data.app = getAppDisplayMode(true)||'browser'

  xRate = amount => {
  // xRate = (amount: number | {[x: string]: unknown | {[x: string]: number}}) => {

    const auth = store.authGetter
    currency = store.currencyGetter?.currency
      || amount?.currency_code // PopUp Users
      || auth?.currency_code // Auth User
      || data?.currency // Api Currency

    const currencyInfo: any = Currencies[currency]

    const myHeaders = new Headers()
    myHeaders.append('apikey', process.env.EXCHANGE_RATES_API||'')

    const apiData: any = {
      url: 'api/users/xRate',
      method: 'PUT',
      mutate: 'rateGetter',
      refresh: ['rateGetter'],
      rate: amount?.info?.rate, // API Rate
      result: amount?.result,
      auth_id: amount?.id||auth?.id,
      updateUser: amount?.id||amount?.info?.rate, // User Rate And Currency
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
      // ====Api End=== \\
    }; if (!store.rateGetter||apiData.apiMessage||amount?.id||apiData?.rate>0)
    crudAction(apiData).then((rate: number) => {

      console.log(
        'rate', rate, 'api.rate', apiData.rate,
        'currency', currency,
        // 'apiData', apiData
        'auth.id', apiData.auth_id,
        // 'updateUser', apiData.update,
        // 'rateNumber', rate>0,'rate', rate,
        // 'isNaN(rate)', isNaN(rate),
        // 'session', session.includes(currency),
        // '!isNaN(amount)', !isNaN(amount),
        // 'Number(amount)', Number(amount),
      ); //const rate = data

      if (amount?.id||apiData.rate>0) authAction() // Refresh Updated Currency On the Database
      if (!auth) return; if (rate > 0) return // Rate Mutated
      else if (included(currency)) return notifyAction({ error: 'included', e:currency }) // Validate Currency Api
      else if (Number.isNaN(amount)) return notifyAction({ error: 'amount', e:amount }) // Validate Amount
      else apiData.method = 'GET' // Get Exchanged Rate

      if (baseURL?.includes('https')) notifyAction({success: 'Currency Rate Updated'})
      else notifyAction({success: 'Local Currency Rate Updated'})

      if (baseURL?.includes('https')) fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${apiData.to}&from=${apiData.from}&amount=1`, apiData)
        .then(response => response.json()) // https://apilayer.com/marketplace/exchangerates_data-api#details-tab
        .then(result => xRate(result)) //, console.log('resultRate', result?.info?.rate)
        .catch(e => notifyAction({error: 'fetchCurrency', e})) // https://gist.github.com/ksafranski/2973986
      else xRate({ // Local Currency Rate
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
        error: {
          code: amount?.error?.code
        },
        message: amount?.message,
        currency_code: amount?.currency_code,
        id: amount?.id
      }) // fetch('https://api.apilayer.com/exchangerates_data/convert', apiData)
    }).catch((e: unknown) => notifyAction({error: 'getCurrency', e}))

    const rate = store.rateGetter //apiData.rate||

    while (!rate||rate==='abort') break

    const customRate = rate/1500 // Get Custom Exchanged Rate Based On Gold
    const xRateAmount = customRate*apiData?.amount||0//; console.log( 'rate2', rate)

    return xRateAmount // Suguffiè Dinar - SUD
  } // Exchange Rate // 1 gram 0.035274 once // 1 once - 28.3495 gram

  cy = a => a?.toLocaleString(locale, { style: 'currency', currency })
  // cy = (a: { toLocaleString: (arg0: string, arg1: { style: string; currency: string | number }) => unknown }) => a?.toLocaleString(locale, { style: 'currency', currency })

  configAction() // Config
  locationMutation(location) // TagAddLocation: LocationModule

  router.beforeEach(async (to, _from, next) => {
    const path = !included(to.path) // !session.includes(to.path)
    const post_id = (to.path=='/post/'+to.params.id)?to.params.id:null
    const error = to.meta.error ? to.meta.error || { path: '*' } : false
    const auth = store.authGetter || await authAction()

    console.log('ipDebug', ipDebug, 'session', session)

    if (store.authIdGetter?.authID) data.ip = null // Prevent Analytic On Logged User
    if (auth) { // Authenticated Router

      // ipData.currency_code = 'xof'
      // ipData.update = !auth.currency_code

      ipData = { ...data, id: auth?.id }

      const mailVerify = //(!ipDebug?mobileApp:'') ? false : // AppsNeedVerification
        (ipDebug?store.authIdGetter?.authID:'') ? false : // authCanByPassVerification
        (!auth?.email_verified_at && (MAIL_VERIFY||MAIL_CODE))

        // ((!auth?.email_verified_at && MAIL_VERIFY) ||
        // (!auth?.email_verified_at && MAIL_CODE))

        // console.log('mailVerify', mailVerify)

      const verify = mailVerify
        ? error || to.meta.verify || { path: '/email/verify' }
        : to.meta.public || to.meta.auth || { path: '/' }; next(verify)
      if (auth?.[0]?.ip !== data?.ip || path) api({
        url: `api/users/${auth.id}`, method: 'put',
        data: {...ipData, post_id, /* Post Views */ slug: to.path /* Page Views */ }
      }).catch(e => notifyAction({error: 'AuthenticatedAction', e}))
        .then(({ data }) => notifyAction(data))
    } else { // Guest & Unauthenticated Route
      if (to.meta.verify || to.meta.auth) notifyAction({success: 'Please Login'})
      next(error || to.meta.public || to.meta.guest || { path: '/login' })
      if (data && path) api({
        url: 'api/users',
        method: 'post',
        data: { ...data,
          hostUserName: to.path.substring(to.path.lastIndexOf('/') + 1),
          post_id, // Post Views | Invite Users To Gain Money ^^^
          slug: to.path /* Page Views */ }
      }).catch(e => notifyAction({error: 'GuestUnauthenticatedAction', e}))
        .then(({ data }) => notifyAction(data))
    } //session.includes(to.path)||session.push(to.path) // TagBoot: AnalyticModule
  }) // Authentication
})

export {
  cy, xRate, deleteAllCookies, getAppDisplayMode, mSession, included,
  authAction, categoriesAction, configAction, logUserAction, logoutAction,
  currenciesAction, loginMutation, locationMutation, shareMutation, filesMutation,
  timeago, i18n, api, baseURL, mobileApp, ipData, ipDebug,
  SANCTUM_API, MAIL_VERIFY, MAIL_CODE
} // Here we define a named export that we can later use inside .js files:
