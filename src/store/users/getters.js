<<<<<<< HEAD
export function someGetter (state) {
  console.log(state)
  return state
=======
export function authGetter (state) {
  return state.user
}

export function tokenGetter (state) {
  // console.log(state, 'authGetter')
  return state.token
>>>>>>> modemb/dev
}
