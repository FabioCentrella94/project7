<template>
    <div id="profileContainer">
        <div>
            <h2>User ID</h2>
            <p>{{ userDetails.UserID }}</p>
        </div>
        <div>
            <h2>Username</h2>
            <p>{{ userDetails.Username }}</p>
        </div>
        <div>
            <h2>Email</h2>
            <p>{{ userDetails.Email }}</p>
        </div>
        <button @click.prevent="deleteProfile" type="submit">Delete Profile</button>
    </div>
  
</template>

<script>
import axios from 'axios';

export default {
    name: 'Profile',
    data () {
        return {
            userDetails: []
        }
    },
    methods: {
        getUserDetails() {
            axios.get('http://localhost:3000/api/auth/profile/' + this.$route.params.userId,
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
                }
            }).then((response) => {
                if (response.data.status === '200') {
                    this.userDetails = response.data.data[0]
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
        deleteProfile() {
            axios.delete('http://localhost:3000/api/auth/deleteprofile/' + this.$route.params.userId, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                },
            }).then((response) => {
                if (response.data.status === '200') {
                    alert('profile deleted')
                    this.$store.commit('logout')
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$router.push('/')
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
        this.getUserDetails()
    }
}
</script>

<style>

#profileContainer {
    margin: auto auto;
}

#profileContainer > h2, p {
    text-align: left;
}

#profileContainer > button {
    text-align: center
}

</style>