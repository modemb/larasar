import { axiosInstance, locale } from 'boot/axios'
import { Notify } from 'quasar'

export async function loginAction ({ commit, dispatch }, payload) {
  const data = await axiosInstance.post('api/users', { ...{ locale: locale }, ...payload })
    .then(response => {
      const token = response.data
      commit('loginMutation', { ...token, ...payload })
      dispatch('authAction')
      // Redirect home.
      this.$router.push({ path: '/' })
    })
  return data
}

export async function registerAction ({ commit, dispatch }, payload) {
  const data = await axiosInstance.post('api/users', { ...{ locale: locale }, ...payload })
    .then(response => {
      payload.user = 'login'
      dispatch('loginAction', payload)
      Notify.create({
        color: 'positive',
        position: 'top',
        message: response.data,
        icon: 'check'
      })
    })
  return data
}

export async function logoutAction ({ commit }, payload) {
  try {
    axiosInstance.post('api/users', payload)
  } catch (e) { }

  commit('logoutMutation')
}

export async function updateAction ({ commit, dispatch }, payload) {
  axiosInstance.put('api/users/' + payload.id, payload)
    .then(response => {
      dispatch('authAction')
      Notify.create({
        color: 'positive',
        position: 'top',
        message: response.data,
        icon: 'check'
      })
    })
}

export async function deleteAction (context, user) {
  let token = context.getters['tokenGetter']
  if (token && confirm('Are You Sure You Want To Delete User ' + user.name) === true) {
    const { data } = await axiosInstance.delete(`/api/users/${user.id}`)
    return data
  } else return 'User ' + user.name + ' Not Deleted'
}

export async function authAction (context) {
  let token = context.getters['tokenGetter']
  if (token) {
    try {
      const { data } = await axiosInstance.get('api/user')
      context.commit('authMutation', { user: data })
    } catch (error) {
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'authAction ' + error,
        icon: 'report_problem'
      })
    }
  }
}

export async function usersAction (context) {
  let token = context.getters['tokenGetter']
  if (token) {
    try {
      const { data } = await axiosInstance.get('api/users')
      context.commit('usersMutation', { users: data })
    } catch (error) {
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'usersAction ' + error,
        icon: 'report_problem'
      })
    }
  }
}

export async function socialAuthAction (context, { provider }) {
  const { data } = await axiosInstance.post(`/api/login/${provider}`)
  return data.url
}
