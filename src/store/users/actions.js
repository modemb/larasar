import { axiosInstance } from 'boot/axios'
import { Notify } from 'quasar'

export async function loginAction ({ commit, dispatch }, payload) {
  // console.log(commit)
  axiosInstance.post('api/users', payload)
    .then((response) => {
      // console.log(response)
      commit('loginMutation', response.data)
      dispatch('authAction') // Action
    })
    .catch(() => {
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'Getting Users Data Error',
        icon: 'report_problem'
      })
    })
}

export async function registerAction ({ commit, dispatch }, payload) {
  axiosInstance.post('api/register', payload)
    .then((response) => {
      Notify.create({
        color: 'positive',
        position: 'top',
        message: 'Registration Successfull',
        icon: 'check'
      })
      // console.log(response.data)
      // commit('someMutation', response.data)
    })
    .catch(() => {
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'Registration Unsuccessfull',
        icon: 'report_problem'
      })
    })
}

export async function authAction (context) {
  // console.log(context.state.token)

  await axiosInstance.get('api/user')
    .then((response) => {
      // console.log(response.data, context)
      context.commit('authMutation', { user: response.data })
    })
    .catch(() => {
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'Error Getting User Data',
        icon: 'report_problem'
      })
    })
}

export async function logoutAction ({ commit }, payload) {
  try {
    axiosInstance.post('api/users', payload)
  } catch (e) { }

  commit('logoutMutation')
}
