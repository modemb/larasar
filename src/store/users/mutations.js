import { Cookies, LocalStorage } from 'quasar'

export function loginMutation (state, data) {
  // console.log(data, data.remember ? data.expires_in : null, )
  state.token = data.access_token
  if (state.cookie) {
    Cookies.set('token', data.access_token, { expires: data.remember ? data.expires_in : null })
  } else {
    // localStorage.setItem('token', data.access_token, { expires: data.expires_in ? 365 : null })
    LocalStorage.set('token', data.access_token, { expires: data.remember ? data.expires_in : null })
  }
}

export function authMutation (state, { user }) {
  state.user = user
}

export function logoutMutation (state) {
  state.user = null
  state.token = null
  if (state.cookie) {
    Cookies.remove('token')
  } else {
    // localStorage.removeItem('token')
    LocalStorage.remove('token')
  }
}
