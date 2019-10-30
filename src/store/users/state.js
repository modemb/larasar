import Cookies from 'js-cookie'

export default {
  user: null,
  token: Cookies.get('token')
  // token: localStorage.getItem('token') || null
}
