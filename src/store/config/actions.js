import { Notify, Cookies } from 'quasar'
import { axiosInstance } from 'boot/axios'
import { i18n } from 'boot/i18n'

export function configAction ({ commit }, locale) {
  if (locale) Cookies.set('locale', locale, { expires: 365 })
  i18n.locale = locale
  axiosInstance.get('api/config')
    .then((response) => {
      const config = response.data
      console.log(locale, 'configAction')
      commit('configMutation', { config, locale })
    })
    .catch(error => {
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'configAction' + error,
        icon: 'report_problem'
      })
    })
}
