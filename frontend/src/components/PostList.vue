<template>
    <div class="postcontainer">
        <div v-for="post in posts" :key="post.postID">
            <h2 :key="post.title">{{ post.Title }}</h2>
            <img :key="post.ImageURL" :src="post.ImageURL" alt="">
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'PostList',
    data() {
        return{
            posts: []
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
                console.log(this.posts)
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

.postcontainer {
    display: flex;
    flex-flow: column;
    align-items: center;
    padding: 20px 10px;
    margin: 2% 0;
}

img {
    width: 100%;
}

</style>