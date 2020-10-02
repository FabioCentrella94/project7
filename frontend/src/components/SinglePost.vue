<template>
    <div class="singlepostcontainer" >
        <div class="singlepostimagecontainer">
            <h2>{{ post.Title }}</h2>
            <img :src="post.ImageURL" alt="">
            <hr>
            <div class="singleposticoncontainer">
                <div :key="componentKey" class="singleposticons1">
                    <span style="cursor: pointer" v-if="sortLikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0 && sortDislikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0"><i :id="post.PostID" @click="like($event)" class="far fa-thumbs-up"></i>{{ likes.filter(s => s.PostID === post.PostID).length }}</span>
                    <span style="cursor: pointer" v-if="sortLikesCurrentUser.filter(s => s.PostID === post.PostID).length === 1 && sortDislikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0"><i style="color: yellowgreen" :id="post.PostID" @click="deleteLike($event)" class="far fa-thumbs-up"></i>{{ likes.filter(s => s.PostID === post.PostID).length }}</span>
                    <span class="disabled" v-if="sortDislikesCurrentUser.filter(s => s.PostID === post.PostID).length === 1 && sortLikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0"><i style="opacity: 0.5;" class="far fa-thumbs-up"></i>{{ likes.filter(s => s.PostID === post.PostID).length }}</span>
                    <span style="cursor: pointer" v-if="sortDislikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0 && sortLikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0"><i :id="post.PostID" @click="dislike($event)" class="far fa-thumbs-down"></i>{{ dislikes.filter(s => s.PostID === post.PostID).length }}</span>
                    <span style="cursor: pointer" class="disabled"  v-if="sortDislikesCurrentUser.filter(s => s.PostID === post.PostID).length === 1 && sortLikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0"><i style="color: crimson" :id="post.PostID" @click="deleteDislike($event)" class="far fa-thumbs-down"></i>{{ dislikes.filter(s => s.PostID === post.PostID).length }}</span>
                    <span v-if="sortLikesCurrentUser.filter(s => s.PostID === post.PostID).length === 1 && sortDislikesCurrentUser.filter(s => s.PostID === post.PostID).length === 0"><i style="opacity: 0.5;" class="far fa-thumbs-down"></i>{{ dislikes.filter(s => s.PostID === post.PostID).length }}</span>
                </div>
                <div class="singleposticons2" v-if="post.UserID === logedInUser">
                    <router-link style="color: white; cursor: pointer; text-decoration: none; background-color: crimson; border-radius: 10px; padding: 0.5% 5%;" :to="{ name: 'editpost', params: { postId: post.PostID }}">
                        Edit
                    </router-link>
                    <span style="cursor: pointer" v-if="post.UserID === logedInUser"><i class="fas fa-trash-alt"></i></span>
                </div>
            </div>
        </div>
        <hr>
        <div v-for="comment in comments" :key="comment.CommentID">
            <Comments :node="comment"></Comments>
        </div>
        <form>
            <input placeholder="Write a comment..." type="text" name="comment" v-model="comment">
            <button @click.prevent="postComment" type="submit"><i style="font-size: 20px;" class="far fa-comment-dots"></i></button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import Comments from './Comments'

