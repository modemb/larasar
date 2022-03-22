import { api, notifyAction, SANCTUM_API } from 'boot/axios'
const qs = params => Object.keys(params).map(key => `${key}=${params[key]}`).join('&')

export function loginAction ({ commit }, payload) {
  const url = SANCTUM_API ? 'login' : 'api/login'
  return api.post(url, payload).then(token => {
    if (SANCTUM_API) token.data = { access_token: 'token', expires_in: 365 }
    commit('loginMutation', { ...token.data, ...payload })
      .then(() => dispatch('authAction'))
  })
}

export function registerAction ({ dispatch }, payload) {
  const url = payload.api === 'register' ? 'api/register' : 'api/users'
  return api.post(url, payload).then(response => {
    if (payload.api === 'register') dispatch('loginAction', payload)
    notifyAction({ success: response.data })
  })
}

export function logoutAction ({ commit }, user) {
  const url = SANCTUM_API ? 'logout' : 'api/logout'
  return api.post(url, user).then(() => { commit('logoutMutation') })
}

export async function updateAction ({ dispatch }, payload) {
  try {
    const { data } = await api.put('api/users/' + payload.id, payload)
    dispatch('authAction')
    if (data.success) notifyAction({ success: data.success }); return data
  } catch (e) { notifyAction({error: 'updateAction', e}) }
}

export async function authAction (context) {
  if (context.getters['tokenGetter']) {
    const url = SANCTUM_API ? 'user' : 'api/user'
    const { data } = await api.get(url).catch(e => {
      notifyAction({error: 'authAction', e})
    }); context.commit('authMutation', { user: data })
    context.dispatch('rolesAction', data)
    return { ...data[0], ...data } // TagShow: UserModule
  } else return false
}

export async function usersAction (context, payload) {
  const auth = await context.dispatch('authAction')
  if (!auth) return; try {
    const { data } = await api.get(`api/users/${auth.id}?${qs(payload)}`)
    context.commit('usersMutation', { users: data }); return data
  } catch (e) { notifyAction({ error: 'usersAction ', e }) }
}

export async function rolesAction (context, auth) {
  if (!auth) return; try {
    // const { data } = !auth || await api.get(`api/users/${auth.id}?role=1`)
    const admins = auth.id === 1 || auth.role === 'Admin' ? 1 : 0
    const editors = auth.role === 'Editor' ? 1 : 0
    const users = auth.role === 'User' ? 1 : 0
    const data = {
      admins: admins,
      editors: editors,
      users: users
    }; context.commit('rolesMutation', { roles: data })
  } catch (e) { notifyAction({ error: 'rolesAction ', e }) }
}

export async function analyticsAction (context, payload) {
  try {
    const { data } = await api.get(`api/users/1?${qs(payload)}`)
    context.commit('analyticsMutation', { analytics: data }); return data
  } catch (e) { notifyAction({ error: 'analyticsAction ', e }) }
}

export async function locationAction (context, location) {
  if (location) context.commit('locationMutation', location)
}

// function notify (data) {
//   // eslint-disable-next-line curly
//   if (data.success) Notify.create({
//     color: 'positive',
//     position: 'top',
//     message: data.success,
//     icon: 'check'
//   })

//   // eslint-disable-next-line curly
//   else Notify.create({
//     color: 'negative',
//     position: 'top',
//     message: data.error,
//     icon: 'report_problem'
//   })
// }

// export async function restoreAction ({ commit, dispatch }, payload) {
//   api.post('api/users', payload)
// }

// export async function deleteAction (context, user) {
//   const token = context.getters['tokenGetter']
//   if (token && confirm('Are You Sure You Want To Delete User ' + user.first_name) === true) {
//     const { data } = await api.delete(`/api/users/${user.id}?${qs(user)}`)
//     return data
//   }
// }

// export async function verifyAction ({ commit, dispatch, getters }, route) {
//   // post email/verification-notification         | verification.send
//   // get email/verify                            | verification.notice
//   // GET | email/verify/{id}/{hash}                | verification.verify
//   const url = process.env.SANCTUM ? 'email/verify' : 'api/email/verify'; try {
//     const res = await api.get(`${url}/${route.params.id}/${route.params.hash}?${qs(route.query)}`); return res
//   } catch (error) { dispatch('resendAction') }
// }

// export async function resendAction ({ commit, dispatch, getters }) {
//   const url = process.env.SANCTUM ? 'email/resend' : 'api/email/resend'
//   const res = await api.get(url); return res
// }
