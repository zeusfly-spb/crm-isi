<template>
    <div>
        <v-btn
            icon
            title="Отправить SMS"
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
                        v-validate="'digits:10'"
                        mask="(###) ### - ####"
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
            inputText: 'test!! super'
        }),
        computed: {
            telNumber () {
                if (this.phone) {
                    return this.phone[0] === '+' && this.phone[1] === '7' ? this.phone : '+7' + this.phone
                } else {
                    return '+7' + this.inputNumber
                }
            }
        },
        methods: {
            showDialog () {
                this.dialog = true
            },
            sendSMS () {
                this.$validator.validate()
                    .then(res => {
                        if (!res) {
                            return
                        }
                        this.axios.post('https://crmkin.ru/tel/api/vpbx/sms/send', {
                            base_type: 'isi',
                            user_id: 1,
                            extension: this.$store.getters.currentVpbxExtension,
                            phone: this.telNumber,
                            text: this.inputText
                        })
                            .then(() => this.dialog = false)
                            .finally(() => this.$store.dispatch('pushMessage', {
                                text: `СМС отправлено на номер ${this.telNumber}`
                            }))
                    })
            }
        },
        watch: {
            dialog (val) {
                !val ? this.inputNumber = '' : null
            }
        }
    }
</script>

<style scoped>

</style>
