<template>
  <div id="app">
    <Header></Header>
    <LoginRegisterForm></LoginRegisterForm>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './components/Header';
import LoginRegisterForm from "./components/LoginRegisterForm";
import Footer from "./components/Footer";

export default {
  name: 'App',
  components: {
    Header,
    LoginRegisterForm,
    Footer
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
