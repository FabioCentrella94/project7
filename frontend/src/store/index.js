import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userId: '',
    isLogedIn: false
  },
  mutations: {
    login(state, response) {
      state.token = response.data.token
      state.userId = response.data.userId
      state.isLogedIn = true
    },
    logout(state) {
      state.token = ''
      state.userId = ''
      state.isLogedIn = false
    }
  },
  actions: {
  },
  modules: {
  }
})
