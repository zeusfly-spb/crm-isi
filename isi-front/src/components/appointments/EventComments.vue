<template>
    <div>
        <span
            v-if="lastComment"
            class="clickable"
            :class="{'system': lastComment && lastComment.user_id === 0}"
            :title="!comments.length ? 'Нет комментариев' : 'Показать список комментариев'"
            @click="showList"
        >
            {{ lastComment.text }}
        </span>
        <span
            v-if="comments.length > 1"
            class="count"
        >
            ({{ comments.length }})
        </span>
        <v-dialog
            v-if="list"
            v-model="list"
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
                        class="title white--text"
                    >
                        {{ listTitle }}
                    </span>
                    <v-spacer/>
                    <v-icon
                        color="white"
                        class="clickable"
                        title="Закрыть список комментариев"
                        @click="hideList"
                    >
                        close
                    </v-icon>
                </v-card-title>
                <v-card-text
                        class="list-entry"
                >
                    <event-comment-adder
                            v-model="addMode"
                            :event="event"
                    />
                    <v-data-table
                        :items="comments"
                        hide-actions
                        hide-headers
                    >
                        <template
                            v-slot:items="props"
                        >
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
                                <span
                                    :class="{'system': !props.item.user_id}"
                                >
                                   {{ props.item.text }}
                                </span>
                            </td>
                            <td>
                                {{ props.item.created_at | moment('D MMMM YYYY г. HH:mm')}}
                            </td>
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="darken-1" flat @click="hideList">
                        Закрыть
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import EventCommentAdder from "./EventCommentAdder";
    import UserAvatar from "../main/UserAvatar";
    export default {
        name: 'EventComments',
        props: ['event'],
        data: () => ({
            addMode: false,
            list: false
        }),
        computed: {
            basePath () {
                return this.$store.state.basePath
            },
            users () {
                return this.$store.state.users
            },
            listTitle () {
                return `Комментарии к записи от ${this.$moment(this.event.date).format('D MMMM YYYY г. HH:mm')} клиента  ${this.event.client_name}`
            },
            lastComment () {
                return this.comments[0]
            },
            comments: {
                get () {
                    let base = this.event && this.event.comments
                    const getUser = (id) => {
                        let user = this.users.find(user => user.id === id)
                        if (+id === 1) {
                            user.full_name = 'Администратор'
                        }
                        return user
                    }
                    return base.map(item => ({...item, user: getUser(item.user_id) })).reverse()
                }
            }
        },
        methods: {
            showList () {
                this.list = true
            },
            hideList () {
                this.list = false
            }
        },
        watch: {
            list () {
                this.addMode = false
            }
        },
        components: {
            UserAvatar,
            EventCommentAdder
        }
    }
</script>
<style scoped>
    .list-entry {
        padding-top: 0!important;
        padding-left: 0!important;
        padding-right: 0!important;
    }
    .count {
        color: #2e7d32;
    }
    .system {
        color: #01579B;
    }
</style>