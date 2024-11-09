<template>
  <div class="singlepostcontainer">
    <div class="singlepostimagecontainer">
      <h2 style="word-wrap: break-word">{{ post.Title }}</h2>
      <img :src="post.ImageURL" alt="" />
      <hr />
      <div class="singleposticoncontainer">
        <div :key="componentKey" class="singleposticons1">
          <span
            style="cursor: pointer"
            v-if="
              sortPostLikesCurrentUser.filter((s) => s.PostID === post.PostID)
                .length === 0 &&
              sortPostDislikesCurrentUser.filter(
                (s) => s.PostID === post.PostID
              ).length === 0
            "
            ><i
              :id="post.PostID"
              @click="likePost($event)"
              class="far fa-thumbs-up"
            ></i
            >{{
              postLikes.filter((s) => s.PostID === post.PostID).length
            }}</span
          >
          <span
            style="cursor: pointer"
            v-if="
              sortPostLikesCurrentUser.filter((s) => s.PostID === post.PostID)
                .length === 1 &&
              sortPostDislikesCurrentUser.filter(
                (s) => s.PostID === post.PostID
              ).length === 0
            "
            ><i
              style="color: yellowgreen"
              :id="post.PostID"
              @click="deleteLikePost($event)"
              class="far fa-thumbs-up"
            ></i
            >{{
              postLikes.filter((s) => s.PostID === post.PostID).length
            }}</span
          >
          <span
            v-if="
              sortPostDislikesCurrentUser.filter(
                (s) => s.PostID === post.PostID
              ).length === 1 &&
              sortPostLikesCurrentUser.filter((s) => s.PostID === post.PostID)
                .length === 0
            "
            ><i style="opacity: 0.5" class="far fa-thumbs-up"></i
            >{{
              postLikes.filter((s) => s.PostID === post.PostID).length
            }}</span
          >
          <span
            style="cursor: pointer"
            v-if="
              sortPostDislikesCurrentUser.filter(
                (s) => s.PostID === post.PostID
              ).length === 0 &&
              sortPostLikesCurrentUser.filter((s) => s.PostID === post.PostID)
                .length === 0
            "
            ><i
              :id="post.PostID"
              @click="dislikePost($event)"
              class="far fa-thumbs-down"
            ></i
            >{{
              postDislikes.filter((s) => s.PostID === post.PostID).length
            }}</span
          >
          <span
            style="cursor: pointer"
            v-if="
              sortPostDislikesCurrentUser.filter(
                (s) => s.PostID === post.PostID
              ).length === 1 &&
              sortPostLikesCurrentUser.filter((s) => s.PostID === post.PostID)
                .length === 0
            "
            ><i
              style="color: crimson"
              :id="post.PostID"
              @click="deleteDislikePost($event)"
              class="far fa-thumbs-down"
            ></i
            >{{
              postDislikes.filter((s) => s.PostID === post.PostID).length
            }}</span
          >
          <span
            v-if="
              sortPostLikesCurrentUser.filter((s) => s.PostID === post.PostID)
                .length === 1 &&
              sortPostDislikesCurrentUser.filter(
                (s) => s.PostID === post.PostID
              ).length === 0
            "
            ><i style="opacity: 0.5" class="far fa-thumbs-down"></i
            >{{
              postDislikes.filter((s) => s.PostID === post.PostID).length
            }}</span
          >
        </div>
        <div class="singleposticons2" v-if="post.UserID === logedInUser">
          <router-link
            style="
              color: white;
              cursor: pointer;
              text-decoration: none;
              background-color: crimson;
              border-radius: 10px;
              padding: 3% 5%;
            "
            :to="{ name: 'editpost', params: { postId: post.PostID } }"
          >
            Edit
          </router-link>
          <span
            style="cursor: pointer; padding-top: 2%"
            v-if="post.UserID === logedInUser"
            ><i @click="deletePost" class="fas fa-trash-alt"></i
          ></span>
        </div>
      </div>
      <hr />
    </div>
    <div v-for="comment in comments" :key="comment.CommentID">
      <Comments
        :node="comment"
        @getLastComment="getLastComment"
        @getReply="getReply"
      ></Comments>
    </div>
    <form style="padding: 3% 1% 7% 1%">
      <input
        @input="validateComment($event)"
        placeholder="Write a comment..."
        type="text"
        name="comment"
        v-model="comment"
      />
      <button
        style="font-size: 20px; display: none"
        @click.prevent="postComment($event)"
        type="submit"
      >
        send
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Comments from "./Comments";

