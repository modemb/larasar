import { Cookies } from 'quasar'

export default {
  [Cookies.get('type')] (state) {
    return state[Cookies.get('type')]
  },
  Getter (state) {
    return state.crud
  }
}
