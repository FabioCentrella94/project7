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

@media only screen and (min-width: 461px) and (max-width: 1024px) {
    footer > h5 {
        font-size: 1.5em;
    }
}

</style>