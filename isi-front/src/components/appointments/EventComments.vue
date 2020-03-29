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
        >
            ({{ comments.length }})
        </span>
        <v-dialog
            v-if="list"
            v-model="list"
            max-width="1000px"
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
                <v-card-text>
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
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import UserAvatar from "../main/UserAvatar";
    export default {
        name: 'EventComments',
        props: ['event'],
        data: () => ({
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
                    let base = this.event && this.event.comments.reverse()
                    return base.map(item => ({...item, user: this.users.find(user => +user.id === +item.user_id) || null }))
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
        components: {
            UserAvatar
        }
    }
</script>
<style scoped>
    .system {
        color: #00695C;
    }
</style>