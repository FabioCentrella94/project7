<template>
    <div>
        <div :key="componentKey" style="scroll-behavior: smooth;" :style="{'padding-left': `${depth * 5}%`}">
            <h4 style="color: red;">{{ node.Username }}</h4>
            <div :key="componentKeyEdit" style="flex-flow: row; justify-content: space-around; align-items: center">
                <p style="color: black;">{{ node.Comment }}</p>
            </div>
            <div class="commentIconContainer">
                <div style="min-width: 50%; display: flex; justify-content: space-between">
                    <span style="cursor: pointer" v-if="sortCommentsLikesCurrentUser.filter(s => s.CommentID === node.CommentID).length === 0 && sortCommentsDislikesCurrentUser.filter(s => s.CommentID === node.CommentID).length === 0"><i :id="node.CommentID" @click="likeComment($event)" class="far fa-thumbs-up"></i>{{ commentsLikes.filter(s => s.CommentID === node.CommentID).length }}</span>
                    <span style="cursor: pointer" v-if="sortCommentsLikesCurrentUser.filter(s => s.CommentID === node.CommentID).length === 1 && sortCommentsDislikesCurrentUser.filter(s => s.CommentID === node.CommentID).length === 0"><i style="color: yellowgreen" :id="node.CommentID" @click="deleteLikeComment($event)" class="far fa-thumbs-up"></i>{{ commentsLikes.filter(s => s.CommentID === node.CommentID).length }}</span>
                    <span v-if="sortCommentsDislikesCurrentUser.filter(s => s.CommentID === node.CommentID).length === 1 && sortCommentsLikesCurrentUser.filter(s => s.CommentID === node.CommentID).length === 0"><i style="opacity: 0.5;" class="far fa-thumbs-up"></i>{{ commentsLikes.filter(s => s.CommentID === node.CommentID).length }}</span>
                    <span style="cursor: pointer" v-if="sortCommentsDislikesCurrentUser.filter(s => s.CommentID === node.CommentID).length === 0 && sortCommentsLikesCurrentUser.filter(s => s.CommentID === node.CommentID).length === 0"><i :id="node.CommentID" @click="dislikeComment($event)" class="far fa-thumbs-down"></i>{{ commentsDislikes.filter(s => s.CommentID === node.CommentID).length }}</span>
                    <span style="cursor: pointer" v-if="sortCommentsDislikesCurrentUser.filter(s => s.CommentID === node.CommentID).length === 1 && sortCommentsLikesCurrentUser.filter(s => s.CommentID === node.CommentID).length === 0"><i style="color: crimson" :id="node.CommentID" @click="deleteDislikeComment($event)" class="far fa-thumbs-down"></i>{{ commentsDislikes.filter(s => s.CommentID === node.CommentID).length }}</span>
                    <span v-if="sortCommentsLikesCurrentUser.filter(s => s.CommentID === node.CommentID).length === 1 && sortCommentsDislikesCurrentUser.filter(s => s.CommentID === node.CommentID).length === 0"><i style="opacity: 0.5;" class="far fa-thumbs-down"></i>{{ commentsDislikes.filter(s => s.CommentID === node.CommentID).length }}</span>
                    <span :id="node.CommentID" style="cursor: pointer" @click="replyTo($event)">Reply</span>
                </div>
                <div class="singleposticons2" style="min-width: 35%;" v-if="node.UserID === logedInUser">
                    <span :key="componentKeyEdit" :id="node.CommentID" @click="editComment($event)" style="color: white; cursor: pointer; text-decoration: none; background-color: crimson; border-radius: 10px; padding: 0.5% 5%;">
                        Edit
                    </span>
                    <span style="cursor: pointer"><i @click="deleteComment($event)" :id="node.CommentID" class="fas fa-trash-alt"></i></span>
                </div>
            </div>
            <br>
            <form class="formReply" style="display: none;">
                <input @input="validateComment($event)" style="margin-right: 3%" placeholder="Write a comment..." type="text" :name="node.CommentID" v-model="reply">
                <span style="display: none;" @click.prevent="sendReply(), getReply($event)">
                    <button  type="submit"><i style="font-size: 20px;" class="far fa-comment-dots"></i></button>
                </span>
            </form>
            <br v-if="!expanded && hasReply === 1" style="display: none;">
            <span :id="node.CommentID" style="cursor: pointer" @click="setParentId($event), getReply()" v-if="hasReply === 1 || node.children" class="type">{{ expanded ? '' : 'View Replies' }}</span>
        </div>
        <div  v-if="expanded">
            <Comments
                v-on="$listeners"
                v-for="child in node.children"
                :key="child.CommentID"
                :node="child"
                :depth="depth + 1"
            />
        </div>
    </div> 
</template>

<script>
import axios from 'axios';

