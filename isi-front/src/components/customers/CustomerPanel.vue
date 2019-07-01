<template>
    <v-flex align-center>
        <v-snackbar
            v-model="snackbar"
            auto-height
            top
            :timeout="3000"
            :color="snackColor"
        >
            <span>{{ snackText }}</span>
        </v-snackbar>

        <v-layout>
            <span class="title ml-2">Клиенты</span>
        </v-layout>
        <v-data-table
                :headers="headers"
                :items="customers"
                hide-actions
                class="elevation-1"
        >
            <template v-slot:items="props">
                <td>{{ props.item. id }}</td>
                <td>{{ props.item.last_name }}</td>
                <td>{{ props.item.first_name }}</td>
                <td>{{ props.item.patronymic }}</td>
                <td>{{ props.item.birth_date | moment('DD MMMM YYYY г.') }}</td>
                <td>{{ props.item.address }}</td>
                <td>
                    <customer-phones-column :phones="props.item.phones"/>
                </td>
                <td class="justify-center layout px-0">
                    <v-icon
                            small
                            class="mr-2 green--text"
                            @click="showEditDialog(props.item)"
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
                <span class="red--text">Нет клиентов</span>
            </template>
        </v-data-table>
        <v-dialog persistent
            v-model="dialog"
            max-width="600px"
            @update:returnValue="closeDialog"
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
                                    v-if="mode === 'add'"
                                    v-model="editedCustomer.phone"
                                    label="Телефон"
                                    data-vv-as="Номер телефона"
                                    data-vv-name="phone"
                                    :error-messages="errors.collect('phone')"
                                    v-validate="mode === 'add' ? 'required|digits:10' : null"
                                    mask="(###) ### - ####"
                                ></v-text-field>
                                <customer-phones-editor
                                    v-if="mode === 'edit'"
                                    :customer="editedCustomer"
                                    @addOn="addPhoneEnabled = true"
                                    @addOff="addPhoneEnabled = false"
                                ></customer-phones-editor>
                            </v-flex>

                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="dialog = false">Закрыть</v-btn>
                    <v-btn color="green darken-1" flat @click="submitForm" :disabled="addPhoneEnabled">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="confirm"
                  max-width="500"
        >
            <v-card>
                <v-card-title class="subheading">
                    {{ confirmText }}
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        flat="flat"
                        @click="confirm = false"
                    >
                        Отмена
                    </v-btn>
                    <v-btn
                        color="red darken-1"
                        flat="flat"
                        @click="deleteCustomer"
                    >
                        Удалить
                    </v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>

    </v-flex>
</template>
<script>
    import CustomerPhonesColumn from './CustomerPhonesColumn'
    import CustomerPhonesEditor from './CustomerPhonesEditor'

    export default {
        name: 'CustomersControl',
        data: () => ({
            snackbar: false,
            snackText: '',
            snackColor: '',
            customerToDelete: null,
            confirmText: '',
            confirm: false,
            addPhoneEnabled: false,
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
            },
            headers: [
                {text: '#', value: 'id'},
                {text: 'Фамилия', value: 'last_name'},
                {text: 'Имя', value: 'first_name'},
                {text: 'Отчество', value: 'patronymic'},
                {text: 'Дата рождения', value: 'birth_date'},
                {text: 'Адрес', value: 'address'},
                {text: 'Телефоны', value: null},
                {text: 'Действия', value: null, align: 'center'}
            ]
        }),
        computed: {
            customers () {
                return this.$store.state.customers
            }
        },
        methods:{
            showSnack (text, color) {
                this.snackText = text
                this.snackColor = color
                this.snackbar = true
            },
            deleteCustomer () {
                this.$store.dispatch('deleteCustomer', this.customerToDelete.id)
                    .then(() => {
                        this.confirm = false
                        this.showSnack(`Клиент ${this.customerToDelete.full_name} удален`, 'green')
                    })
            },
            showDeleteConfirm (customer) {
                this.confirmText = `Удалить данные о клиенте ${customer.full_name}?`
                this.customerToDelete = customer
                this.confirm = true
            },
            closeDialog () {
                this.mode = null
            },
            showEditDialog (customer) {
                this.mode = 'edit'
                this.editedCustomer = JSON.parse(JSON.stringify(customer))
                this.dialog = true
            },
            submitForm () {
                this.$validator.validate()
                    .then(res => {
                        if (!res) return
                        let action = this.mode === 'add' ? 'addCustomer' : 'updateCustomer'
                        this.$store.dispatch(action, this.editedCustomer)
                            .then((res) => {
                                this.dialog = false
                                this.showSnack(`${this.mode === 'add' ? 'Добавлен новый клиент' : 'Данные клиента изменены'}`, 'green')
                            })
                    })
            },
            datePicked (date) {
                this.editedCustomer.birth_date = new Date(date).toISOString().split('T')[0]
                this.menu = false
            },
            showAddDialog () {
                this.mode = 'add'
                this.editedCustomer = JSON.parse(JSON.stringify(this.defaultCustomer))
                this.dialog = true
            }
        },
        created () {
            this.editedCustomer = JSON.parse(JSON.stringify(this.defaultCustomer))
        },
        components: {
            CustomerPhonesColumn,
            CustomerPhonesEditor
        }
    }
</script>
