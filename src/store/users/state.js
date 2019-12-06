import { Cookies, LocalStorage } from 'quasar'
<<<<<<< HEAD

// Use Cookies
const cookie = true
=======
import { cookie } from 'boot/axios'
>>>>>>> modemb/dev

export default {
  user: null,
  token: cookie ? Cookies.get('token') : LocalStorage.getItem('token') || null,
  cookie
}
