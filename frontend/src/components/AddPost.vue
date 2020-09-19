<template>
    <form>
        <div class="uploadContainer">

            <h1>Share Your Gif here</h1>

            <div>
                <label for="title"><b>Title</b></label>
                <input @input="validateFileInput($event)" v-model="title" type="text" name="title">
            </div>

            <div class="uploadfilecontainer">
                <label for="file"><b>Upload your file</b></label>
                <br>
                <input pattern="^.*\.(jpg|jpeg|png|gif)$" type="file" name="file" @change="validateFileInput($event), previewFile($event)">
                <img id="imagepreview" />
            </div>

            <button type="submit" @click.prevent="uploadFile" disabled>Upload</button>
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
            }).then((response) => {
                console.log(response)
                this.$router.push('/postlist')
            }).catch((err => {
                console.log(err)
            }))
        },
        validateFileInput() {
                let inputElement = document.querySelectorAll('input');
                let submitButton = document.getElementsByTagName('button')[0];
                for (let i = 0; i < inputElement.length; i++) {
                if (inputElement[0].value.length >= 1 && inputElement[1].value.match(inputElement[1].pattern)) {
                    submitButton.removeAttribute('disabled');
                } else {
                    submitButton.setAttribute('disabled', true)
                }
            }
        }
    }
}
</script>

<style>

#imagepreview {
    padding: 5% 0 0 0;
}

.uploadContainer {
    display: flex;
    flex-flow: column;
    margin: 0 0 5% 0;
    width: 90%;
}

.uploadfilecontainer {
    margin: 5% 0;
    display: flex;
    flex-flow: column;
}

input[type=file] {
    margin: 3% 0 0 0;
}

@media only screen and (min-width: 461px) {
    .uploadContainer {
        width: 60%;
    }
}

@media only screen and (min-width: 1025px) {
    .uploadContainer {
        width: 40%;
    }
}

</style>