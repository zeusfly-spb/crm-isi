<template>
    <div>
        <v-btn
            icon
            title="Отправить SMS"
            :disabled="!enabled"
            @click="showDialog"
        >
            <v-icon
                color="green"
            >
                sms
            </v-icon>
        </v-btn>
        <v-dialog
            v-model="dialog"
            max-width="600px"
        >
            <v-card
                class="round-corner"
            >
                <v-card-title
                    class="light-blue darken-3 title"
                >
                    <v-icon
                        color="white"
                        class="pr-1"
                    >
                        sms
                    </v-icon>
                    <span
                        class="white--text"
                    >
                        Отправить СМС
                    </span>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        autofocus
                        v-if="!phone && dialog"
                        v-model="inputNumber"
                        label="Телефон"
                        data-vv-as="Номер телефона"
                        data-vv-name="phone"
                        :error-messages="errors.collect('phone')"
                        v-validate="'required|digits:10'"
                        mask="(###) ### - ####"
                    />
                    <v-textarea
                        class="pt-2"
                        solo
                        outline
                        v-model="inputText"
                        label="Текст сообщения"
                        data-vv-as="Текст"
                        data-vv-name="text"
                        :error-messages="errors.collect('text')"
                        v-validate="'required'"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="darken-1" flat @click="dialog = false">Отмена</v-btn>
                    <v-btn color="green darken-1" flat @click="sendSMS">Отправить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: 'SmsSender',
        props: {
            phone: {
                type: String,
                required: false
            }
        },
        data: () => ({
            dialog: false,
            inputNumber: '',
            inputText: ''
        }),
        computed: {
            telNumber () {
                if (this.phone) {
                    return this.phone[0] === '+' && this.phone[1] === '7' ? this.phone : '+7' + this.phone
                } else {
                    return '+7' + this.inputNumber
                }
            },
            enabled () {
                return !!this.$store.getters.workingIsland
            }
        },
        methods: {
            showDialog () {
                this.dialog = true
            },
            hideDialog () {
                this.dialog = false
            },
            sendSMS () {
                const send = () => {
                    this.$store.dispatch('sendSMS', {
                        number: this.telNumber,
                        text: this.inputText
                    })
                        .then(() => this.hideDialog())
                }
                if (!this.phone) {
                    this.$validator.validate()
                        .then(res => {
                            if (!res) {
                                return
                            }
                            send()
                        })
                } else {
                    send()
                }
            }
        },
        watch: {
            dialog (val) {
                this.$validator.pause()
                this.$nextTick(() => {
                    this.$validator.errors.clear()
                    this.$validator.fields.items.forEach(field => field.reset())
                    this.$validator.fields.items.forEach(field => this.errors.remove(field))
                    this.$validator.resume()
                })
                val ? [this.inputNumber, this.inputText] = ['', ''] : null
            }
        }
    }
</script>

<style scoped>

</style>
