import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userId: '',
    username: '',
    isLogedIn: false,
    previousLoginTime: ''
  },
  mutations: {
    login(state, response) {
      state.token = response.data.token
      state.userId = response.data.userId
      state.isLogedIn = true
      state.username = response.data.username
      state.previousLoginTime = response.data.loginTime
    },
    logout(state) {
      state.username = ''
      state.token = ''
      state.userId = ''
      state.isLogedIn = false
      state.previousLoginTime = ''
    }
  },
  actions: {
  },
  modules: {
  }
})
