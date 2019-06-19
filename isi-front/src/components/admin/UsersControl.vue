<template>
    <v-flex
        align-center
    >
        <v-snackbar
            v-model="snackbar"
            auto-height
            top
            :timeout="3000"
            :color="snackColor"
        >
            <span>{{ errorText }}</span>
        </v-snackbar>

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
                        @click="showDeleteConfirm(props.item)"
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

        <v-dialog v-model="dialog" max-width="600px">
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
                                <v-text-field v-model="editedUser.name"
                                              label="Логин"
                                              data-vv-as="Логин"
                                              data-vv-name="name"
                                              :error-messages="errors.collect('name')"
                                              v-validate="mode === 'add' ? 'required|max:10' : null"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedUser.password"
                                              label="Пароль"
                                              type="password"
                                              data-vv-as="Пароль"
                                              data-vv-name="password"
                                              :error-messages="errors.collect('password')"
                                              v-validate="mode === 'add' ? 'required' : null"
                                              ref="password"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedUser.c_password"
                                              label="Повторите пароль"
                                              type="password"
                                              data-vv-as="Подтверждение пароля"
                                              data-vv-name="password_confirm"
                                              :error-messages="errors.collect('password_confirm')"
                                              v-validate="mode === 'add' ? 'required|confirmed:password' : null"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedUser.last_name" label="Фамилия"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editedUser.first_name"
                                              label="Имя"
                                              data-vv-as="Имя"
                                              data-vv-name="first_name"
                                              :error-messages="errors.collect('first_name')"
                                              v-validate="'required'"
                                ></v-text-field>
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
                    <v-btn color="darken-1" flat @click="dialog = false">Отмена</v-btn>
                    <v-btn color="green darken-1" flat @click="saveUser(editedUser)">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="confirm"
                  max-width="290"
        >
            <v-card>
                <v-card-title>
                    <v-card-title class="subheading">
                        {{ confirmText }}
                    </v-card-title>
                    <v-card-actions>
                        <v-btn
                            flat="flat"
                            @click="confirm = false"
                        >
                            Отмена
                        </v-btn>
                        <v-btn
                            color="red darken-1"
                            flat="flat"
                            @click="deleteUser"
                        >
                            Удалить
                        </v-btn>
                    </v-card-actions>
                </v-card-title>
            </v-card>

        </v-dialog>

    </v-flex>
</template>

<script>
    export default {
        data: () => ({
            toDeleteUserId: null,
            confirmText: '',
            confirm: false,
            snackColor: 'green',
            errorText: '',
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
            snackbar: false,
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
            deleteUser () {
                this.$store.dispatch('deleteUser', this.toDeleteUserId)
                    .then(() => {
                        this.confirm = false
                        this.showSuccess('Пользователь удален')
                    })
                    .catch(e => console.error(e))
            },
            showDeleteConfirm (user) {
                this.toDeleteUserId = user.id
                this.confirmText = `Удалить сотрудника ${user.first_name}?`
                this.confirm = true
            },
            showSuccess (text) {
                this.snackColor = 'green'
                this.errorText = text
                this.snackbar = true
            },
            showError (text) {
                this.snackColor = 'red'
                this.errorText = text
                this.snackbar = true
            },
            datePicked (date) {
                this.editedUser.birth_date = new Date(date).toISOString().split('T')[0]
                this.menu = false
            },
            saveUser (user) {
                if (this.mode === 'edit') {
                    this.$store.dispatch('updateUser', user)
                        .then(() => {
                            this.dialog = false
                            this.showSuccess('Данные пользователя обновлены')
                        })
                        .catch(e => {
                            if (e.error) {
                                this.showError(e.error)
                            }
                            console.error(e)
                        })
                } else {
                    this.$validator.validate()
                        .then(res => {
                            if (res) {
                                this.$store.dispatch('addUser', user)
                                    .then(() => {
                                        this.dialog = false
                                        this.showSuccess('Пользователь добавлен')
                                    })
                                    .catch(e => {
                                        if (e.error) {
                                            this.showError(e.error)
                                        }
                                        console.error(e)
                                    })
                            }
                        })
                }
            },
            editUser (user) {
                this.errors.clear()
                this.mode = 'edit'
                this.editedUser = JSON.parse(JSON.stringify(user))
                this.dialog = true
            },
            addUser () {
                this.errors.clear()
                this.editedUser = JSON.parse(JSON.stringify(this.defaultUser))
                this.mode = 'add'
                this.dialog = true
            }
        },
        created () {
            this.editedUser = JSON.parse(JSON.stringify(this.defaultUser))
        }

    }
</script>
