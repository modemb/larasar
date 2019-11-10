<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { Cookies } from 'quasar'
=======
import { Cookies, LocalStorage } from 'quasar'
>>>>>>> modemb/dev

// Use Cookies
const cookie = false

export default {
  user: null,
<<<<<<< HEAD
  token: cookie ? Cookies.get('token') : localStorage.getItem('token') || null,
=======
  token: cookie ? Cookies.get('token') : LocalStorage.getItem('token') || null,
>>>>>>> modemb/dev
=======
=======
>>>>>>> modemb/dev
import { Cookies, LocalStorage } from 'quasar'

// Use Cookies
const cookie = true

export default {
  user: null,
  token: cookie ? Cookies.get('token') : LocalStorage.getItem('token') || null,
<<<<<<< HEAD
>>>>>>> modemb/dev
=======
>>>>>>> modemb/dev
  cookie
}
