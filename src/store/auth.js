// import something here

// "async" is optional
export default async ({ app, router, Vue }) => {
  Vue.auth = {
    setToken (token, expiration) {
      localStorage.setItem('token', token)
      localStorage.setItem('expiration', expiration)
    },
    getToken () {
      var token = localStorage.getIem('token')
      var expiration = localStorage.getIem('expiration')

      if (!token || !expiration) return null
      if (Date.now() > parseInt(expiration)) {
        this.destroyToken()
        return null
      } else return token
    },
    destroyToken () {
      localStorage.removeItem('token')
      localStorage.removeItem('expiration')
    },
    isAuthenticated () {
      if (this.getToken()) return true
      else return false
    }
  }
  Object.defineProperties(Vue.prototype, {
    $auth: {
      get () {
        console.log(Vue.auth)
        return Vue.auth
      }
    }
  })
}
