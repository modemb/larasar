import { Cookies } from 'quasar'
import { i18n, api } from 'boot/axios'
import { useCrudStore } from 'stores/crud'

export function configAction ({ commit }, payload) {
  const { notifyAction } = useCrudStore()
  Cookies.set('locale', payload.locale, { expires: 365 })
  api.put('api/users/config', payload).then(response => {
    const config = response.data
    commit('configMutation', { config, payload })
  }).catch(e => notifyAction({error: 'configAction', e}))
  return i18n.global.locale.value = payload.locale
}
