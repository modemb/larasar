import { Cookies } from 'quasar'

export default {
  user: null,
  users: [],
  roles: {},
  analytics: [],
  distance: {},
  location: null,
  token: Cookies.get('token'),
}
