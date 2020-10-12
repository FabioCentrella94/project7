import Vue from 'vue'
import VueRouter from 'vue-router'
<<<<<<< HEAD
import LoginRegisterForm from '../components/LoginRegisterForm.vue'
=======
import Login from '../components/Login'
import Register from '../components/Register'
import AddPost from '../components/AddPost';
import PostList from '../components/PostList';
import Profile from '../components/Profile';
import SinglePost from '../components/SinglePost';
import EditPost from '../components/EditPost';
import NotFound from '../components/NotFound';
>>>>>>> e8cc3fc9295f8adb701f209b11b32b6bda15d99f

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
<<<<<<< HEAD
    name: 'Login',
    component: LoginRegisterForm
  },
  {
    path: '/Register',
    name: 'Register',
    component: LoginRegisterForm
=======
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
      if (sessionStorage.getItem('isLogedIn') !== null) {
        next();
      } else {
        next('/');
      }
    }
  },
  {
    path: '/postlist',
    name: 'postlist',
    component: PostList,
    beforeEnter(to, from, next) {
      if (sessionStorage.getItem('isLogedIn') !== null) {
        next();
      } else {
        next('/');
      }
    }
  },
  {
    path: '/profile/:userId',
    name: 'profile',
    component: Profile,
    beforeEnter(to, from, next) {
      if (sessionStorage.getItem('isLogedIn') !== null) {
        next();
      } else {
        next('/');
      }
    }
  },
  {
    path: '/singlepost/:postId',
    name: 'singlepost',
    component: SinglePost,
    beforeEnter(to, from, next) {
      if (sessionStorage.getItem('isLogedIn') !== null) {
        next();
      } else {
        next('/');
      }
    }
  },
  {
    path: '/editpost/:postId',
    name: 'editpost',
    component: EditPost,
    beforeEnter(to, from, next) {
      if (sessionStorage.getItem('isLogedIn') !== null) {
        next();
      } else {
        next('/');
      }
    }
  },
  {
    path :'*',
    name: 'notfound',
    component: NotFound
>>>>>>> e8cc3fc9295f8adb701f209b11b32b6bda15d99f
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
