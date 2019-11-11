import { Cookies, LocalStorage } from 'quasar'

export function loginMutation (state, token) {
  state.token = token.access_token
  if (state.cookie) {
    Cookies.set('token', token.access_token, { expires: token.expires_in ? 365 : null })
  } else {
    // localStorage.setItem('token', token.access_token, { expires: token.expires_in ? 365 : null })
    LocalStorage.set('token', token.access_token, { expires: token.expires_in ? 365 : null })
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
