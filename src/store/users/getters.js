export function authGetter (state) {
  return state.user
}

export function tokenGetter (state) {
  // console.log(state, 'authGetter')
  return state.token
}
