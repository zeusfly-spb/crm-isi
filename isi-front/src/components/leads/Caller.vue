<template>
    <v-icon
        title="Позвонить"
        @click="makeCall"
        v-if="authUser.vpbx_extension"
        :class="{'green--text': !!authUser.vpbx_extension, 'grey--text': !authUser.vpbx_extension}"
    >
        phone
    </v-icon>
</template>
<script>
    export default {
        name: 'Caller',
        props: ['phone'],
        computed: {
            authUser () {
                return this.$store.state.authUser
            }
        },
        methods: {
            makeCall () {
                this.axios.post('https://crmkin.ru/tel/api/vpbx/call/make', {
                    user_id: this.authUser.id,
                    extension: this.authUser.vpbx_extension,
                    phone: this.phone
                })
            }
        }
    }
</script>
