import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import crud from './crud'
import users from './users'
import config from './config'

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      crud,
      users,
      config
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})

