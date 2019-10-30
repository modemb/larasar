import { axiosInstance } from 'boot/axios'
import { Notify } from 'quasar'

const headers = axiosInstance.defaults.headers.common

export async function loginAction ({ commit, dispatch }, payload) {
  axiosInstance.post('api/login', payload)
    .then((response) => {
      // console.log(response.data)
      commit('loginMutation', response.data)
    })
    .catch(() => {
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'Loading failed',
        icon: 'report_problem'
      })
    })
}

export async function registerAction ({ commit, dispatch }, payload) {
  console.log(payload)
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
        message: 'Loading failed',
        icon: 'report_problem'
      })
    })
}

export async function nameAction (context) {
  console.log(context.state.token)
  headers['Authorization'] = `Bearer ${context.state.token}`

  axiosInstance.get('api/user')
  // this.$axios.get('api/backend')
    .then((response) => {
      console.log(response.data)
    })
    .catch(() => {
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'Loading failed',
        icon: 'report_problem'
      })
    })
}

export async function logoutAction ({ commit }) {
  try {
    await axiosInstance.post('/api/logout')
  } catch (e) { }

  commit('logoutMutation')
}
