<template>
    <form>

        <img src="../assets/7plQ.gif" alt="" id="loadingGif" hidden>

        <div class="uploadContainer">

            <h1>Share Your Gif here</h1>

            <div>
                <label for="title"><b>Title</b></label>
                <input v-model="title" @input="validateFileInput($event)" type="text" name="title" value="">
            </div>

            <div class="uploadfilecontainer">
                <label for="file"><b>Upload your file</b></label>
                <br>
                <input accept="image/gif, image/jpeg, image/png" pattern="^.*\.(jpg|jpeg|png|gif)$" type="file" name="file" @change="validateFileInput($event), previewFile($event)">
                <img src="" id="imagepreview" />
            </div>

            <button type="submit" @click.prevent="editPost($event)">Edit</button>
        </div>
    </form>
</template>

<script>
import axios from 'axios';

export default {
    name: 'EditPost',
    data () {
        return {
            post: [],
            userId: sessionStorage.getItem('userId'),
            title: '',
            file: ''
        }
    },
    methods: {
        previewFile ($event) {
            this.file = $event.target.files[0]
            if (this.file instanceof Blob) {
                let reader = new FileReader();
                reader.onload = function ($event) {
                    document.getElementById("imagepreview").src = $event.target.result;
                }
                reader.readAsDataURL(this.file);
            } else {
                document.getElementById("imagepreview").src = '';
            }
        },
        editPost() {
            document.getElementsByClassName('uploadContainer')[0].style.display = 'none'
            document.getElementById('loadingGif').removeAttribute('hidden')
            let formData = new FormData();
            formData.append('file', this.file)
            formData.append('userId', this.userId)
            formData.append('title', this.title)
            axios.put('http://localhost:3000/api/post/editpost/' + this.$route.params.postId, formData,
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data' 
                }
            }).then((response) => {
                if (response.data.status === '200') {
                    this.$router.push('/postlist')
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    document.getElementById('loadingGif').setAttribute('hidden', true);
                    document.getElementsByClassName('uploadContainer')[0].style.display = 'initial'
                    alert(response.data.message)
                }
            }).catch((err => {
                document.getElementById('loadingGif').setAttribute('hidden', true);
                document.getElementsByClassName('uploadContainer')[0].style.display = 'initial'
                alert(err)
            }))
        },
        validateFileInput() {
                let inputElement = document.querySelectorAll('input');
                let submitButton = document.getElementsByTagName('button')[0];
                for (let i = 0; i < inputElement.length; i++) {
                if (inputElement[0].value.length < 1 && !inputElement[1].value.match(inputElement[1].pattern)) {
                    submitButton.setAttribute('disabled', true)
                } else {        
                    submitButton.removeAttribute('disabled');
                }
            }
        },
        getSinglePost() {
            axios.get('http://localhost:3000/api/post/singlepost/' + this.$route.params.postId,
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
                }
            }).then((response) => {
                if (response.data.status === '200' && response.data.data.length === 1) {
                    document.getElementsByTagName('input')[0].value = response.data.data[0].Title
                    document.getElementById('imagepreview').src = response.data.data[0].ImageURL
                } else if (response.data.status === '200' && response.data.data.length < 1) {
                    this.$router.push('/notfound')
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                }
            }).catch((err => {
                alert(err)
            }))
        }
    },
    beforeMount() {
        this.getSinglePost()
    }
}
</script>

<style>


</style>