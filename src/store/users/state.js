import { Cookies } from 'quasar'

export default {
  user: null,
  users: [],
  rate: [],
  roles: {},
  // analytics: [],
  distance: {},
  currencies: [],
  currency: null,
  location: null,
  token: Cookies.get('token'),
}
