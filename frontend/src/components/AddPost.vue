<template>
    <form>
        <div class="uploadContainer">

            <h1>Share Your Gif here</h1>

            <div>
                <label for="title"><b>Title</b></label>
                <input v-model="title" type="text" name="title">
            </div>

            <div class="uploadfilecontainer">
                <label for="file"><b>Upload your file</b></label>
                <br>
                <input type="file" name="file" @change="setDataFileProperty($event)">
            </div>

            <button type="submit" @click.prevent="uploadFile">Upload</button>
        </div>
    </form>
</template>

<script>
import axios from 'axios';

export default {
    name: 'addPost',
    data () {
        return {
            userId: this.$store.state.userId,
            title: '',
            file: ''
        }
    },
    methods: {
        setDataFileProperty($event) {
            this.file = $event.target.files[0]
        },
        uploadFile() {
            let formData = new FormData();
            formData.append('file', this.file)
            formData.append('userId', this.userId)
            formData.append('title', this.title)
            axios.post('http://localhost:3000/api/post', formData,
            { headers:
                {
                'Authorization': `Bearer ${this.$store.state.token}`,
                'Content-Type': 'multipart/form-data' 
                }
            }
            ).then((response) => {
                console.log(response)
                this.$router.push('/postlist')
            }).catch((err => {
                console.log(err)
            })
        )}
    },
    watch: {
        disableButton() {
            console.log(this.file)
            }
    }
}
</script>

<style>

.uploadContainer {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
}

.uploadfilecontainer {
    margin: 10% 0;
}

input[type=file] {
    margin: 3% 0 0 0;
}

</style>