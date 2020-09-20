<template>
    <div class="postcontainer" >
        <div class="imagetitlecontainer" v-for="post in posts" :key="post.postID">
            <h2 :key="post.Title">{{ post.Title }}</h2>
            <img :key="post.ImageURL" :src="post.ImageURL" alt="">
            <div class="iconcontainer">
                <span><i class="far fa-thumbs-up"></i></span>
                <span><i class="far fa-thumbs-down"></i></span>
                <span><i class="far fa-comment-dots"></i></span>
                <span v-if="post.DateTime > previousLoginTime && post.UserID !== currentLogedInUser || previousLoginTime == null && post.UserID !== currentLogedInUser"><i class="fas fa-bell"></i></span>
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
            posts: []
        }
    },
    computed: {
        currentLogedInUser() {
            return this.$store.state.userId
        },
        previousLoginTime() {
            return this.$store.state.previousLoginTime
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
    },
    beforeMount() {
    this.getPosts()
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
    overflow: auto;
    height: 100%;
}

img {
    width: 100%;
}

.iconcontainer {
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    width: 60%;
    padding: 5% 0;
}

.iconcontainer > * {
    font-size: 30px;
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

</style>