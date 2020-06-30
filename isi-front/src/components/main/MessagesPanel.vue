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
            wsOutbox () {
                return this.$store.state.ws.wsOutbox
            },
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
                        [this.snackColor, this.snackText, this.snackbar] = [res.color || 'green', res.text, true]
                    })
            }
        },
        watch: {
            wsOutbox: async function(val) {
                if (!val.length) {
                    return
                }
                try {
                    let frame = await this.$store.dispatch('popFrame')
                    this.$socket.send(JSON.stringify(frame))
                } catch (e) {
                    return Promise.reject(e)
                }
            },
            messages (val) {
                val.length ? this.showMessage() : null
            }
        }
    }
</script>
