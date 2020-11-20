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
                            @keyup.enter="addComment"
                    />
                    <v-data-table
                            v-blur="updating"
                            :items="comments"
                            hide-headers
                            hide-actions
                    >
                        <template v-slot:items="props">
                            <td
                                    style="width: 1em"
                                    align="left"
                            >
                                <v-icon
                                        v-if="canDelete(props.item)"
                                        color="red"
                                        class="clickable"
                                        title="Удалить комментарий"
                                        @click="confirmDelete(props.item)"
                                >
                                    close
                                </v-icon>
                            </td>
                            <td>
                                {{ props.item.text }}
                            </td>
                            <td
                                    style="width: 3em"
                                    align="right"
                            >
                                <user-avatar
                                        v-if="props.item.user"
                                        :user="props.item.user"
                                />
                                <v-avatar
                                        size="36px"
                                        v-else
                                        title="Системный комментарий"
                                >
                                    <img
                                            :src="`${basePath}/img/logo.png`"
                                    />
                                </v-avatar>
                            </td>
                            <td
                                    style="width: 15em"
                                    align="right"
                            >
                                {{ props.item.created_at | moment('D MMMM YYYY г. H:m')}}
                            </td>
                        </template>
                        <template v-slot:no-data>
                            <span class="red--text">Нет комментариев</span>
                        </template>

                    </v-data-table>
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
            basePath () {
                return this.$store.state.basePath
            },
            updating () {
                return false
            },
            empty () {
                return !this.comments.length
            },
            comments () {
                return this.certificate && this.certificate.comments.reverse() || []
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
        methods: {
            confirmDelete (comment) {

            },
            canDelete (comment) {
                return +comment.user_id === +this.$store.state.authUser.id
            },
            addComment () {
                if (!this.newCommentText.length || !this.certificate) {
                    return
                }
                this.$store.dispatch('pushFrame', {
                    type: 'request_add_certificate_comment',
                    model: {
                        id: this.certificate.id,
                        text: this.newCommentText,
                        user_id: this.$store.state.authUser.id
                    }
                })
                    .then(() => this.addModeOff())
            },
            close () {
                this.active = false
            },
            addModeOn () {
                this.addMode = true
            },
            addModeOff () {
                this.addMode = false
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
        }
    }
</script>

<style scoped>

</style>
