<template>
    <form>
        <img src="../assets/7plQ.gif" alt="" id="loadingGif" hidden>
        <div v-if="loggingIn == false" class="container">
            
            <div>
                <h1>Register</h1>
            </div>

            <div>
              <label for="username"><b>Username</b></label>
              <input v-model="username" @blur="checkUserInput"  @input="checkUserInput($event); enableSubmitButton();" type="text" placeholder="Enter Username" name="username" pattern="^[a-zA-Z0-9]{1,15}$" required>
              <p hidden>Required Field! Only Numbers And Letters!</p>
            </div>

            <div>
              <label for="email"><b>Email</b></label>
              <input v-model="email" @blur="checkUserInput"  @input="checkUserInput($event), enableSubmitButton()" type="text" placeholder="Enter Email" name="email" pattern="^\S[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$" required>
              <p hidden>Required Field! Match the E-Mail Format!</p>
            </div>

            <div>
              <label for="password"><b>Password</b></label>
              <input v-model="password" @blur="checkUserInput" @input="checkUserInput($event), enableSubmitButton()" type="password" placeholder="Enter Password" name="password" pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])\S{8,}$" required>
              <p hidden>Required Field! 1 Numbers, 1 Letter, 1 Symbol, 1 Uppercase, 1 Lowercase And At Least 8 digits!</p>
            </div>

            <button type="submit" @click.prevent="register" disabled>Register</button>
        </div>
    </form>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegistrationForm',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      loggingIn: false
    }
  },
  methods: {
    checkUserInput($event) {
      if (this.$route.name === 'register') {
        if ($event.target.value.length > 0 && $event.target.value.match($event.target.pattern)) {
          $event.target.style.borderColor = 'greenyellow';
          $event.target.nextSibling.setAttribute('hidden', true)
        } else {
          event.target.style.borderColor = 'red';
          $event.target.nextSibling.removeAttribute('hidden')
        }
      }
    },
    enableSubmitButton() {
      let inputElement = document.querySelectorAll('input');
      let submitButton = document.getElementsByTagName('button')[0];
      if (this.$route.name === 'register') {
        for (let i = 0; i < inputElement.length; i++) {
          if (
          inputElement[0].value.length >= 1 &&
          inputElement[0].value.match(inputElement[0].pattern) &&
          inputElement[1].value.length >= 1 &&
          inputElement[1].value.match(inputElement[1].pattern) &&
          inputElement[2].value.length >= 1 &&
          inputElement[2].value.match(inputElement[2].pattern)
          ) {
          submitButton.removeAttribute('disabled');
          } else {
          submitButton.setAttribute('disabled', true)
          }
        }
      }
    },
    register() {
      this.loggingIn = true
      document.getElementById('loadingGif').removeAttribute('hidden')
      axios.post('http://localhost:3000/api/auth/signup',
        {
        username: this.username,
        email: this.email,
        password: this.password,
        },
        { headers:
          {
            'Content-Type': 'application/json' 
          }
        }
      ).then((response) => {
          if (response.data.status === '201') {
            setTimeout(() => { this.login() }, 1000)
          } else if (response.data.status === '409' && response.data.message === 'Username already used!' ) {
            document.getElementById('loadingGif').setAttribute('hidden', true);
            this.loggingIn = false
            alert(response.data.message);
            setTimeout(() => {
              let usernameInput = document.getElementsByName('username')
              usernameInput[0].style.borderColor = 'crimson';
            }, 400)
          } else if (response.data.status === '409' && response.data.message === 'Email already used!' ) {
            document.getElementById('loadingGif').setAttribute('hidden', true);
            this.loggingIn = false
            alert(response.data.message);
            setTimeout(() => {
              let emailInput = document.getElementsByName('email')
              emailInput[0].style.borderColor = 'crimson';
            }, 1000)
          } else {
            document.getElementById('loadingGif').setAttribute('hidden', true);
            this.loggingIn = false
            alert(response.data.message)
          }
      }).catch((err => {
          document.getElementById('loadingGif').setAttribute('hidden', true);
          this.loggingIn = false
          alert(err)
        })
      )
    },
      login() {
      axios.post('http://localhost:3000/api/auth/login',
        {
        username: this.username,
        email: this.email,
        password: this.password,
        },
        { headers:
          {
            'Content-Type': 'application/json' 
          }
        }
      ).then((response) => {
        if (response.data.status === '200') {
          this.$store.commit('login', response)
          this.$router.push("/postlist")
        } else {
          document.getElementById('loadingGif').setAttribute('hidden', true);
          this.loggingIn = false
          alert(response.data.message)
        }
      }).catch((err => {
          document.getElementById('loadingGif').setAttribute('hidden', true);
          this.loggingIn = false
          alert(err)
        })
      )
    }
  }
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
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    margin: 10% auto 10% auto;
}

.container > p {
  text-align: center;
  color: crimson;
}

@media only screen and (max-width: 460px) {
  .container {
    width: 70%;
    margin: 30px 0;
  }
}

@media only screen and (min-width: 461px) and (max-width: 1024px) {
  .container {
    width: 45%;
  }
  .container > div {
    font-size: 1.5em;
  }
  input::-webkit-input-placeholder {
    font-size: 1.5em;
  }
}

</style>