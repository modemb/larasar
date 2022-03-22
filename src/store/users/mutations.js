import { Cookies } from 'quasar'

export function loginMutation (state, payload) {
  state.token = payload.access_token || false
  if (state.token) Cookies.set('token', state.token, { expires: payload.remember ? payload.expires_in : null })
  return this.$router.push({ name: 'index' })
}

export function authMutation (state, { user }) {
  state.user = user
}

export function usersMutation (state, { users }) {
  state.users = users
}

export function rolesMutation (state, { roles }) {
  state.roles = roles
}

export function analyticsMutation (state, { analytics }) {
  state.analytics = analytics
}

export function locationMutation (state, { location }) {
  Cookies.set('location', location, { expires: 365 })
  state.location = location
}

export function logoutMutation (state) {
  state.user = null; state.token = null
  Cookies.remove('token')
  this.$router.push({ path: '/login' })
}
