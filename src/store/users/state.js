import { Cookies, LocalStorage } from 'quasar'
import { cookie } from 'boot/axios'

export default {
  user: null,
  token: cookie ? Cookies.get('token') : LocalStorage.getItem('token') || null,
  cookie
}
