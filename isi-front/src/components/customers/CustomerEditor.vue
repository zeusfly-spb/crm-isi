<template>
    <v-card class="round-corner">
        <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                        <v-text-field
                            v-model="editedCustomer.last_name"
                            label="Фамилия"
                            data-vv-as="Фамилия"
                            data-vv-name="last_name"
                            :error-messages="errors.collect('last_name')"
                            v-validate="'alpha'"
                        />
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                        <v-text-field
                            v-model="editedCustomer.first_name"
                            label="Имя"
                            data-vv-as="Имя"
                            data-vv-name="first_name"
                            :error-messages="errors.collect('first_name')"
                            v-validate="'required|alpha'"
                        />
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                        <v-text-field
                            v-model="editedCustomer.patronymic"
                            label="Отчество"
                            data-vv-as="Отчество"
                            data-vv-name="patronymic"
                            :error-messages="errors.collect('patronymic')"
                            v-validate="'alpha'"
                        />
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                        <v-text-field
                            v-model="editedCustomer.address"
                            label="Адрес"
                            data-vv-as="Адрес"
                            data-vv-name="address"
                        />
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
                                />
                            </template>
                            <v-date-picker
                                v-model="date"
                                no-title
                                scrollable
                                @change="datePicked"
                            />
                        </v-menu>
                        <sup>Дата рождения</sup>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                        <customer-phones-editor
                            :customer="editedCustomer"
                        />
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                        <v-text-field
                            v-model="editedCustomer.email"
                            label="Электронная почта"
                            data-vv-as="Адрес электронной почты"
                            data-vv-name="email"
                            :error-messages="errors.collect('email')"
                            v-validate="'email'"
                        />
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" flat @click="cancelEdit">Отмена</v-btn>
            <v-btn color="green darken-1"
                   flat
                   @click="saveCustomer"
                   :disabled="!changed"
            >
                Сохранить
            </v-btn>
        </v-card-actions>
    </v-card>

</template>
<script>
    import CustomerPhonesEditor from './CustomerPhonesEditor'
    export default {
        name: 'CustomerEditor',
        props: ['customer'],
        data: () => ({
            menu: false,
            editedCustomer: {},
            date: ''
        }),
        computed: {
            changed () {
                return JSON.stringify(this.customer) !== JSON.stringify(this.editedCustomer)
            }
        },
        methods: {
            saveCustomer () {
                this.$validator.validate()
                    .then(res => {
                        if (!res) return
                        this.$store.dispatch('updateCustomer', this.editedCustomer)
                            .then((res) => {
                                if (res.data.exists) {
                                    this.$emit('snack', 'Клиент с таким номером телефона уже присутствует в базе! Проверьте правильность ввода или повторите поиск.', 'red')
                                    return
                                }
                                this.$emit('close')
                                this.$emit('snack', 'Данные клиента изменены', 'green')
                                this.$emit('change')
                            })
                    })
            },
            cancelEdit () {
                this.$emit('close')
            },
            datePicked (date) {
                this.editedCustomer.birth_date = new Date(date).toISOString().split('T')[0]
                this.menu = false
            }
        },
        mounted () {
            this.editedCustomer = JSON.parse(JSON.stringify(this.customer))
        },
        components: {
            CustomerPhonesEditor
        }
    }
</script>

