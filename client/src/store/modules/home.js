/*
home state
 */
import * as types from '../mutation-types.js'

const state = {
  user: '',
  param: {
    id: 12
  }
}

const mutations = {

  [types.FETCH_USER] (state, user) {
      state.user = user
  },
  [types.PARAMETER] (state, params) {
      state.param = Object.assign({}, params);
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
