import { axiosInstance } from 'boot/axios'
import { Notify } from 'quasar'

<<<<<<< HEAD
const headers = axiosInstance.defaults.headers.common

export async function loginAction ({ commit, dispatch }, payload) {
  axiosInstance.post('api/login', payload)
    .then((response) => {
      // console.log(response.data)
      commit('loginMutation', response.data)
=======
export async function loginAction ({ commit, dispatch }, payload) {
  // var b = []
  // var a = [{ user: 'register' }]
  // a.push(...b)
  // console.log(b)
  axiosInstance.post('api/users', payload)
    .then((response) => {
      // console.log(response, 'loginAction')
      commit('loginMutation', response.data)
      dispatch('authAction') // Action
>>>>>>> modemb/dev
    })
    .catch(() => {
      Notify.create({
        color: 'negative',
        position: 'top',
<<<<<<< HEAD
        message: 'Loading failed',
=======
        message: 'Getting loginAction Data Error',
>>>>>>> modemb/dev
        icon: 'report_problem'
      })
    })
}

export async function registerAction ({ commit, dispatch }, payload) {
<<<<<<< HEAD
  console.log(payload)
=======
>>>>>>> modemb/dev
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
<<<<<<< HEAD
        message: 'Loading failed',
=======
        message: 'Registration Unsuccessfull',
>>>>>>> modemb/dev
        icon: 'report_problem'
      })
    })
}

<<<<<<< HEAD
export async function nameAction (context) {
  console.log(context.state.token)
  headers['Authorization'] = `Bearer ${context.state.token}`

  axiosInstance.get('api/user')
  // this.$axios.get('api/backend')
    .then((response) => {
      console.log(response.data)
=======
export async function authAction (context) {
  // console.log(context, 'authAction')

  axiosInstance.get('api/user')
    .then((response) => {
      // console.log(response.data, 'authAction')
      context.commit('authMutation', { user: response.data })
>>>>>>> modemb/dev
    })
    .catch(() => {
      Notify.create({
        color: 'negative',
        position: 'top',
<<<<<<< HEAD
        message: 'Loading failed',
=======
        message: 'Error Getting authAction Data',
>>>>>>> modemb/dev
        icon: 'report_problem'
      })
    })
}

<<<<<<< HEAD
export async function logoutAction ({ commit }) {
  try {
    await axiosInstance.post('/api/logout')
=======
export async function logoutAction ({ commit }, payload) {
  try {
    axiosInstance.post('api/users', payload)
>>>>>>> modemb/dev
  } catch (e) { }

  commit('logoutMutation')
}
