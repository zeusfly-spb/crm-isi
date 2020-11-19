<template>
    <v-flex>
        <certificate-mode-switcher/>
    </v-flex>
</template>

<script>
    import CertificateModeSwitcher from './CertificateModeSwitcher'
    export default {
        name: 'CertificatesTable',
        computed: {
            certificates () {
                return this.$store.state.subscribes.certificates
            }
        },
        created() {
            this.$store.dispatch('setCertificates')
        },
        components: {
            CertificateModeSwitcher
        }
    }
</script>

<style scoped>

</style>
