/*
home state
 */
import * as types from '../mutation-types.js'

const state = {
  user: ''
}

const mutations = {

  [types.FETCH_USER] (state, user) {
      state.user = user
  }
}

const getters = {
  getUser: state =>  state.user
}

export default {
  state,
  mutations,
  getters
}
