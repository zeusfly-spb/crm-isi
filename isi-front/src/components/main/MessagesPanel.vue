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
            snackColor: '',
            voices: [],
            synth: null,
            utterInstance: null
        }),
        computed: {
            voiceMessages () {
                return this.$store.state.voice.voiceOutbox
            },
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
            },
            testSpeak () {
                try {
                    const utterInstance = new SpeechSynthesisUtterance(`Приход на 22 июля 2020 года составляет 300000 рублей,
             из них 35000 наличными, остальные безналом. В данный момент трое сотрудников онлайн, один отправляет сообщения,
             один совершает звонок`)
                    let synth = window.speechSynthesis
                    let voices
                    setTimeout(() => {
                        voices = synth.getVoices()
                        console.log(synth)
                        console.log(voices)
                        utterInstance.voice = voices[15]
                        synth.speak(utterInstance)
                    }, 50)
                } catch (e) {
                    console.error(e)
                    throw e
                }
            }
        },
        mounted () {
            this.testSpeak()
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
