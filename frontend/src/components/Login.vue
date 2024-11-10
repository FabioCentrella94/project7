<template>
  <form>
    <img src="../assets/7plQ.gif" alt="" id="loadingGif" hidden />
    <div v-if="loggingIn == false" class="container">
      <div>
        <h1>Login</h1>
      </div>
      <label for="username"><b>Username</b></label>
      <input
        autocomplete="on"
        id="username"
        v-model="username"
        type="text"
        placeholder="Enter Username"
        name="username"
        pattern="^[a-zA-Z0-9]{1,15}$"
        required
      />
      <p hidden>Invalid Input</p>

      <label for="password"><b>Password</b></label>
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="Enter Password"
        name="password"
        pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-])\S{8,}$"
        required
      />
      <p hidden>Invalid Input</p>
      <br />
      <button type="submit" @click.prevent="login">Login</button>
    </div>
  </form>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginForm",
  data() {
    return {
      username: "",
      password: "",
      loggingIn: false,
    };
  },
  methods: {
    // PRODUCTION ENVIRONMENT
    login() {
      document.getElementById("loadingGif").removeAttribute("hidden");
      this.loggingIn = true;
      axios
        .post(
          "https://project7-backend.myportfolio.training/api/auth/login",
          {
            username: this.username,
            email: this.email,
            password: this.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.$store.commit("login", response);
            this.$router.push("/postlist");
          } else if (response.data.status === "404") {
            document.getElementById("loadingGif").setAttribute("hidden", true);
            this.loggingIn = false;
            alert(response.data.message);
            location.reload();
          } else if (response.data.status === "401") {
            document.getElementById("loadingGif").setAttribute("hidden", true);
            this.loggingIn = false;
            alert(response.data.message);
            this.$store.commit("logout");
          } else {
            document.getElementById("loadingGif").setAttribute("hidden", true);
            this.loggingIn = false;
            alert(response.data.message);
            location.reload();
          }
        })
        .catch((err) => {
          document.getElementById("loadingGif").setAttribute("hidden", true);
          this.loggingIn = false;
          alert(err);
          location.reload();
        });
    },
    // DEVELOPMENT ENVIRONMENT
    /*
    login() {
      document.getElementById("loadingGif").removeAttribute("hidden");
      this.loggingIn = true;
      axios
        .post(
          "http://localhost:3000/api/auth/login",
          {
            username: this.username,
            email: this.email,
            password: this.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.$store.commit("login", response);
            this.$router.push("/postlist");
          } else if (response.data.status === "404") {
            document.getElementById("loadingGif").setAttribute("hidden", true);
            this.loggingIn = false;
            alert(response.data.message);
          } else if (response.data.status === "401") {
            document.getElementById("loadingGif").setAttribute("hidden", true);
            this.loggingIn = false;
            alert(response.data.message);
            this.$store.commit("logout");
          } else {
            document.getElementById("loadingGif").setAttribute("hidden", true);
            this.loggingIn = false;
            alert(response.data.message);
          }
        })
        .catch((err) => {
          document.getElementById("loadingGif").setAttribute("hidden", true);
          this.loggingIn = false;
          alert(err);
          location.reload();
        });
    },
    */
  },
};
</script>

<style>
p {
  text-align: center;
  color: crimson;
}

h1 {
  text-align: center;
}

form {
  display: flex;
  justify-content: center;
}

input[type="text"],
input[type="password"],
input:focus {
  width: 100%;
  padding: 12px 20px;
  margin: 10px 0;
  display: inline-block;
  border: 3px solid #ccc;
  box-sizing: border-box;
  border-radius: 30px;
  outline: none;
}

button,
button:active {
  background-color: crimson;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  border-radius: 30px;
  outline: none;
}

button:active button:hover {
  opacity: 0.8;
}

button:disabled {
  opacity: 0.5;
}

.container {
  border: 1px solid gray;
  border-radius: 40px;
  padding: 20px;
  width: 25%;
  margin: 2% 0;
}

@media only screen and (max-width: 460px) {
  .container {
    width: 70%;
    margin: 30px 0;
  }
}

@media only screen and (min-width: 461px) and (max-width: 1024px) {
  .container {
    width: 35%;
  }
  .container > label {
    font-size: 1.7em;
  }
}

br {
  display: static;
  margin: 1% 0;
}
</style>
