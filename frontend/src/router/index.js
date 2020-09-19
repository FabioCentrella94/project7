import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index';
import Login from '../components/Login'
import Register from '../components/Register'
import AddPost from '../components/AddPost';
import PostList from '../components/PostList';

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/addpost',
    name: 'addpost',
    component: AddPost,
    beforeEnter(to, from, next) {
      if (store.state.isLogedIn) {
        next();
      } else {
        next('/');
      }
    }
  },
  {
    path: '/postlist',
    name: 'postlist',
    meta: { 
      pageCategory: 'postlist'
    },
    component: PostList,
    beforeEnter(to, from, next) {
      if (store.state.isLogedIn) {
        next();
      } else {
        next('/');
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
