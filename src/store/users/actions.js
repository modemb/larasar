import { qs, api, notifyAction, SANCTUM_API } from 'boot/axios'

export function loginAction ({ commit, dispatch }, payload) {
  const url = SANCTUM_API ? 'login' : 'api/login'
  return api.post(url, payload).then(token => {
    if (SANCTUM_API) token.data = { access_token: 'token', expires_in: 365 }
    commit('loginMutation', { ...token.data, ...payload })
      .then(() => dispatch('authAction'))
  })
}

export function registerAction ({ dispatch }, payload) {
  const url = payload.path?.includes('register') ? 'api/register' : 'api/users'
  return api.post(url, payload).then(response => {
    if (payload.path === '/register') dispatch('loginAction', payload)
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
