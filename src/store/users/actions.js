import { axiosInstance } from 'boot/axios'
import { Notify } from 'quasar'

export async function loginAction ({ commit, dispatch }, payload) {
  axiosInstance.post('api/users', payload)
<<<<<<< HEAD
    .then((response) => {
=======
    .then(response => {
>>>>>>> modemb/dev
      const token = response.data
      commit('loginMutation', token)
      dispatch('authAction')
      // Redirect home.
      this.$router.push({ path: '/' })
    })
    .catch(error => {
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'loginAction ' + error,
        icon: 'report_problem'
      })
    })
}

export async function registerAction ({ commit, dispatch }, payload) {
  axiosInstance.post('api/register', payload)
  dispatch('loginAction', payload)
    .then(response => {
      Notify.create({
        color: 'positive',
        position: 'top',
        message: 'Registration Successfull',
        icon: 'check'
      })
    })
    .catch(error => {
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'registerActionn ' + error,
        icon: 'report_problem'
      })
    })
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
<<<<<<< HEAD
=======
}

export async function githubAuthAction (context, { provider }) {
  const { data } = await axiosInstance.post(`/api/login/${provider}`, {
    url: process.env.APP_URL // ToImplement
  })
  return data.url
>>>>>>> modemb/dev
}

export async function logoutAction ({ commit }, payload) {
  try {
    axiosInstance.post('api/users', payload)
  } catch (e) { }

  commit('logoutMutation')
}
