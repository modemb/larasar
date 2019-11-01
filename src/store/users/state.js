<<<<<<< HEAD
import Cookies from 'js-cookie'

export default {
  user: null,
  token: Cookies.get('token')
  // token: localStorage.getItem('token') || null
=======
// import { Cookies } from 'quasar'

export default {
  user: null,
  // token: Cookies.get('token')
  token: localStorage.getItem('token') || null
>>>>>>> modemb/dev
}
