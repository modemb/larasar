import { Cookies, LocalStorage } from 'quasar'

export function loginMutation (state, data) {
  state.token = data.access_token
  if (state.cookie) Cookies.set('token', data.access_token, { expires: data.remember ? data.expires_in : null })
  else LocalStorage.set('token', data.access_token, { expires: data.remember ? data.expires_in : null })
  // localStorage.setItem('token', data.access_token, { expires: data.expires_in ? 365 : null })
}

export function authMutation (state, { user }) {
  state.user = user
}

export function usersMutation (state, { users }) {
  state.users = users
}

export function logoutMutation (state) {
  state.user = null
  state.token = null
  if (state.cookie) Cookies.remove('token')
  else LocalStorage.remove('token')
  // localStorage.removeItem('token')
  // Redirect to login.
  this.$router.push({ name: 'public.login' })
}
