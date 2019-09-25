<template>
    <v-btn
        icon
        title="Позвонить"
        @click="makeCall"
        :disabled="!authUser.vpbx_extension"
    >
        <v-icon
            :class="{'green--text': !!authUser.vpbx_extension, 'grey--text': !authUser.vpbx_extension}"
        >
            phone
        </v-icon>
    </v-btn>
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
                    phone: this.phone[0] === '+' && this.phone[1] === '7' ? this.phone : '+7' + this.phone
                })
            }
        }
    }
</script>
