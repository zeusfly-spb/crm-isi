<template>
    <v-flex>
        <v-dialog
                v-model="active"
                max-width="1000px"
                :persistent="addMode"
        >
            <v-card
                    class="round-corner"
            >
                <v-card-title
                        class="light-blue darken-3"
                >
                    <v-icon
                            color="white"
                            class="pr-2"
                    >
                        comment
                    </v-icon>
                    <span
                            class="white--text title"
                    >
                    Комментарии к сертификату  <span class="yellow--text">{{ customerName }}
                    </span> от
                        <span class="orange--text"><strong>{{ certificateStartDate | moment('DD/MM/YYYY')}}</strong></span>
                    </span>
                    <v-spacer/>
                    <v-icon
                            color="white"
                            class="clickable"
                            title="Закрыть панель комментариев"
                            @click="close"
                    >
                        close
                    </v-icon>
                </v-card-title>
                <v-card-text>
                    <v-icon
                            v-if="!addMode"
                            color="green"
                            class="clickable"
                            title="Добавить комментарий"
                            @click="addModeOn"
                    >
                        add_circle_outline
                    </v-icon>
                    <v-text-field
                            v-blur="updating"
                            autofocus
                            label="Новый комментарий"
                            v-if="active && addMode"
                            v-model="newCommentText"
                            ref="addInput"
                            @keyup.esc="addModeOff"
                            @blur="addModeOff"
                            @keyup.enter="saveNewComment"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
    export default {
        name: 'CertificateComments',
        data: () => ({
            addMode: false,
            newCommentText: ''
        }),
        computed: {
            updating () {
                return false
            },
            empty () {
                return !this.comments.length
            },
            comments () {
                return this.certificate && this.certificate.comments || []
            },
            customerName () {
                let full = this.certificate && this.certificate.customer && this.certificate.customer.full_name
                return full
            },
            certificateStartDate () {
                return this.certificate && this.certificate.start_date || ''
            },
            certificate () {
                if (!this.commentsOpenId) {
                    return null
                }
                return this.$store.state.subscribes.certificates.find(item => +item.id === +this.commentsOpenId) || null
            },
            commentsOpenId () {
                return this.$store.state.subscribes.certCommentsOpenId
            },
            active: {
                get () {
                    return !!this.commentsOpenId
                },
                set (val) {
                    !val ? this.$store.commit('SET_CERT_COMMENTS_OPEN_ID', null) : null
                }
            }
        },
        watch: {
            addMode (val) {
                val ? this.newCommentText = '' : null
                if (!val && this.empty) {
                    this.close()
                }
            },
            active (val) {
                val && this.empty ? this.addModeOn() : null
            }
        },
        methods: {
            close () {
                this.active = false
            },
            addModeOn () {
                this.addMode = true
            },
            addModeOff () {
                this.addMode = false
            }
        }
    }
</script>

<style scoped>

</style>
