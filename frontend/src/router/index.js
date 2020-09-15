import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginRegisterForm from '../components/LoginRegisterForm.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginRegisterForm
  },
  {
    path: '/Register',
    name: 'Register',
    component: LoginRegisterForm
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
