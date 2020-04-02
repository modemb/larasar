import { Cookies, LocalStorage } from 'quasar'
import { cookie } from 'boot/axios'

export default {
  user: null,
  users: [],
  token: cookie ? Cookies.get('token') : LocalStorage.getItem('token'),
  cookie
}
