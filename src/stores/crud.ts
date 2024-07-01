
import { Notify } from 'quasar'
import { defineStore } from 'pinia'
import { api, included, ipDebug, mSession } from 'boot/axios'
import { Param } from 'components/models'
import { i18n } from 'boot/i18n'

const qs = (params: { [x: string]: unknown; method?: string; url?: string | undefined }) => Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
const $t = i18n.global.t
const state: any = {}
const getters = {}
// const state: any = []
// const getters: {[x: string]: any} = []

export const useCrudStore = defineStore('crud', {
  state: () => state,
  getters,
  actions: {

    async crudAction(params: Partial<Param>) {

      const bool = (b: string) => (this[b]?.length!==0) && included(b)
      const mutate = params?.mutate||'default' // Getter Index Name
      const mutation = (res: { data: any[]; total: number }) => {

        const distinctObjects = (arrayOfObjects: any[]) => arrayOfObjects?.reduce((accumulator: any[], currentObject: { id: number }) => {
          // Check if there's already an object with the same id in the accumulator
          const existingObject = this[mutate]?.data.find((obj: { id: number }) => obj.id === currentObject.id)
          // If not found, add the current object to the accumulator
          existingObject || this[mutate]?.data.push(currentObject)
          return accumulator = this[mutate]?.data
        }, []) // Get Distinct Object From Request

        if (params?.load) distinctObjects(res.data)
        else this[mutate] = res; return res // if (res?.total) this[mutate].total = res.total
      }   // ^^Mutate ^^GetterName

      // params - mutate: string - refresh: string[] - load: boolean
      if (params?.refresh) mSession(params?.refresh) // Reload Getter
      if (params?.load) 'Add To Existing Getter Without Reloading'
      else if (bool(mutate)) return this[mutate] // Existing Getter Except Bool

      const get = params?.method?.toLowerCase() === 'get'
      const { data } = params.method ? await api({
        url: get ? params.url + '?' + qs(params) : params.url,
        method: params.method, data: params // https://axios-http.com
      }) : { data: params } // Front End Data / No Http Request
      this.notifyAction({ ...mutation(data), ...params })
      return data // Server Data Req/Res | Client Data Getter
    }, // https://medium.com/geekculture/emergency-pinia-course-7a80b8ed0b04

    notifyAction(params: Partial<Param>) {
      if (params.success || params.message || (ipDebug&&params.e)) Notify.create({
        color: params.color || (params.e ? 'negative':(params.message?'orange':'positive')),
        position: params.position || 'top',
        message: $t(params.success || (params.e ? (params.error||'') + ' ' + params.e : params.message)||''),
        icon: params.icon || params.e ? 'report_problem' : 'check',
        timeout: params.timeout ?? (params.e||params.message ? 0 : 6000),
        actions: [ // https://quasar.dev/quasar-plugins/notify#Notify-API
          { label: params.success ?'': $t('reload'), color: 'white', handler: () => history.go() },
          { icon: 'close', color: 'white' }
        ] // https://vueschool.io/articles/vuejs-tutorials/state-management-with-composition-api
      })
    }
  },
}) // https://blog.logrocket.com/complex-vue-3-state-management-pinia/
