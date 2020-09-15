<template>
  <div id="app">
    <Header></Header>
    <LoginRegisterForm></LoginRegisterForm>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './components/Header';
import LoginRegisterForm from './components/LoginRegisterForm';
import Footer from './components/Footer'

export default {
  name: 'App',
  components: {
    Header,
    LoginRegisterForm,
    Footer
  },
}
</script>

<style>

#app {
  display: flex;
  justify-content: space-between;
  flex-flow: column;
  height: 100vh;
}


</style>