export default {
  name: "SinglePost",
  components: {
    Comments,
  },
  data() {
    return {
      post: [],
      postLikes: [],
      postDislikes: [],
      componentKey: 0,
      comment: "",
      comments: [],
      parentId: 0,
      replyParentId: "",
    };
  },
  computed: {
    logedInUser() {
      return sessionStorage.getItem("userId");
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
    getSinglePost() {
      axios
        .get(
          "https://project7-backend.myportfolio.training/api/post/singlepost/" +
            this.$route.params.postId,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (
            response.data.status === "200" &&
            response.data.data.length === 1
          ) {
            this.post = response.data.data[0];
          } else if (
            response.data.status === "200" &&
            response.data.data.length < 1
          ) {
            this.$router.push("/notfound");
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
    getPostLikes() {
      axios
        .get(
          "https://project7-backend.myportfolio.training/api/post/postlikes",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.postLikes = response.data.data;
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
    getPostDislikes() {
      axios
        .get(
          "https://project7-backend.myportfolio.training/api/post/postdislikes",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.postDislikes = response.data.data;
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
    likePost($event) {
      axios
        .post(
          "https://project7-backend.myportfolio.training/api/post/likepost",
          {
            postId: $event.target.id,
            userId: sessionStorage.getItem("userId"),
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.getPostLikes();
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
    dislikePost($event) {
      axios
        .post(
          "https://project7-backend.myportfolio.training/api/post/dislikepost",
          {
            postId: $event.target.id,
            userId: sessionStorage.getItem("userId"),
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.getPostDislikes();
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
    deleteLikePost($event) {
      axios
        .delete(
          "https://project7-backend.myportfolio.training/api/post/deletelikepost/" +
            $event.target.id +
            "/" +
            sessionStorage.getItem("userId"),
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.getPostLikes();
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
    deleteDislikePost($event) {
      axios
        .delete(
          "https://project7-backend.myportfolio.training/api/post/deletedislikepost/" +
            $event.target.id +
            "/" +
            sessionStorage.getItem("userId"),
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.getPostDislikes();
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
    getComments() {
      axios
        .get(
          "https://project7-backend.myportfolio.training/api/post/comments/" +
            this.$route.params.postId,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.comments = response.data.data;
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
    getReply(replyParentId) {
      axios
        .get(
          "https://project7-backend.myportfolio.training/api/post/comments/" +
            this.$route.params.postId +
            "/" +
            replyParentId,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            let parentComment = this.findById(
              this.comments,
              JSON.parse(replyParentId)
            );
            setTimeout(() => {
              parentComment.children = response.data.data;
            }, 100);
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
    getLastComment(replyParentId) {
      axios
        .get(
          "https://project7-backend.myportfolio.training/api/post/getlastcomment",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            let parentComment = this.findById(
              this.comments,
              JSON.parse(replyParentId)
            );
            setTimeout(() => {
              if (!parentComment.children) {
                parentComment.children = response.data.data;
              } else {
                parentComment.children = [
                  ...parentComment.children,
                  response.data.data[0],
                ];
              }
            }, 200);
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
    postComment($event) {
      axios
        .post(
          "https://project7-backend.myportfolio.training/api/post/comment/" +
            this.$route.params.postId,
          {
            userId: sessionStorage.getItem("userId"),
            comment: this.comment,
            parentId: this.parentId,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.status === "201") {
            for (let i = 0; i < response.data.data[2].length; i++) {
              this.comments.push(response.data.data[2][i]);
            }
            this.comment = "";
            this.parentId = 0;
            $event.target.style.display = "none";
          } else if (response.data.status === "401") {
            alert(response.data.message);
            this.$store.commit("logout");
          } else {
            alert(response.data.message);
            this.comment = "";
            this.parentId = 0;
            this.forceRerender();
          }
        })
        .catch((err) => {
          alert(err);
          this.comment = "";
          this.parentId = 0;
        });
    },
    deletePost() {
      axios
        .delete(
          "https://project7-backend.myportfolio.training/api/post/deletepost/" +
            this.$route.params.postId,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.$router.push("/postlist");
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
    forceRerender() {
      this.componentKey += 1;
    },
    findById(data, id) {
      const iter = (a) => {
        if (a.CommentID === id) {
          result = a;
          return true;
        }
        return Array.isArray(a.children) && a.children.some(iter);
      };
      var result;
      data.some(iter);
      return result;
    },
    validateComment($event) {
      if ($event.target.value.length < 1) {
        $event.target.nextSibling.style.display = "none";
      } else {
        $event.target.nextSibling.style.display = "inline";
      }
    },
    // DEVELOPMENT ENVIRONMENT
    /*
    getSinglePost() {
      axios
        .get(
          "http://localhost:3000/api/post/singlepost/" +
            this.$route.params.postId,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (
            response.data.status === "200" &&
            response.data.data.length === 1
          ) {
            this.post = response.data.data[0];
          } else if (
            response.data.status === "200" &&
            response.data.data.length < 1
          ) {
            this.$router.push("/notfound");
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
    getPostLikes() {
      axios
        .get("http://localhost:3000/api/post/postlikes", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response.data.status === "200") {
            this.postLikes = response.data.data;
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
    getPostDislikes() {
      axios
        .get("http://localhost:3000/api/post/postdislikes", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response.data.status === "200") {
            this.postDislikes = response.data.data;
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
    likePost($event) {
      axios
        .post(
          "http://localhost:3000/api/post/likepost",
          {
            postId: $event.target.id,
            userId: sessionStorage.getItem("userId"),
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.getPostLikes();
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
    dislikePost($event) {
      axios
        .post(
          "http://localhost:3000/api/post/dislikepost",
          {
            postId: $event.target.id,
            userId: sessionStorage.getItem("userId"),
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.getPostDislikes();
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
    deleteLikePost($event) {
      axios
        .delete(
          "http://localhost:3000/api/post/deletelikepost/" +
            $event.target.id +
            "/" +
            sessionStorage.getItem("userId"),
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.getPostLikes();
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
    deleteDislikePost($event) {
      axios
        .delete(
          "http://localhost:3000/api/post/deletedislikepost/" +
            $event.target.id +
            "/" +
            sessionStorage.getItem("userId"),
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.getPostDislikes();
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
    getComments() {
      axios
        .get(
          "http://localhost:3000/api/post/comments/" +
            this.$route.params.postId,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.comments = response.data.data;
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
    getReply(replyParentId) {
      axios
        .get(
          "http://localhost:3000/api/post/comments/" +
            this.$route.params.postId +
            "/" +
            replyParentId,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            let parentComment = this.findById(
              this.comments,
              JSON.parse(replyParentId)
            );
            setTimeout(() => {
              parentComment.children = response.data.data;
            }, 50);
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
    getLastComment(replyParentId) {
      axios
        .get("http://localhost:3000/api/post/getlastcomment", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response.data.status === "200") {
            let parentComment = this.findById(
              this.comments,
              JSON.parse(replyParentId)
            );
            setTimeout(() => {
              if (!parentComment.children) {
                parentComment.children = response.data.data;
              } else {
                parentComment.children = [
                  ...parentComment.children,
                  response.data.data[0],
                ];
              }
            }, 50);
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
    postComment($event) {
      axios
        .post(
          "http://localhost:3000/api/post/comment/" + this.$route.params.postId,
          {
            userId: sessionStorage.getItem("userId"),
            comment: this.comment,
            parentId: this.parentId,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.status === "201") {
            for (let i = 0; i < response.data.data[2].length; i++) {
              this.comments.push(response.data.data[2][i]);
            }
            this.comment = "";
            this.parentId = 0;
            $event.target.style.display = "none";
          } else if (response.data.status === "401") {
            alert(response.data.message);
            this.$store.commit("logout");
          } else {
            alert(response.data.message);
            this.comment = "";
            this.parentId = 0;
            this.forceRerender();
          }
        })
        .catch((err) => {
          alert(err);
          this.comment = "";
          this.parentId = 0;
        });
    },
    deletePost() {
      axios
        .delete(
          "http://localhost:3000/api/post/deletepost/" +
            this.$route.params.postId,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === "200") {
            this.$router.push("/postlist");
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
    forceRerender() {
      this.componentKey += 1;
    },
    findById(data, id) {
      const iter = (a) => {
        if (a.CommentID === id) {
          result = a;
          return true;
        }
        return Array.isArray(a.children) && a.children.some(iter);
      };
      var result;
      data.some(iter);
      return result;
    },
    validateComment($event) {
      if ($event.target.value.length < 1) {
        $event.target.nextSibling.style.display = "none";
      } else {
        $event.target.nextSibling.style.display = "inline";
      }
    },
    */
  },
  beforeMount() {
    this.getSinglePost(), this.getPostLikes(), this.getPostDislikes();
    this.getComments();
  },
};
</script>

<style>
.singlepostcontainer {
  display: flex;
  flex-flow: column;
  margin: 0 auto auto auto;
  overflow: auto;
  background: transparent;
  scrollbar-width: none;
  width: 100%;
}

.singlepostcontainer > form {
  justify-content: space-around;
}

.singlepostcontainer > form > input {
  width: 80%;
}

.singlepostcontainer > form > button {
  width: 10%;
  padding: 0 0;
  width: 15%;
}

.singleposticoncontainer {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
}

.singleposticoncontainer > * {
  font-size: 30px;
  padding: 1% 0 0 0;
}

.singleposticons1 {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  width: 40%;
}

.singleposticons2 {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  width: 40%;
}

.singlepostimagecontainer {
  width: 90%;
  padding: 20px 0 5px 15px;
}

.singlepostimagecontainer > img {
  width: 100%;
}

.singlepostimagecontainer > h2 {
  margin-bottom: 5%;
}

@media only screen and (min-width: 760px) {
  .singlepostcontainer {
    width: 70%;
  }
}

@media only screen and (min-width: 1025px) {
  .singlepostcontainer {
    width: 40%;
  }
}
</style>
