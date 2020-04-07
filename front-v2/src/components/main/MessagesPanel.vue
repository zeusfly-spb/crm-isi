<template>
    <v-snackbar
        v-model="snackbar"
        auto-height
        top
        :timeout="messageTime * 1000"
        :color="snackColor"
    >
        <span>{{ snackText }}</span>
    </v-snackbar>
</template>
<script>
    export default {
        name: 'MessagesPanel',
        data: () => ({
            snackbar: false,
            snackText: '',
            snackColor: ''
        }),
        computed: {
            messageTime () {
                return this.$store.state.layout.messageTime
            },
            messages () {
                return this.$store.state.layout.messages
            }
        },
        methods: {
            showMessage () {
                this.$store.dispatch('pullMessage')
                    .then(res => {
                        [this.snackColor, this.snackText, this.snackbar] = [res.color, res.text, true]
                    })
            }
        },
        watch: {
            messages (val) {
                val.length ? this.showMessage() : null
            }
        }
    }
</script>
