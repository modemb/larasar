import Cookies from 'js-cookie'

export function loginMutation (state, token) {
  state.token = token.access_token
  // localStorage.setItem('token', token.access_token, { expires: token.expires_in ? 365 : null })
  Cookies.set('token', token, { expires: token.expires_in ? 365 : null })
  // console.log(state, token)
}

export function logoutMutation (state) {
  state.user = null
  state.token = null

  Cookies.remove('token')
  // localStorage.removeItem('token')
}
