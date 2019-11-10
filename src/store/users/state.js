import { Cookies, LocalStorage } from 'quasar'

// Use Cookies
const cookie = true

export default {
  user: null,
  token: cookie ? Cookies.get('token') : LocalStorage.getItem('token') || null,
  cookie
}
