import { api, SANCTUM_API } from 'boot/axios'
import { useCrudStore } from 'stores/crud'

export function loginAction ({ commit }, payload) {
  const url = SANCTUM_API ? 'login' : 'api/login'
  return api.post(url, payload).then(token => {
    if (SANCTUM_API) token.data = { access_token: 'SANCTUM_API', expires_in: 365 }
    commit('loginMutation', { ...token.data, ...payload })
  })
}

export function registerAction ({ dispatch }, payload) {
  const url = payload.path?.includes('register') ? 'api/register' : 'api/users'
  return api.post(url, payload).then(response => {
    if (payload.path === '/register') dispatch('loginAction', payload)
    useCrudStore().notifyAction({ success: response.data })
  })
}

export function logoutAction ({ commit }, user) {
  const url = SANCTUM_API ? 'logout' : 'api/logout'
  return api.post(url, user).then(() => commit('logoutMutation'))
}

export async function authAction (context) {
  if (context.getters['tokenGetter']) {
    const url = SANCTUM_API ? 'user' : 'api/user'
    const { data } = await api.get(url).catch(e => {
      useCrudStore().notifyAction({error: 'authAction', e})
    }); context.commit('authMutation', { user: data })
    context.dispatch('rolesAction', data)
    return { ...data[0], ...data } // TagShow: UserModule
  } else return false
}

export async function rolesAction (context, auth) {
  if (!auth) return; try {
    const admins = auth.id === 1 || auth.role === 'Admin' ? 1 : 0
    const editors = auth.role === 'Editor' ? 1 : 0
    const users = auth.role === 'User' ? 1 : 0
    const roles = {
      admins: admins,
      editors: editors,
      users: users
    }; context.commit('rolesMutation', { roles })
  } catch (e) { useCrudStore().notifyAction({ error: 'rolesAction ', e }) }
}
