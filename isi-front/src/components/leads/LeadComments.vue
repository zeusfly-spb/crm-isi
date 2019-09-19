<template>
    <v-flex>
        <span
            v-if="comments.length"
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
            <v-card style="border-radius: 5px">
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
                            />
                        </v-layout>
                        <v-flex>
                            <v-data-table
                                :items="comments"
                                :headers="headers"
                                hide-actions
                                hide-headers
                            >
                                <template v-slot:items="props">
                                    <td>{{ props.index + 1}}</td>
                                    <td>
                                        <span>{{ props.item.text }}</span>
                                    </td>
                                    <td>
                                        <span>{{ props.item.user.full_name }}</span>
                                    </td>
                                    <td>
                                        <span>{{ props.item.created_at | moment('DD MMMM YYYY г. HH:mm:ss') }}</span>
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
                           @click=""
                    >
                        Добавить
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
            newComment: '',
            headers: [
                {text: '#', value: null, sortable: false},
                {text: 'Комментарий', value: null, sortable: false},
                {text: 'Автор', value: null, sortable: false},
                {text: 'Дата/Время', value: null, sortable: false}
            ]
        }),
        computed: {
            lastComment () {
                return this.comments && this.comments.length && this.comments[0]
            },
            comments () {
                return this.lead.comments.reverse()
            }
        },
        methods: {
            activate () {
                this.active = true
            }
        },
        watch: {
            active (val) {
                if (val && !this.comments.length) {
                    this.adding = true
                }
            }
        }
    }
</script>
<style scoped>
    .clickable {
        cursor: pointer;
        opacity: .8;
    }
    .clickable:hover {
        opacity: 1;
    }
</style>
