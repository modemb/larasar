// axios boot file (src/boot/axios.js)

import axios from 'axios'
import store from './../store'

// We create our own axios instance and set a custom base URL.
// Note that if we wouldn't set any config here we do not need
// a named export, as we could just `import axios from 'axios'`
const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8000'
  baseURL: 'http://localhost/larasar/public'
})

console.log(store)

export default ({ Vue }) => {
  axios.interceptors.request.use(request => {
    const token = store.getters['users/someGetter']
    if (token) request.headers.common['Authorization'] = `Bearer ${token}`
  })// ToBeFix
  // for use inside Vue files through this.$axios
  Vue.prototype.$axios = axiosInstance
}

// Here we define a named export
// that we can later use inside .js files:
export { axiosInstance }
