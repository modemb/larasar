// import Cookies from 'js-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'
import * as types from '../mutation-types'

// state
export const state = {
  users: null
}

// getters
export const getters = {
  users: state => state.users,
}

// mutations
export const mutations = {
  [types.FETCH_USERS] (state, users) { 
    state.users = users.data    
  },
  [types.UPDATE_USERS] (state, {users}) {
    state.users = users     
  }
}

// actions
export const actions = {  
  async getUser ({ commit }) {
    commit(types.FETCH_USERS, await axios.get('api/users')) 
  },
  updateUser ({ commit }, payload) {
    commit(types.UPDATE_USERS, payload)
  },
  deleteUser ({ commit }, id) {
    Swal.fire({
      title: `Are you sure you want to delele user ${id}?`,
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async result => {
      if (result.value) {       

        await axios.delete(`/api/users/${id}`)

        Swal.fire(
          'Deleted!',
          'User has been deleted.',
          'success'
        )

        commit(types.FETCH_USERS, await axios.get('api/users'))
      }
    })       
  }
} 
 
