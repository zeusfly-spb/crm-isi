<template>
    <div>
        Личный кабинет {{ user && user.name || ''}}
    </div>
</template>
<script>
    export default {
        data: () => ({
            data: null
        }),
        computed: {
            user () {
                return this.$store.state.authUser || null
            }
        },
        methods: {
            getData () {
                this.axios.post('/api/details')
                    .then(res => this.data = res.data.success)
                    .catch(e => console.dir(e))
            },
            logOut () {
                this.$store.dispatch('logOut')
                this.$router.push('/login')
            }
        },
        mounted () {
            this.getData()
            console.log('Я дома ))')
        }
    }
</script>
