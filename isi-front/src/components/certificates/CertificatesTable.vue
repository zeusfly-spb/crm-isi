<template>
    <v-flex>
        certificates table
    </v-flex>
</template>

<script>
    export default {
        name: 'CertificatesTable',
        computed: {
            certificates () {
                return this.$store.state.subscribes.certificates
            }
        },
        created() {
            this.$store.dispatch('setCertificates')
        }
    }
</script>

<style scoped>

</style>
