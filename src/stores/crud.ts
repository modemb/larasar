
import { Cookies, Notify } from 'quasar'
import { defineStore } from 'pinia'
import { qs, i18n, api, ipDebug } from 'boot/axios'

const t = i18n.global.t
let state: object | null = Cookies.get('state')
let getters: object | null = Cookies.get('getters')

export const useCrudStore = defineStore('crud', {
  state: () => state,
  getters,
  actions: {

    setters(n: string | number) {
      state = {...{[n]: null}, ...state}
      getters = {...{[n]: (state: { [x: string]: unknown }) => state[n]}, ...getters}
      // console.log('state', state, 'getters', getters)
      Cookies.set('getters', getters, {expires: '1h'});
      Cookies.set('state', state, {expires: '1h'})
      return n
    },

    async crudAction(payload: { method: string; url: string | undefined; mutate: string }) {
      const get = payload?.method?.toLowerCase() === 'get'
      const { data } = payload.method ? await api({
        url: get ? payload.url + '?' + qs(payload) : payload.url,
        method: payload.method, data: payload
      }) : { data: payload }
      this.notifyAction({ ...(this[this.setters(payload?.mutate)]=data), ...payload })
      return data
    }, // https://medium.com/geekculture/emergency-pinia-course-7a80b8ed0b04

    notifyAction(payload: { success: string; message: string; e: string; color: string; position: undefined; error: string; icon: string; timeout: number }) {
      if (payload.success || payload.message || (ipDebug&&payload.e)) Notify.create({
        color: payload.color || (payload.e ? 'negative':(payload.message?'orange':'positive')),
        position: payload.position || 'top',
        message: t(payload.success || (payload.e ? payload.error + ' ' + payload.e : payload.message)),
        icon: payload.icon || payload.e ? 'report_problem' : 'check',
        timeout: payload.timeout ?? (payload.e||payload.message ? 0 : 6000),
        actions: [ // https://quasar.dev/quasar-plugins/notify#Notify-API
          { label: payload.success ?'': t('Reload'), color: 'white', handler: () => history.go() },
          { icon: 'close', color: 'white' }
        ]
      })//; console.log('notifyAction', payload)
    } // https://vueschool.io/articles/vuejs-tutorials/state-management-with-composition-api
  },
}) // https://blog.logrocket.com/complex-vue-3-state-management-pinia/
