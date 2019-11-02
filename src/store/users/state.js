// import { Cookies } from 'quasar'

export default {
  user: null,
  // token: Cookies.get('token')
  token: localStorage.getItem('token') || null
}
