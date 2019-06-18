<template>
    <v-flex
        align-center
    >
        <v-data-table
            :headers="headers"
            :items="users"
            hide-actions
            class="elevation-1"
        >
            <template v-slot:items="props">
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.id }}</td>
                <td class="justify-center layout px-0">
                    <v-icon
                        small
                        class="mr-2"
                        @click="editUser(props.item)"
                    >
                        edit
                    </v-icon>
                    <v-icon
                        small
                        @click=""
                    >
                        delete
                    </v-icon>
                </td>
            </template>

            <template v-slot:no-data>
                <span class="red--text">Нет сотрудников</span>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">Редактировать сотрудника</span>
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedUser.name" label="Login"></v-text-field>
                            </v-flex>

                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="dialog = false">Отмена</v-btn>
                    <v-btn color="blue darken-1" flat @click="">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-flex>
</template>

<script>
    export default {
        data: () => ({
            editedUser: {
                name: ''
            },
            dialog: false,
            headers: [
                {
                    text: '#'
                },
                {
                    text: 'Логин',
                    sortable: false
                },
                {
                    text: 'Пароль',
                    sortable: false
                },
                {
                    text: 'Фамилия'
                },
                {
                    text: 'Имя'
                },
                {
                    text: 'Отчество',
                    sortable: false
                },
                {
                    text: 'Дата рождения'
                },
                {
                    text: 'Телефон',
                    sortable: false
                },
                {
                    text: 'Островок'
                },
                {
                    text: 'Группа'
                },
                {
                    text: 'Действия',
                    sortable: false
                }
            ]
        }),
        computed: {
            users () {
                return this.$store.state.users
            }
        },
        methods: {
            editUser (user) {
                this.editedUser = user
                this.dialog = true
            }
        }

    }
</script>
