<template>
  <div id="nav">
    <div>
      <router-link to="/"
        ><img
          src="../assets/Groupomania_Logos/icon-left-font-monochrome-white.svg"
          alt="Company Logo"
      /></router-link>
    </div>
    <div id="linkcontainer">
      <router-link
        v-if="$route.name === 'register' || $route.name === 'login'"
        to="/"
        >Login</router-link
      >
      <router-link
        v-if="$route.name === 'register' || $route.name === 'login'"
        to="/register"
        >Register</router-link
      >
      <router-link
        v-if="
          $route.name !== 'register' &&
          $route.name !== 'login' &&
          $route.name !== '/postlist'
        "
        to="/postlist"
        >Home</router-link
      >
      <router-link
        v-if="$route.name !== 'register' && $route.name !== 'login'"
        :to="{ name: 'profile', params: { userId: getUserId } }"
        >Profile</router-link
      >
      <router-link
        v-if="$route.name !== 'register' && $route.name !== 'login'"
        to="/addpost"
        >Upload</router-link
      >
      <router-link
        v-if="$route.name !== 'register' && $route.name !== 'login'"
        to="/"
      >
        <span @click="logout">Logout</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  computed: {
    getUserId() {
      return sessionStorage.getItem("userId");
    },
  },
  methods: {
    logout() {
      this.$store.commit("logout");
    },
  },
};
</script>

<style lang="scss">
#nav {
  padding: 1.5% 1.5%;
  background-color: crimson;
  display: flex;
  justify-content: space-between;

  @media only screen and (max-width: 1024px) {
    flex-flow: column;
    padding: 2% 2%;
  }

  img {
    width: 80%;
  }

  #linkcontainer {
    width: 40%;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;

    @media only screen and (max-width: 1024px) {
      margin: 3% 0 0 0;
      width: 100%;
    }

    a {
      color: white;
      text-decoration: none;
      font-size: 1.8rem;

      @media only screen and (max-width: 460px) {
        font-size: 1.3rem;
      }

      @media only screen and (max-width: 360px) {
        font-size: 1rem;
      }

      &.router-link-exact-active {
        background-color: white;
        color: crimson;
        border-radius: 50px;
        padding: 2%% 3%;
        opacity: 1;
      }
    }
  }
}
</style>
