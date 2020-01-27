import { Cookies, LocalStorage } from 'quasar'
import { cookie } from 'boot/axios'

export default {
  user: null,
  users: null,
  token: cookie ? Cookies.get('token') : LocalStorage.getItem('token') || null,
  cookie
}
