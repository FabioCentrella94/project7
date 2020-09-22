<template>
    <div class="postcontainer" >
        <div class="imagetitlecontainer" v-for="post in sortPostsDifferentUser" :key="post.postID">
            <h2 :key="post.Title">{{ post.Title }}</h2>
            <img :key="post.ImageURL" :src="post.ImageURL" alt="">
            <div class="iconcontainer">
                <div class="icons1">
                    <span><i class="far fa-thumbs-up"></i></span>
                    <span><i class="far fa-thumbs-down"></i></span>
                    <span><i class="far fa-comment-dots"></i></span>
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
            scrolled: false
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
            this.getPosts()
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