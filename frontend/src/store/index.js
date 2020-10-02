import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    
  },
  mutations: {
    login(state, response) {
      sessionStorage.setItem("token", response.data.data.token);
      sessionStorage.setItem("email", response.data.data.email);
      sessionStorage.setItem("userId", response.data.data.userId);
      sessionStorage.setItem("isLogedIn", true);
      sessionStorage.setItem("username", response.data.data.username);
    },
    logout() {
      sessionStorage.clear()
    }
  },
  actions: {
  },
  modules: {
  }
})
