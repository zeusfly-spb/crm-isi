<template>
    <v-btn
        icon
        title="Позвонить"
        @click="makeCall"
        :small="mini"
        :disabled="!currentVpxExtension"
        :color="flash ? 'white' : null"
        :large="flash && scalable"
    >
        <v-icon
            :small="mini"
            v-if="!mustBlink ? flash : true"
            :color="!!currentVpxExtension ? 'green' : 'grey'"
        >
            phone
        </v-icon>
    </v-btn>
</template>
<script>
    export default {
        name: 'Caller',
        props: {
            phone: {
                type: String,
                required: true
            },
            blinked: {
                type: Boolean,
                required: false,
                default: false
            },
            lead: {
                type: Object,
                required: false,
                default: null
            }
        },
        data: () => ({
            flash: false,
            timer: false,
            scalable: false,
            mustBlink: true
        }),
        computed: {
            mini () {
                return this.$store.getters.miniMode
            },
            authUser () {
                return this.$store.state.authUser
            },
            currentVpxExtension () {
                return this.$store.getters.currentVpbxExtension
            }
        },
        methods: {
            makeCall () {
                if (this.lead) {
                    this.$store.dispatch('addLeadCall', this.lead.id)
                }
                this.axios.post('https://crmkin.ru/tel/api/vpbx/call/make', {
                    user_id: this.authUser.id,
                    extension: this.currentVpxExtension,
                    phone: this.phone[0] === '+' && this.phone[1] === '7' ? this.phone : '+7' + this.phone
                })
            }
        },
        mounted () {
            if (this.blinked) {
                this.timer = setInterval(() => {
                    this.flash = !this.flash
                }, 500)
            }
        },
        watch: {
            blinked (val) {
                if (val && !this.timer) {
                    this.timer = setInterval(() => {
                        this.flash = !this.flash
                    }, 500)
                } else {
                    if (!this.timer) clearInterval(this.timer)
                }
            }
        }
    }
</script>
