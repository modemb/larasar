import { Notify } from 'quasar'
import { i18n, api, ipDebug } from 'boot/axios'
// import { i18n } from 'boot/i18n'
const qs = params => Object.keys(params).map(key => `${key}=${params[key]}`).join('&')

export async function Action (context, payload) {
  const get = payload.method === 'get' || 'GET'

  const {data} = !payload.method||await api({
    url: get ? payload.url + '?' + qs(payload) : payload.url,
    method: payload.method,
    data: payload
  }); context.dispatch('notifyAction', { ...data, ...payload })
  context.commit('Mutation', { crud: data||payload }); return data||payload
}

export async function notifyAction (context, payload) {
  if (payload.success || payload.message || (ipDebug&&payload.e)) Notify.create({
    color: payload.color || (payload.e ? 'negative':(payload.message?'orange':'positive')),
    position: payload.position || 'top',
    message: i18n.global.t(payload.success || (payload.e ? payload.error + ' ' + payload.e : payload.message)),
    icon: payload.icon || payload.e ? 'report_problem' : 'check',
    timeout: payload.timeout || payload.e ? 0 : 6000,
    actions: [ // https://quasar.dev/quasar-plugins/notify#Notify-API
      { label: !!payload.success || 'Reload', color: 'white', handler: () => location.reload() },
      { icon: 'close', color: 'white' }
    ] // https://www.youtube.com/watch?v=1wmtI4Qo-rw&ab_channel=codepanion
  }) // https://vueschool.io/articles/vuejs-tutorials/state-management-with-composition-api
}
