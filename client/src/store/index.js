import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'

import home from './modules/home.js'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  modules: {
    home
  }
})
