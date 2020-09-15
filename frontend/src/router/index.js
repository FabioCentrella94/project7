import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginRegisterForm from '../components/LoginRegisterForm'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginRegisterForm
  },
  {
    path: '/register',
    name: 'register',
    component: LoginRegisterForm
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
