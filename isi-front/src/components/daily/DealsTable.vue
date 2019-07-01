<template>
    <v-flex>
        <v-snackbar
                v-model="snackbar"
                auto-height
                top
                :timeout="3000"
                :color="snackColor"
        >
            <span>{{ snackText }}</span>
        </v-snackbar>

        <v-data-table
                :headers="headers"
                :items="deals"
                hide-actions
                class="elevation-1"
        >
            <template v-slot:items="props">
                <tr>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                </tr>
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет сделок</span>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
                <v-btn color="primary" flat dark class="mb-2" @click="showDialog">Новая сделка</v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">Новая сделка</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm12 md12>
                                <sub>Клиент</sub>
                                <v-autocomplete
                                        label="Начните вводить данные для поиска..."
                                        cache-items
                                        :search-input.sync="search"
                                        v-model="selectedCustomerId"
                                        :items="customers"
                                        item-text="full_name"
                                        item-value="id"
                                        single-line
                                        data-vv-name="customer"
                                        data-vv-as="Клиент"
                                        :error-messages="errors.collect('customer')"
                                        v-validate="'required'"
                                >
                                    <template v-slot:item="data">
                                        <span :class="{'red--text': data.item.id === null, 'green--text': data.item.id === 0}">
                                            {{ data.item.full_name }}
                                        </span>
                                    </template>
                                    <template slot="no-data">
                                        <span class="red--text">Нет совпадений по запросу</span>
                                    </template>
                                </v-autocomplete>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <sub>Услуга</sub>
                                <v-select
                                    v-model="selectedInsoleId"
                                    :items="insoles"
                                    item-text="name"
                                    item-value="id"
                                    single-line

                                ></v-select>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <sub>Сумма</sub>
                                <v-text-field
                                    v-model="newDealIncome"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <sub>Форма оплаты</sub>
                                <v-select
                                    :items="paymentTypes"
                                    v-model="selectedPaymentType"
                                    item-text="text"
                                    item-value="value"
                                    single-line
                                ></v-select>
                            </v-flex>

                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" flat @click="dialog = false">Отмена</v-btn>
                    <v-btn color="green darken-1" flat @click="">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-flex>
</template>
<script>
    export default {
        name: 'DealsTable',
        data: () => ({
            newDealIncome: null,
            selectedPaymentType: true,
            paymentTypes: [
                {value: true, text: 'Наличный'},
                {value: false, text: 'Безналичный'}
            ],
            selectedInsoleId: null,
            search: null,
            loadedCustomers: [],
            snackbar: false,
            snackColor: 'green',
            snackText: '',
            selectedCustomerId: -1,
            dialog: false,
            headers: [
                {text: '#', value: 'id'},
                {text: 'Клиент', value: 'customer_id'},
                {text: 'Услуга', value: 'insole_id'},
                {text: 'Стоимость', value: 'income'},
                {text: 'Расход', value: 'expense'},
                {text: 'Форма оплаты', value: 'is_cache'},
            ]
        }),
        computed: {
            insoles () {
                return this.$store.state.insoles
            },
            isDayOpen () {
                return this.$store.getters.isDayOpen
            },
            customers () {
                const extendByNumbers = (customer) => {
                    let phones = ''
                    if (customer.phones.length) {
                        customer.phones.forEach((item, index) => {
                            phones = phones + `${index === 0 ? '' : ', '}${item.number}`
                        })
                    }
                    customer.full_name += ` телефон${customer.phones.length > 1 ? 'ы' : ''}: ` + phones
                    return customer
                }

                return [
                    ...this.loadedCustomers.map(item => extendByNumbers(item)),
                    {id: null, full_name: 'Аноним'},
                    {id: 0, full_name: 'Новый клиент'},
                ]
            },
            deals () {
                return this.$store.state.deals
            }
        },
        methods: {
            querySelection (text) {
                this.axios.post('/api/search_customer_by_text', {text: text})
                    .then(res => {
                        this.loadedCustomers = res.data
                        console.dir(res.data)
                    })
                    .catch(e => console.error(e))
            },
            showSnack (text, color) {
                this.snackText = text
                this.snackColor = color
                this.snackbar = true
            },
            showDialog () {
                if (!this.isDayOpen) {
                    this.showSnack('Чтобы совершить сделку, начните рабочий день', 'red')
                    return
                }
                this.selectedCustomerId = -1
                this.selectedInsoleId = null
                this.dialog = true
            }
        },
        watch: {
            search (val) {
                val && val !== this.select && this.querySelection(val)
            }
        }
    }
</script>
