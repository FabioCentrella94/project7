<template>
  <div id="app">
    <Header></Header>
    <Login v-if="$route.name === 'login'" @logingIn="logedUser" :key="$route.fullPath"></Login>
    <Register v-if="$route.name === 'register'" @logingIn="logedUser" :key="$route.fullPath"></Register>
    <AddPost v-if="$route.name === 'addpost'"></AddPost>
    <PostList v-if="$route.name === 'postlist'"></PostList>
    <Footer v-if="$route.name !== 'postlist'"></Footer>
  </div>
</template>

<script>
import Header from './components/Header';
import Footer from "./components/Footer";
import Login from './components/Login';
import Register from './components/Register';
import AddPost from './components/AddPost';
import PostList from './components/PostList';


export default {
  name: 'App',
  data() {
    return {
      loggedIn: false,
      userId: ''
    }
  },
  components: {
    Header,
    Footer,
    Login,
    Register,
    AddPost,
    PostList
  },
  methods: {
    logedUser(logingIn) {
      console.log(this.loggedIn)
      console.log(this.userId)
      this.userId = logingIn
      this.loggedIn = true;
      console.log(this.loggedIn)
      console.log(this.userId)
    }
  }
}
</script>

<style>
#app {
  height: 100vh;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}
</style>
