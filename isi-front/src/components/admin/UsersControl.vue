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
                <td>{{ props.item.last_name }}</td>
                <td>{{ props.item.first_name }}</td>
                <td>{{ props.item.patronymic }}</td>
                <td>{{ props.item.birth_date | moment('DD MMMM YYYY г.') }}</td>
                <td>{{ props.item.phone }}</td>
                <td>{{ props.item.island_id }}</td>
                <td>{{ props.item.group_id }}</td>
                <td class="justify-center layout px-0">
                    <v-icon
                        small
                        class="mr-2 green--text"
                        @click="editUser(props.item)"
                        title="Редактировать"
                    >
                        edit
                    </v-icon>
                    <v-icon
                        class="red--text"
                        small
                        @click=""
                        title="Удалить"
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
                <v-btn color="primary" dark class="mb-2" @click="addUser">Новый сотрудник</v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ {add: 'Добавить', edit: 'Редактировать'}[mode] }} сотрудника</span>
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedUser.name" label="Логин"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedUser.password" label="Пароль"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedUser.c_password" label="Повторите пароль"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedUser.last_name" label="Фамилия"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedUser.first_name" label="Имя"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedUser.patronymic" label="Отчество"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
<!--                                <v-text-field v-model="editedUser.birth_date" label="Дата рождения"></v-text-field>-->
                                <v-menu
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                                    v-model="menu"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            :label="editedUser.birth_date | moment('DD MMMM YYYY г.')"
                                            prepend-icon="event"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" no-title scrollable
                                                   @change="datePicked"
                                    >
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedUser.phone" label="Телефон"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedUser.address" label="Адрес"></v-text-field>
                            </v-flex>

                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="dialog = false">Отмена</v-btn>
                    <v-btn color="blue darken-1" flat @click="saveUser(editedUser)">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-flex>
</template>

<script>
    export default {
        data: () => ({
            menu: false,
            date: '',
            mode: '',
            editedUser: null,
            defaultUser: {
                password: '',
                c_password: '',
                name: '',
                first_name: '',
                last_name: '',
                patronymic: '',
                birth_date: '',
                address: '',
                phone: '',
                group_id: '',
                island_id: ''
            },
            dialog: false,
            headers: [
                {
                    text: '#',
                    value: 'id'
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
                    text: 'Фамилия',
                    value: 'last_name'
                },
                {
                    text: 'Имя',
                    value: 'first_name'
                },
                {
                    text: 'Отчество',
                    sortable: false
                },
                {
                    text: 'Дата рождения',
                    value: 'birth_date'
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
            datePicked (date) {
                this.editedUser.birth_date = new Date(date).toISOString().split('T')[0]
                this.menu = false
            },
            saveUser (user) {
                if (this.mode === 'edit') {
                    // this.axios.post('/api/save_user', {...user})
                    //     .then(res => {
                    //         this.dialog = false
                    //     })
                    //     .catch(e => console.error(e.data))
                    this.$store.dispatch('updateUser', user)
                        .then(() => this.dialog = false)
                        .catch(e => console.error(e))
                } else {
                    this.$store.dispatch('addUser', user)
                        .then(() => this.dialog = false)
                        .catch(e => console.error(e))
                }
            },
            editUser (user) {
                this.mode = 'edit'
                this.editedUser = JSON.parse(JSON.stringify(user))
                this.dialog = true
            },
            addUser () {
                this.editedUser = this.defaultUser
                this.mode = 'add'
                this.dialog = true
            }
        },
        created () {
            this.editedUser = this.defaultUser
        }

    }
</script>
