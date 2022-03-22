import { Cookies } from 'quasar'

export default {
  user: null,
  users: [],
  roles: [],
  analytics: [],
  token: Cookies.get('token'),//||Cookies.get('XSRF-TOKEN'),
  location: null
}
