<<<<<<< HEAD
import { Notify, Cookies } from 'quasar'
import { axiosInstance } from 'boot/axios'
import { i18n } from 'boot/i18n'

export function configAction ({ commit }, locale) {
  if (locale) Cookies.set('locale', locale, { expires: 365 })
=======
import { Notify, LocalStorage, Cookies } from 'quasar'
import { axiosInstance, cookie } from 'boot/axios'
import { i18n } from 'boot/i18n'

export function configAction ({ commit }, locale) {
  cookie ? Cookies.set('locale', locale, { expires: 365 }) : LocalStorage.set('locale', locale, { expires: 365 })
>>>>>>> modemb/dev
  i18n.locale = locale
  axiosInstance.get('api/config')
    .then((response) => {
      const config = response.data
<<<<<<< HEAD
      console.log(locale, 'configAction')
=======
      // console.log(locale, 'configAction')
>>>>>>> modemb/dev
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
