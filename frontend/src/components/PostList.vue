<template>
  <div
    @scroll="handleScroll($event)"
    class="postcontainer"
    style="scrollbar-width: none"
  >
    <div v-if="sortPostsDifferentUser.length < 1">
      <h1>Start sharing your gif with the community</h1>
    </div>
    <div
      v-else
      class="imagetitlecontainer"
      v-for="post in sortPostsDifferentUser"
      :key="post.postID"
    >
      <div
        style="display: flex; flex-flow: row; justify-content: space-between"
      >
        <div>
          <h3 style="color: crimson">{{ post.Username }}</h3>
          <h2 style="margin-bottom: 4%; word-wrap: break-word">
            {{ post.Title }}
          </h2>
        </div>
        <div class="iconcontainer">
          <div :id="post.PostID" class="icons2">
            <span
              v-if="
                post.UserID !== logedInUser &&
                !getLocalStorage.hasOwnProperty(post.PostID)
              "
              ><i :id="post.PostID" class="fas fa-bell"></i
            ></span>
          </div>
        </div>
      </div>

      <router-link
        :to="{ name: 'singlepost', params: { postId: post.PostID } }"
      >
        <img :src="post.ImageURL" alt="" />
      </router-link>
      <hr />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PostList",
  data() {
    return {
      posts: [],
      postLikes: [],
      postDislikes: [],
      scrolled: false,
      componentKey: 0,
    };
  },
  computed: {
    sortPostsFromCurrentUser() {
      return [...this.posts]
        .filter(
          (s) =>
            s.UserID === sessionStorage.getItem("userId") ||
            Object.prototype.hasOwnProperty.call(this.getLocalStorage, s.PostID)
        )
        .sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime));
    },
    sortPostsDifferentUser() {
      return [...this.posts]
        .filter(
          (s) =>
            s.UserID !== sessionStorage.getItem("userId") &&
            !Object.prototype.hasOwnProperty.call(
              this.getLocalStorage,
              s.PostID
            )
        )
        .sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime))
        .concat(this.sortPostsFromCurrentUser);
    },
    logedInUser() {
      return sessionStorage.getItem("userId");
    },
    getLocalStorage() {
      return (
        JSON.parse(localStorage.getItem(sessionStorage.getItem("userId"))) || 0
      );
    },
    sortPostLikesCurrentUser() {
      return [...this.postLikes].filter(
        (s) => s.UserID === sessionStorage.getItem("userId")
      );
    },
    sortPostDislikesCurrentUser() {
      return [...this.postDislikes].filter(
        (s) => s.UserID === sessionStorage.getItem("userId")
      );
    },
  },
  methods: {
    // PRODUCTION ENVIRONMENT
    getPosts() {
      axios
        .get("https://project7-backend.myportfolio.training/api/post", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response.data.status === "200") {
            this.posts = response.data.data;
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
    // DEVELOPMENT ENVIRONMENT
    /*
    getPosts() {
      axios
        .get("http://localhost:3000/api/post", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response.data.status === "200") {
            this.posts = response.data.data;
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
    */
    forceRerender() {
      this.componentKey += 1;
    },
    handleScroll() {
      let postHeight = document.querySelectorAll(".icons2");
      for (let i = 0; i < postHeight.length; i++) {
        if (
          postHeight[i].getBoundingClientRect().bottom <
          window.innerHeight - 400
        ) {
          postHeight[i].style.visibility = "hidden";
          let readPost = localStorage.getItem(sessionStorage.getItem("userId"));
          readPost = JSON.parse(readPost);
          readPost = {
            ...readPost,
            [postHeight[i].id]: postHeight[i].id,
          };
          localStorage.setItem(
            sessionStorage.getItem("userId"),
            JSON.stringify(readPost)
          );
        }
      }
    },
    checkPost() {
      if (document.querySelectorAll(".icons2").length > 0) {
        let postHeight = document.querySelectorAll(".icons2");

        postHeight[0].style.visibility = "hidden";
        let readPost = localStorage.getItem(sessionStorage.getItem("userId"));
        readPost = JSON.parse(readPost);
        readPost = {
          ...readPost,
          [postHeight[0].id]: postHeight[0].id,
        };
        localStorage.setItem(
          sessionStorage.getItem("userId"),
          JSON.stringify(readPost)
        );
      }
    },
  },
  beforeMount() {
    this.getPosts();
  },
  updated() {
    this.checkPost();
  },
};
</script>

<style>
hr {
  width: 90%;
}

h3 {
  font-style: italic;
}

.postcontainer {
  display: flex;
  flex-flow: column;
  margin: 0 auto auto auto;
  overflow-y: auto;
  overflow-x: hidden;
  width: 90%;
}

.iconcontainer {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
}

.iconcontainer > * {
  font-size: 30px;
}

.icons1 {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  width: 60%;
  padding: 1% 0;
}

.icons2 {
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  padding: 1% 0;
}

.icons2 > * {
  color: crimson;
}

.imagetitlecontainer {
  width: 100%;
}

.imagetitlecontainer > a > img {
  width: 100%;
}

::-webkit-scrollbar {
  width: 0px;
  background: transparent;
  scrollbar-width: none;
}

@media only screen and (min-width: 760px) {
  .postcontainer {
    width: 70%;
  }
}

@media only screen and (min-width: 1025px) {
  .postcontainer {
    width: 40%;
  }
}
</style>
