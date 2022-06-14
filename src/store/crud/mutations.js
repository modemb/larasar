import { Cookies } from 'quasar'

export default {
  [Cookies.get('type')] (state, crud) {
    return state[Cookies.get('type')] = crud
  },
  Mutation (state, crud) {
    return state.crud = crud
  }
}
