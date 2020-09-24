<template>
    <div class="postcontainer" >
        <div class="imagetitlecontainer" v-for="post in sortPostsDifferentUser" :key="post.postID">
            <h2>{{ post.Title }}</h2>
            <img :src="post.ImageURL" alt="">
            <div class="iconcontainer">
                <div :key="componentKey" class="icons1">
                    <span v-if="sortLikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0 && sortDislikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0"><i :id="post.PostID" @click="like($event)" class="far fa-thumbs-up"></i>{{ likes.filter(s => s.PostID === post.PostID).length }}</span>
                    <span v-if="sortLikesCurrentUser.filter(s => s.PostID === post.PostID).length === 1 && sortDislikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0"><i style="color: yellowgreen" :id="post.PostID" @click="deleteLike($event)" class="far fa-thumbs-up"></i>{{ likes.filter(s => s.PostID === post.PostID).length }}</span>
                    <span class="disabled" v-if="sortDislikesCurrentUser.filter(s => s.PostID === post.PostID).length === 1 && sortLikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0"><i style="opacity: 0.5;" class="far fa-thumbs-up"></i>{{ likes.filter(s => s.PostID === post.PostID).length }}</span>
                    <span v-if="sortDislikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0 && sortLikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0"><i :id="post.PostID" @click="dislike($event)" class="far fa-thumbs-down"></i>{{ dislikes.filter(s => s.PostID === post.PostID).length }}</span>
                    <span class="disabled"  v-if="sortDislikesCurrentUser.filter(s => s.PostID === post.PostID).length === 1 && sortLikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0"><i style="color: crimson" :id="post.PostID" @click="deleteDislike($event)" class="far fa-thumbs-down"></i>{{ dislikes.filter(s => s.PostID === post.PostID).length }}</span>
                    <span v-if="sortLikesCurrentUser.filter(s => s.PostID === post.PostID).length === 1 && sortDislikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0"><i style="opacity: 0.5;" class="far fa-thumbs-down"></i>{{ dislikes.filter(s => s.PostID === post.PostID).length }}</span>
                    <span ><i class="far fa-comment-dots"></i></span>
                </div>
                <div :id="post.PostID" class="icons2">
                    <span v-if="post.DateTime > previousLoginTime && post.UserID !== currentLogedInUser && !getSessionStorage.hasOwnProperty(post.PostID) || previousLoginTime == null && post.UserID !== currentLogedInUser && !getSessionStorage.hasOwnProperty(post.PostID)"><i class="fas fa-bell"></i></span>
                </div>
            </div>
            <hr>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'PostList',
    data() {
        return {
            posts: [],
            likes: [],
            dislikes: [],
            scrolled: false,
            componentKey: 0,
        }
    },
    computed: {
        sortPostsFromCurrentUser() {
            return [...this.posts]
            .filter(s => s.UserID === this.$store.state.userId)
            .sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime))
        },
        sortPostsDifferentUser() {
            return [...this.posts]
            .filter(s => s.UserID !== this.$store.state.userId)
            .sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime))
            .concat(this.sortPostsFromCurrentUser)
        },
        currentLogedInUser() {
            return this.$store.state.userId
        },
        previousLoginTime() {
            return this.$store.state.previousLoginTime
        },
        getSessionStorage() {
            return {...sessionStorage}
        },
        sortLikesCurrentUser() {
            return [...this.likes]
            .filter(s => s.UserID === this.$store.state.userId)
        },
        sortDislikesCurrentUser() {
            return [...this.dislikes]
            .filter(s => s.UserID === this.$store.state.userId)
        }       
    },
    methods: {
        getPosts() {
            axios.get('http://localhost:3000/api/post',
            { headers:
                {
                'Authorization': `Bearer ${this.$store.state.token}`, 
                }
            }).then((response) => {
                this.posts = response.data
            }).catch((err => {
                console.log(err)
            }))
        },
        getLikes() {
            axios.get('http://localhost:3000/api/post/likes',
            { headers:
                {
                'Authorization': `Bearer ${this.$store.state.token}`, 
                }
            }).then((response) => {
                this.likes = response.data
            }).catch((err => {
                console.log(err)
            }))
        }, 
        getDislikes() {
            axios.get('http://localhost:3000/api/post/dislikes',
            { headers:
                {
                'Authorization': `Bearer ${this.$store.state.token}`, 
                }
            }).then((response) => {
                this.dislikes = response.data
                console.log(this.sortLikesCurrentUser)
            }).catch((err => {
                console.log(err)
            }))
        },
        like($event) {
            axios.post('http://localhost:3000/api/post/like', { postId: $event.target.id,  userId: this.$store.state.userId}, {
            headers: {
                    'Authorization': `Bearer ${this.$store.state.token}`,
                    'Content-Type': 'application/json'  
                }
            },
            ).then((response) => {
                console.log(response.data)
                this.getLikes()
            }).catch((err => {
                console.log(err)
            }))
        },
        dislike($event) {
            axios.post('http://localhost:3000/api/post/dislike', { postId: $event.target.id,  userId: this.$store.state.userId}, {
            headers: {
                    'Authorization': `Bearer ${this.$store.state.token}`,
                    'Content-Type': 'application/json'  
                }
            },
            ).then((response) => {
                console.log(response.data)
                this.getDislikes()
            }).catch((err => {
                console.log(err)
            }))
        },
        deleteLike($event) {
            axios.delete('http://localhost:3000/api/post/deletelike/' + $event.target.id + '/' + this.$store.state.userId, {
                headers: {
                    Authorization: `Bearer ${this.$store.state.token}`
                },
            }).then((response) => {
                console.log(response.data)
                this.getLikes()
            }).catch((err => {
                console.log(err)
            }))
        },
        deleteDislike($event) {
            axios.delete('http://localhost:3000/api/post/deletedislike/' + $event.target.id + '/' + this.$store.state.userId, {
                headers: {
                    Authorization: `Bearer ${this.$store.state.token}`
                },
            }).then((response) => {
                console.log(response.data)
                this.getDislikes()
            }).catch((err => {
                console.log(err)
            }))
        },
        forceRerender() {
            this.componentKey += 1;
        },
        handleScroll () {
              let postHeight = document.querySelectorAll('.icons2')
              for ( let i = 0; i < postHeight.length; i++) {
                if (postHeight[i].getBoundingClientRect().bottom < (window.innerHeight - 35)) {
                    postHeight[i].style.visibility = 'hidden'
                    sessionStorage.setItem(postHeight[i].id, postHeight[i].id);
                    console.log(this.getSessionStorage)
                }
            }
        }
    },
        beforeMount() {
            this.getPosts(),
            this.getLikes(),
            this.getDislikes()
    },
        created () {
            window.addEventListener('scroll', this.handleScroll);
        },
        destroyed () {
            window.removeEventListener('scroll', this.handleScroll);
    }
}
</script>

<style>

hr {
    width: 100%;
}

.postcontainer {
    display: flex;
    flex-flow: column;
    padding: 20px 10px;
    margin: auto auto;
    
}

img {
    width: 100%;
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
    padding: 5% 0;
}

.icons2 {
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    width: 40%;
    padding: 5% 0;
}

.icons2 > * {
    color: crimson;
}

.imagetitlecontainer {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
}

::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}

@media only screen and (min-width: 760px) {
  .postcontainer {
    width: 35%;
  }
}

</style>