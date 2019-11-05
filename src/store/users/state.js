import { Cookies, LocalStorage } from 'quasar'

// Use Cookies
const cookie = false

export default {
  user: null,
  token: cookie ? Cookies.get('token') : LocalStorage.getItem('token') || null,
  cookie
}
