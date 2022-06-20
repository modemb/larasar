import { Cookies } from 'quasar'
import { i18n, api, notifyAction } from 'boot/axios'

export function configAction ({ commit }, payload) {
  i18n.global.locale = payload.locale
  Cookies.set('locale', payload.locale, { expires: 365 })
  api.post('api/users', payload).then(response => {
    const config = response.data
    commit('configMutation', { config, payload })
  }).catch(e => notifyAction({error: 'configAction', e}))
}
