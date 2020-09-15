<template>
    <form>
        <div class="container">
            <div>
                <h1 v-if="$route.name === 'login'">Login</h1>
                <h1 v-else>Register</h1>
            </div>
            <label for="username"><b>Username</b></label>
            <input v-model="username" @input="checkUserInput" type="text" placeholder="Enter Username" name="username" pattern="^[a-zA-Z0-9]{1,15}$" required>

            <label for="email"><b>Email</b></label>
            <input v-model="email" @input="checkUserInput" type="text" placeholder="Enter Email" name="email" pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$" required>

            <label for="password"><b>Password</b></label>
            <input v-model="password" @input="checkUserInput" type="password" placeholder="Enter Password" name="password" pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$" required>

            <button v-if="$route.name === 'login'" type="submit">Login</button>
            <button v-else type="submit" >Register</button>
        </div>
    </form>
</template>

<script>

export default {
  name: 'LoginRegisterForm',
  data() {
    return {
      username: '',
      email: '',
      password: ''
    }
  },
  methods: {
    checkUserInput($event) {
      if ($event.target.value.length > 0 && $event.target.value.match($event.target.pattern)) {
        $event.target.style.borderColor = 'greenyellow';
      } else {
        event.target.style.borderColor = 'red';
      }
    }
  },
}

</script>

<style>
h1 {
  text-align: center;
}

form {
  display: flex;
  justify-content: center;
}

input[type=text], input[type=password], input:focus {
  width: 100%;
  padding: 12px 20px;
  margin: 10px 0;
  display: inline-block;
  border: 3px solid #ccc;
  box-sizing: border-box;
  border-radius: 30px;
  outline: none;
}


button, button:active {
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

button:hover {
  opacity: 0.8;
}

.container {
    border: 1px solid gray;
    border-radius: 40px;
    padding: 20px;
    width: 25%;
 
}

@media only screen and (max-width: 460px) {
  .container {
    width: 70%;
    top: 15%;
    margin: 30px 0;
  }
}

@media only screen and (min-width: 461px) and (max-width: 1024px) {
  .container {
    width: 50%;
    top: 25%;
  }
}

</style>