import { Cookies } from 'quasar'

// Use Cookies
const cookie = false

export default {
  user: null,
  token: cookie ? Cookies.get('token') : localStorage.getItem('token') || null,
  cookie
}
