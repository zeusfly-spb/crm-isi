<template>
    <v-flex align-center>
        <v-layout>
            <span class="title ml-2">Клиенты</span>
        </v-layout>
        <v-dialog
            v-model="dialog"
            max-width="600px"
        >
            <template v-slot:activator="{ on }">
                <v-btn color="primary" flat dark class="mb-2" @click="showAddDialog">Добавить клиента</v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ {add: 'Добавить', edit: 'Редактировать'}[mode] }} клиента</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>

                            <v-flex xs12 sm6 md4>
                                <v-text-field
                                    v-model="editedCustomer.last_name"
                                    label="Фамилия"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs12 sm6 md4>
                                <v-text-field
                                    v-model="editedCustomer.first_name"
                                    label="Имя"
                                    data-vv-as="Имя"
                                    data-vv-name="first-name"
                                    :error-messages="errors.collect('first-name')"
                                    v-validate="'required'"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs12 sm6 md4>
                                <v-text-field
                                    v-model="editedCustomer.patronymic"
                                    label="Отчество"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs12 sm6 md4>
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
                                            :label="editedCustomer.birth_date | moment('DD MMMM YYYY г.')"
                                            prepend-icon="event"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="date"
                                        no-title
                                        scrollable
                                        @change="datePicked"
                                    ></v-date-picker>
                                </v-menu>
                            </v-flex>

                            <v-flex xs12 sm6 md4>
                                <v-text-field
                                    v-model="editedCustomer.address"
                                    label="Адрес"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs12 sm6 md4>
                                <v-text-field
                                    v-model="editedCustomer.address"
                                    label="Телефон"
                                ></v-text-field>
                            </v-flex>

                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="dialog = false">Отмена</v-btn>
                    <v-btn color="green darken-1" flat @click="">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script>
    export default {
        name: 'CustomersControl',
        data: () => ({
            date: '',
            menu: false,
            dialog: false,
            mode: null,
            editedCustomer: null,
            defaultCustomer: {
                first_name: '',
                last_name: '',
                patronymic: '',
                address: '',
                birth_date: '',
                phone: ''
            }
        }),
        computed: {
            customers () {
                return this.$state.customers
            }
        },
        methods:{
            datePicked (date) {
                this.editedCustomer.birth_date = new Date(date).toISOString().split('T')[0]
                this.menu = false
            },
            showAddDialog () {
                this.mode = 'add'
                this.dialog = true
            }
        },
        created () {
            this.editedCustomer = JSON.parse(JSON.stringify(this.defaultCustomer))
        }
    }
</script>
