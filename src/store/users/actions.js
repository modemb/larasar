import { axiosInstance, locale } from 'boot/axios'
// import { i18n } from 'boot/i18n'
import { Notify } from 'quasar'

export async function loginAction ({ commit, dispatch, getters }, payload) {
  const rep = await axiosInstance.post('api/login', { ...{ locale: locale }, ...payload })
    .then(async response => {
      let token = response.data
      // let ip = ''; let format = 'json' // json, jsonp, xml, csv, yaml
      // // let { data } = await axiosInstance.get(`http://ip-api.com/${format}/${ip}`)
      // let { data } = await axiosInstance.get(`https://ipapi.co/${ip}/${format}/`)
      commit('loginMutation', { ...token, ...payload })
      dispatch('authAction')
      // dispatch('updateAction', { ...data, ...{ id: auth.id } })
    }); return rep
}

export async function registerAction ({ commit, dispatch }, payload) {
  let url = payload.api === 'register' ? 'api/register' : 'api/users'
  const data = await axiosInstance.post(url, { ...{ locale: locale }, ...payload })
    .then(response => {
      if (payload.api === 'register') dispatch('loginAction', payload)
      Notify.create({
        color: 'positive',
        position: 'top',
        message: response.data,
        icon: 'check'
      })
    }); return data
}

export async function logoutAction ({ commit }, user) {
  axiosInstance.post('api/logout', { ...{ locale: locale }, ...user })
    .then(() => { commit('logoutMutation') })
}

export async function updateAction ({ commit, dispatch }, payload) {
  try {
    const { data } = await axiosInstance.put('api/users/' + payload.id, payload)
    dispatch('authAction')
    if (data.success) {
      Notify.create({
        color: 'positive',
        position: 'top',
        message: data.success,
        icon: 'check'
      })
    } return data
  } catch {}
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
    const { data } = await axiosInstance.get('api/user')
      .catch(error => {
        Notify.create({
          color: 'negative',
          position: 'top',
          message: 'authAction ' + error,
          icon: 'report_problem'
        })
      }); context.commit('authMutation', { user: data })
    axiosInstance.post('api/users', { id: data.id }) // TagAuthAction: AnalyticModule
    return { ...data[0], ...data }
  }
}

export async function usersAction (context) {
  let token = context.getters['tokenGetter']
  let auth = await context.dispatch('authAction')
  if (token) {
    try {
      const { data } = await axiosInstance.get(`api/users/${auth.id}`)
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
