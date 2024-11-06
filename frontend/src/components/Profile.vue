<template>
  <div id="profileContainer">
    <div style="margin-bottom: 15%" v-if="!deleteAccount">
      <h2>User ID</h2>
      <p style="word-wrap: break-word">{{ userDetails.UserID }}</p>
    </div>
    <div style="margin-bottom: 15%" v-if="!deleteAccount">
      <h2>Username</h2>
      <p style="word-wrap: break-word">{{ userDetails.Username }}</p>
    </div>
    <div style="margin-bottom: 15%" v-if="!deleteAccount">
      <h2>Email</h2>
      <p style="word-wrap: break-word">{{ userDetails.Email }}</p>
    </div>
    <button
      v-if="!deleteAccount"
      @click.prevent="deleteAccount = !deleteAccount"
      type="submit"
    >
      Delete Profile
    </button>
    <div v-else>
      <p style="color: black; text-align: center">
        Are you sure you want to delete your profile?
      </p>
      <div
        id="containerYesNo"
        style="display: flex; justify-content: space-around"
      >
        <button style="width: 30%" @click.prevent="deleteProfile" type="submit">
          Yes
        </button>
        <button
          style="width: 30%"
          @click.prevent="deleteAccount = !deleteAccount"
        >
          No
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Profile",
  data() {
    return {
      userDetails: [],
      deleteAccount: false,
    };
  },
  methods: {
    // PRODUCTION ENVIRONMENT
    /*
    getUserDetails() {
      axios
        .get(
          "https://project7-backend.myportfolio.training/api/auth/profile/" +
            this.$route.params.userId,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.userDetails = response.data.data[0];
          } else if (response.data.status === "401") {
            alert(response.data.message);
            this.$store.commit("logout");
          } else {
            alert(response.data.message);
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    deleteProfile() {
      axios
        .delete(
          "https://project7-backend.myportfolio.training/api/auth/deleteprofile/" +
            this.$route.params.userId,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            alert("profile deleted");
            this.$store.commit("logout");
          } else if (response.data.status === "401") {
            alert(response.data.message);
            this.$router.push("/");
            this.$store.commit("logout");
          } else {
            alert(response.data.message);
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    */
    // DEVELOPMENT ENVIRONMENT
    getUserDetails() {
      axios
        .get(
          "http://localhost:3000/api/auth/profile/" + this.$route.params.userId,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.userDetails = response.data.data[0];
          } else if (response.data.status === "401") {
            alert(response.data.message);
            this.$store.commit("logout");
          } else {
            alert(response.data.message);
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    deleteProfile() {
      axios
        .delete(
          "http://localhost:3000/api/auth/deleteprofile/" +
            this.$route.params.userId,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            alert("profile deleted");
            this.$store.commit("logout");
          } else if (response.data.status === "401") {
            alert(response.data.message);
            this.$router.push("/");
            this.$store.commit("logout");
          } else {
            alert(response.data.message);
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
  beforeMount() {
    this.getUserDetails();
  },
};
</script>

<style>
#profileContainer {
  margin: 10% auto 10% auto;
  padding: 0 10%;
  width: 40%;
}

#profileContainer > h2,
p {
  text-align: left;
}

#profileContainer > button {
  width: 50%;
  display: block;
  margin: 15% auto 0 auto;
  min-width: 120px;
}

@media only screen and (max-width: 460px) {
  #profileContainer {
    margin: 0 0;
    width: 80%;
  }
}

@media only screen and (min-width: 461px) and (max-width: 1024px) {
  #profileContainer {
    width: 80%;
  }
  #profileContainer > * {
    font-size: 1.5em;
  }
  #containerYesNo > * {
    font-size: 1em;
  }
}
</style>
