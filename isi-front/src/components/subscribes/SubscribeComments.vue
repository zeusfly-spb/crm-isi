<template>
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
                <span
                    class="white--text title"
                >
                    Комментарии к абонементу <span class="yellow--text"><strong>{{ subscriptionName }}</strong></span> от <span class="orange--text"><strong>{{ subscribeStartDate }}</strong></span>
                </span>
                <v-spacer/>
                <v-icon
                    color="white"
                    class="clickable"
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
                    @click="addModeOn"
                >
                    add_circle_outline
                </v-icon>
                <v-text-field
                    autofocus
                    label="Новый комментарий"
                    v-if="active && addMode"
                    v-model="newCommentText"
                    @keyup.esc="addModeOff"
                />
                <v-data-table
                    :items="comments"
                    hide-headers
                    hide-actions
                >
                    <template v-slot:items="props">
                        <td>
                            {{ props.item.text }}
                        </td>
                        <td>
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
                        <td>
                            {{ props.item.created_at | moment('D MMMM YYYY г.')}}
                        </td>
                    </template>
                    <template v-slot:no-data>
                        <span class="red--text">Нет комментариев</span>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import UserAvatar from '../main/UserAvatar'
    export default {
        name: 'SubscribeComments',
        data: () => ({
            newCommentText: '',
            addMode: false
        }),
        computed: {
            empty () {
                return this.comments && this.comments.length === 0
            },
            basePath () {
                return this.$store.state.basePath
            },
            subscribeStartDate () {
                return this.subscribe && this.subscribe.start_date && this.$moment(this.subscribe.start_date).format('D MMMM YYYY г.') || ''
            },
            subscriptionName () {
                return this.subscribe && this.subscribe.subscription && this.subscribe.subscription.name || 'Абонемент'
            },
            comments () {
                let base = this.subscribe && this.subscribe.comments && this.subscribe.comments.reverse() || []
                return base.map(item => ({
                    ... item,
                    user: this.$store.state.users.find(user => +user.id === +item.user_id)
                }))
            },
            subscribe () {
                if (!this.commentsOpenId) {
                    return null
                }
                return this.$store.state.subscribes.subscribes
                    .find(item => item.id === this.commentsOpenId)
            },
            active: {
                get () {
                    return !!this.commentsOpenId
                },
                set (val) {
                    !val ? this.$store.commit('SET_SUBSCRIBE_COMMENTS_OPEN_ID', null) : null
                }
            },
            commentsOpenId () {
                return this.$store.state.subscribes.commentsOpenId
            }
        },
        methods: {
            addModeOff () {
                this.addMode = false
            },
            addModeOn () {
                this.addMode = true
            },
            close () {
                this.active = false
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
        components: {
            UserAvatar
        }
    }
</script>

<style scoped>

</style>
