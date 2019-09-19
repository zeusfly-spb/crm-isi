<template>
    <v-flex>
        <span
            v-if="comments.length"
            :title="`Показать все комментарии к заявке с номера ${lead.phone}`"
            @click="activate"
            class="clickable fat-able"
        >
            {{ lastComment.text }}
        </span>
        <v-icon
            v-else
            color="green"
            :title="`Добавить комментарий к заявке с номера ${lead.phone}`"
            class="clickable"
            @click="activate"
        >
            add_circle
        </v-icon>
        <v-dialog
            v-model="active"
            max-width="800px"
            :persistent="adding"
        >
            <v-card class="round-border">
                <v-card-title
                    class="light-blue darken-3"
                >
                    <span class="title white--text">
                        {{ `Комментарии к заявке с номера ${lead.phone} от ` }} {{ lead.created_at | moment('DD MMMM YYYY г. HH:mm:ss') }}
                    </span>
                </v-card-title>
                <v-card-text>
                    <v-container
                        grid-list-md
                        style="padding: 0!important; margin: 0!important;"
                    >
                        <v-layout v-if="adding">
                            <v-text-field
                                label="Новый комментарий"
                                v-model="newComment"
                                height="1em"
                                autofocus
                                @keyup.esc="adding = false"
                                @keyup.enter="addComment"
                                data-vv-as="Комментарий"
                                data-vv-name="comment"
                                :error-messages="errors.collect('comment')"
                                v-validate="'required'"
                            />
                        </v-layout>
                        <v-icon
                            v-else
                            @click="adding = true"
                            color="green"
                            title="Добавить комментарий"
                            class="fat-able"
                        >
                            add_circle_outline
                        </v-icon>
                        <v-flex>
                            <v-data-table
                                :items="comments"
                                :headers="headers"
                                hide-actions
                                hide-headers
                            >
                                <template v-slot:items="props">
                                    <td>
                                        <v-icon
                                            color="red"
                                            class="clickable"
                                            v-show="(isSuperadmin || +props.item.user_id === +authUser.id) && props.item.created_at.split(' ')[0] === realDate"
                                            title="Удалить комментарий"
                                            @click="showDeleteConfirm(props.item)"
                                        >
                                            close
                                        </v-icon>
                                    </td>
                                    <td>
                                        <span>{{ props.item.text }}</span>
                                    </td>
                                    <td align="right">
                                        <v-avatar
                                            size="36px"
                                            :title="props.item.user.full_name"
                                        >
                                            <img :src="basePath + props.item.user.avatar" alt="Фото" v-if="props.item.user.avatar">
                                            <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
                                        </v-avatar>
                                    </td>
                                    <td align="right">
                                        <span>{{ props.item.created_at | moment('DD MMM YYYY г. HH:mm:ss') }}</span>
                                    </td>
                                </template>
                                <template v-slot:no-data>
                                    <span class="red--text">Нет комментариев</span>
                                </template>
                            </v-data-table>
                        </v-flex>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="active = false">Закрыть</v-btn>
                    <v-btn color="green darken-1"
                           flat
                           v-if="adding"
                           @click="addComment"
                    >
                        Добавить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="confirm"
            max-width="400"
        >
            <v-card
                class="round-border"
            >
                <v-card-title class="light-blue darken-3">
                    <span class="title white--text">Подтвержение</span>
                </v-card-title>
                <v-card-text>
                    Удалить комментарий <strong>{{ commentToDelete && commentToDelete.text || ''}}</strong>?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="confirm = false">Отмена</v-btn>
                    <v-btn color="red darken-1"
                           flat
                           @click="deleteComment"
                    >
                        Удалить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script>
    export default {
        name: 'LeadComments',
        props: ['lead'],
        data: () => ({
            active: false,
            adding: false,
            confirm: false,
            commentToDelete: null,
            newComment: '',
            headers: [
                {text: 'Действия', value: null, sortable: false},
                {text: 'Комментарий', value: null, sortable: false},
                {text: 'Автор', value: null, sortable: false},
                {text: 'Дата/Время', value: null, sortable: false}
            ]
        }),
        computed: {
            basePath () {
                return this.$store.state.basePath
            },
            lastComment () {
                return this.comments && this.comments.length && this.comments[0]
            },
            comments () {
                return this.lead.comments.reverse()
            },
            isToday () {
                return this.$store.state.accountingDate === this.realDate
            },
            realDate () {
                return this.$store.state.realDate
            },
            authUser () {
                return this.$store.state.authUser
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            }
        },
        methods: {
            deleteComment () {
                this.$store.dispatch('deleteLeadComment', this.commentToDelete.id)
                    .then(() => {
                        this.$emit('updated', `Комментарий '${this.commentToDelete.text}' удален`, 'green')
                        this.confirm = false
                    })
            },
            showDeleteConfirm (comment) {
                this.commentToDelete = comment
                this.confirm = true
            },
            addComment () {
                this.$validator.validate()
                    .then(res => {
                        if (!res) return
                        this.$store.dispatch('addLeadComment', {
                            lead_id: this.lead.id,
                            text: this.newComment
                        })
                            .then(() => {
                                this.adding = false
                                this.$emit('updated', `Добавлен комментарий к заявке с номера ${this.lead.phone}`, 'green')
                            })
                    })
            },
            activate () {
                this.active = true
            }
        },
        watch: {
            active (val) {
                if (val && !this.comments.length) {
                    this.adding = true
                }
            },
            adding (val) {
                if (val) {
                    this.newComment = ''
                }
            }
        }
    }
</script>
<style scoped>
    .fat-able:hover {
        font-weight: bold;
    }
    .clickable {
        cursor: pointer;
        opacity: .8;
    }
    .clickable:hover {
        opacity: 1;
    }
    .round-border {
        border-radius: 5px;
    }
</style>