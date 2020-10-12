<template>
    <footer>
        <h5>{{ copyright }}</h5>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
    data() {
        return {
            companyName: 'Groupomania'
        }
    },
    computed: {
        copyright() {
            const currentYear = new Date().getFullYear()
            return `Copyright ${this.companyName} ${currentYear}`
        }
    }
}
</script>

<style>

footer {
    background: crimson;
}

h5 {
    font-style: italic;
    text-align: center;
    color: white;
}

</style>