export default {
    name: 'Comments',
    data() {
        return {
            commentsLikes: [],
            commentsDislikes: [],
            componentKey: 0,
            componentKeyEdit: 0,
            reply: '',
            parentId: null,
            expanded: false,
            commentId: null,
            previousEditedComment: ''
        }
    },
    computed: {
        logedInUser() {
            return sessionStorage.getItem('userId')
        },
        sortCommentsLikesCurrentUser() {
            return [...this.commentsLikes]
            .filter(s => s.UserID === sessionStorage.getItem('userId'))
        },
        sortCommentsDislikesCurrentUser() {
            return [...this.commentsDislikes]
            .filter(s => s.UserID === sessionStorage.getItem('userId'))
        },
        hasReply() {
            return this.node.hasReply
        },
    },
    props: {
        node: Object,
        depth: {
            type: Number,
            default: 1,
        }
    },
    methods: {
        getCommentsLikes() {
            axios.get('http://localhost:3000/api/post/commentslikes',
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
                }
            }).then((response) => {
                if (response.data.status === '200') {
                    this.commentsLikes = response.data.data
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                }               
            }).catch((err => {
                alert(err)
            }))
        }, 
        getCommentsDislikes() {
            axios.get('http://localhost:3000/api/post/commentsdislikes',
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
                }
            }).then((response) => {
                if (response.data.status === '200') {
                    this.commentsDislikes = response.data.data
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                }                   
            }).catch((err => {
                alert(err)
            }))
        },
        likeComment($event) {
            axios.post('http://localhost:3000/api/post/likecomment', { commentId: $event.target.id,  userId: sessionStorage.getItem('userId')}, {
            headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'  
                }
            },
            ).then((response) => {
                if (response.data.status === '200') {
                    this.getCommentsLikes()
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                }      
            }).catch((err => {
                alert(err)
            }))
        },
        dislikeComment($event) {
            axios.post('http://localhost:3000/api/post/dislikecomment', { commentId: $event.target.id,  userId: sessionStorage.getItem('userId')}, {
            headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'  
                }
            },
            ).then((response) => {
                if (response.data.status === '200') {
                    this.getCommentsDislikes()
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                } 
            }).catch((err => {
                alert(err)
            }))
        },
        deleteLikeComment($event) {
            axios.delete('http://localhost:3000/api/post/deletelikecomment/' + $event.target.id + '/' + sessionStorage.getItem('userId'), {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                },
            }).then((response) => {
                if (response.data.status === '200') {
                    this.getCommentsLikes()
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                } 
            }).catch((err => {
                alert(err)
            }))
        },
        deleteDislikeComment($event) {
            axios.delete('http://localhost:3000/api/post/deletedislikecomment/' + $event.target.id + '/' + sessionStorage.getItem('userId'), {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                },
            }).then((response) => {
                if (response.data.status === '200') {
                    this.getCommentsDislikes()
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                } 
            }).catch((err => {
                alert(err)
            }))
        },
        replyTo($event) {
            this.parentId = $event.target.id
            this.reply = ''
            let replyInput = document.getElementsByName($event.target.id)
            replyInput[0].parentElement.style.display = 'flex'
            if (replyInput[0].parentElement.nextSibling.tagName == 'BR' ) {
                replyInput[0].parentElement.nextSibling.style.display = 'inline'
            }
            replyInput[0].focus()
        },
        sendReply() {
            axios.post('http://localhost:3000/api/post/comment/' + this.$route.params.postId, { userId: sessionStorage.getItem('userId'), comment: this.reply, parentId: this.parentId}, {
            headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'  
                }
            },
            ).then((response) => {
                if (response.data.status === '201') {
                    let formComment = document.getElementsByClassName('formReply')
                    for (let i = 0; i < formComment.length; i++) {
                        formComment[i].style.display = 'none'
                    }
                    this.reply = ''
                    this.parentId = null
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                    this.reply = ''
                    this.parentId = null
                }      
            }).catch((err => {
                alert(err)
                this.reply = ''
                this.parentId = null
            }))
        },
        deleteComment($event) {
            axios.delete('http://localhost:3000/api/post/deletecomment/' + $event.target.id, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                },
            }).then((response) => {
                if (response.data.status === '200') {
                    this.expanded = false
                    $event.target.parentElement.parentElement.parentElement.parentElement.style.display = 'none'
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                } 
            }).catch((err => {
                alert(err)
            }))
        },
        editComment($event) {
            $event.target.style.display = 'none'
            this.commentId = $event.target.id
            this.previousEditedComment = $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0].textContent
            let textComment = $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0].textContent
            let textArea = document.createElement('textarea')
            textArea.style.border = '1px solid grey'
            $event.target.parentElement.parentElement.parentElement.childNodes[1].replaceChild(textArea, $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0])
            textArea.value = textComment
            textArea.style.width = '70%'
            textArea.addEventListener('input', () => {
                if (textArea.value.length < 1) {
                    editCommentButton.style.display = 'none'
                } else {
                editCommentButton.style.display = 'inline'
                }
            })
            let editCommentButton = document.createElement('i')
            editCommentButton.className = "fas fa-check"
            editCommentButton.style.color = 'greenyellow'
            editCommentButton.style.width = '10%'
            editCommentButton.style.padding = '0 0'
            editCommentButton.style.cursor = 'pointer'
            editCommentButton.addEventListener('click', ($event) => {
                axios.put('http://localhost:3000/api/post/editcomment', 
            { 
                commentId: this.commentId, 
                comment: $event.target.parentElement.childNodes[0].value 
            },
            { headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json' 
                }
            }
            ).then((response) => {
                if (response.data.status === '200') {
                    let editedComment = $event.target.parentElement.childNodes[0].value
                    let newComment = document.createElement('p')
                    newComment.style.color ='black'
                    newComment.style.fontWeight ='normal'
                    $event.target.parentElement.childNodes[1].style.display = 'none'
                    $event.target.parentElement.childNodes[2].style.display = 'none'
                    $event.target.parentElement.style.display = 'inline'
                    newComment.textContent = editedComment
                    $event.target.parentElement.parentElement.childNodes[1].replaceChild(newComment, $event.target.parentElement.parentElement.childNodes[1].childNodes[0])
                    $event.target.parentElement.parentElement.childNodes[2].childNodes[1].childNodes[0].style.display = 'inline'
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                }
            }).catch((err => {
                alert(err)
            }))
            })
            let cancelEditCommentButton = document.createElement('i')
            cancelEditCommentButton.className = "fas fa-times"
            cancelEditCommentButton.style.color = 'crimson'
            cancelEditCommentButton.addEventListener('click', () => {
                let previousComment = document.createElement('p')
                previousComment.style.color = 'black'
                previousComment.textContent = this.previousEditedComment
                $event.target.parentElement.parentElement.parentElement.childNodes[1].replaceChild(previousComment, $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0])
                $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[1].style.display = 'none'
                $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[2].style.display = 'none'
                $event.target.parentElement.parentElement.parentElement.childNodes[2].childNodes[1].childNodes[0].style.display = 'inline'
                $event.target.parentElement.parentElement.parentElement.childNodes[1].style.display = 'inline'
            })
            cancelEditCommentButton.style.cursor = 'pointer'
            $event.target.parentElement.parentElement.parentElement.childNodes[1].style.display = 'flex'
            $event.target.parentElement.parentElement.parentElement.childNodes[1].style.margin = '0 0 5% 0'
            $event.target.parentElement.parentElement.parentElement.childNodes[1].insertBefore(editCommentButton, $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[1])
            $event.target.parentElement.parentElement.parentElement.childNodes[1].insertBefore(cancelEditCommentButton, $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[2])
        },
        validateComment($event) {
            if ($event.target.value.length < 1) {
                $event.target.nextSibling.style.display = 'none'
            } else {
                $event.target.nextSibling.style.display = 'inline'
            }
        },
        getReply($event) {
            if ($event && !this.expanded && $event.target.parentElement.parentElement.parentElement.childNodes[6].tagName == 'SPAN') {
                this.$emit('getReply', this.parentId)
                $event.target.parentElement.parentElement.parentElement.childNodes[6].style.display = 'none'
                setTimeout(() => { this.expanded = true }, 1000)
                setTimeout(() => { $event.target.parentElement.parentElement.parentElement.parentElement.childNodes[1].lastChild.scrollIntoView() }, 1200)
                $event.target.parentElement.style.display = 'none'
            } else if ($event && !this.expanded && $event.target.parentElement.parentElement.parentElement.childNodes[6] == undefined ) {
                this.$emit('getLastComment', this.parentId)
                setTimeout(() => { this.expanded = true }, 1000)
                setTimeout(() => { $event.target.parentElement.parentElement.parentElement.parentElement.childNodes[1].lastChild.scrollIntoView() }, 1200)           
            } else if ($event && this.expanded) {
                this.$emit('getLastComment', this.parentId)
                setTimeout(() => { this.forceRerender() }, 1000)
                setTimeout(() => { $event.target.parentElement.parentElement.parentElement.parentElement.childNodes[1].lastChild.scrollIntoView() }, 999)           
                $event.target.parentElement.style.display = 'none'
            } else {
                this.$emit('getReply', this.parentId)
                setTimeout(() => { this.expanded = true }, 500)
            }
        },
        setParentId($event) {
            this.parentId = $event.target.id
        },
        forceRerender() {
            this.componentKey += 1;
        },
        forceRerenderEdit() {
            this.componentKeyEdit += 1;
        },
    },
    beforeMount() {
        this.getCommentsLikes()
        this.getCommentsDislikes()
        document.addEventListener('keypress', ($event) => {
            if ($event.keyCode === 13) {
                $event.preventDefault()
            }
        })
    },
}
</script>

<style>

.commentIconContainer {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
}

.formReply > button {
    padding:  0 0;
    min-width: 50px;
}

</style>