export default {
    name: 'SinglePost',
    components: {
        Comments
    },
    data() {
        return {
            post: [],
            likes: [],
            dislikes: [],
            componentKey: 0,
            comment: '',
            comments: [],
            parentId: 0
        }
    },
    computed: {
        logedInUser() {
            return sessionStorage.getItem('userId')
        },
        sortLikesCurrentUser() {
            return [...this.likes]
            .filter(s => s.UserID === sessionStorage.getItem('userId'))
        },
        sortDislikesCurrentUser() {
            return [...this.dislikes]
            .filter(s => s.UserID === sessionStorage.getItem('userId'))
        },
        currentLogedInUser() {
            return sessionStorage.getItem('userId')
        },
    },
    methods: {
        getSinglePost() {
            axios.get('http://localhost:3000/api/post/singlepost/' + this.$route.params.postId,
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
                }
            }).then((response) => {
                if (response.data.status === '200' && response.data.data.length === 1) {
                    this.post = response.data.data[0]
                } else if (response.data.status === '200' && response.data.data.length < 1) {
                    this.$router.push('/notfound')
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$router.push('/')
                } else {
                    alert(response.data.message)
                }
            }).catch((err => {
                alert(err)
            }))
        },
        getLikes() {
            axios.get('http://localhost:3000/api/post/likes',
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
                }
            }).then((response) => {
                if (response.data.status === '200') {
                    this.likes = response.data.data
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$router.push('/')
                } else {
                    alert(response.data.message)
                }               
            }).catch((err => {
                alert(err)
            }))
        }, 
        getDislikes() {
            axios.get('http://localhost:3000/api/post/dislikes',
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
                }
            }).then((response) => {
                if (response.data.status === '200') {
                    this.dislikes = response.data.data
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$router.push('/')
                } else {
                    alert(response.data.message)
                }                   
            }).catch((err => {
                alert(err)
            }))
        },
        like($event) {
            axios.post('http://localhost:3000/api/post/like', { postId: $event.target.id,  userId: sessionStorage.getItem('userId')}, {
            headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'  
                }
            },
            ).then((response) => {
                if (response.data.status === '200') {
                    this.getLikes()
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$router.push('/')
                } else {
                    alert(response.data.message)
                }      
            }).catch((err => {
                alert(err)
            }))
        },
        dislike($event) {
            axios.post('http://localhost:3000/api/post/dislike', { postId: $event.target.id,  userId: sessionStorage.getItem('userId')}, {
            headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'  
                }
            },
            ).then((response) => {
                if (response.data.status === '200') {
                    this.getDislikes()
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$router.push('/')
                } else {
                    alert(response.data.message)
                } 
            }).catch((err => {
                alert(err)
            }))
        },
        deleteLike($event) {
            axios.delete('http://localhost:3000/api/post/deletelikepost/' + $event.target.id + '/' + sessionStorage.getItem('userId'), {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                },
            }).then((response) => {
                if (response.data.status === '200') {
                    this.getLikes()
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$router.push('/')
                } else {
                    alert(response.data.message)
                } 
            }).catch((err => {
                alert(err)
            }))
        },
        deleteDislike($event) {
            axios.delete('http://localhost:3000/api/post/deletedislikepost/' + $event.target.id + '/' + sessionStorage.getItem('userId'), {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                },
            }).then((response) => {
                if (response.data.status === '200') {
                    this.getDislikes()
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$router.push('/')
                } else {
                    alert(response.data.message)
                } 
            }).catch((err => {
                alert(err)
            }))
        },
        getComments() {
            axios.get('http://localhost:3000/api/post/comments/' + this.$route.params.postId,
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
                }
            }).then((response) => {
                if (response.data.status === '200') {
                    this.comments = response.data.data
                    console.log(this.comments)
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$router.push('/')
                } else {
                    alert(response.data.message)
                }
            }).catch((err => {
                alert(err)
            }))
        },
        postComment() {
            axios.post('http://localhost:3000/api/post/comment/' + this.$route.params.postId, { userId: sessionStorage.getItem('userId'), comment: this.comment, parentId: this.parentId}, {
            headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'  
                }
            },
            ).then((response) => {
                console.log(response.data.status)
                if (response.data.status === '201') {
                    this.getComments()
                    this.comment = ''
                    this.parentId = 0
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$router.push('/')
                } else {
                    alert(response.data.message)
                }      
            }).catch((err => {
                alert(err)
            }))
        },
        reply($event) {
            this.parentId = $event.target.id
            document.getElementsByName("comment")[0].focus();
        },
        forceRerender() {
            this.componentKey += 1;
        },
    },
        beforeMount() {
            this.getSinglePost(),
            this.getLikes(),
            this.getDislikes()
            this.getComments()
        },
}
</script>

<style>

.singlepostcontainer {
    display: flex;
    flex-flow: column;
    padding: 20px 10px;
    margin: 0 auto auto auto;
    overflow: auto;
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
    width: 100%;
}

.singlepostimagecontainer > img {
    width: 100%;
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