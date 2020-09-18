<template>    
    <div id="nav">
        <div>        
            <router-link to="/"><img src="../assets/Groupomania_Logos/icon-left-font-monochrome-white.svg" alt="Company Logo"></router-link>
        </div>
        <div id="linkcontainer">
            <router-link v-if="$route.name === 'register' || $route.name === 'login'" to="/">Login</router-link>
            <router-link v-if="$route.name === 'register' || $route.name === 'login'" to="/register">Register</router-link>
            <router-link v-if="$route.name !== 'register' && $route.name !== 'login'" to="/">
                <span @click="logout">Logout</span>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header',
    methods: {
        logout() {
            this.$store.commit('logout')
        }
    }
}
</script>

<style lang="scss" >

#nav {
  padding: 30px;
  background-color: crimson;
  display: flex;
  justify-content: space-between;

    img {
        width: 80%;
    }

    #linkcontainer {
        width: 25%;
        display: flex;
        justify-content: space-around;
        align-items: flex-end;

        @media only screen and (max-width: 800px) {
            flex-flow: column;;
        }

        a {
            color: white;
            text-decoration: none;
            font-size: 2rem;

             @media only screen and (max-width: 460px) {
                 font-size: 1rem;
             }

            &.router-link-exact-active {
                color: gold;
                transform: scale(0.9);
                opacity: 1;
            }

        }
    }
}

</style>