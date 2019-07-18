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
                <tr
                    is="deal"
                    :deal="{...props.item, number: props.index + 1}"
                    @snack="showSnack"
                    @delete="deleteConfirm"
                />
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет сделок</span>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="900px"
                  @update:returnValue="newCustomer = false"
        >
            <template v-slot:activator="{ on }">
                <v-btn color="primary" flat dark class="mb-2" @click="showDialog"
                       :disabled="$store.state.workingIslandId === 0 || !isToday"
                >
                    Новая сделка
                </v-btn>
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
<!--                            <v-flex xs12 sm12 md12>-->
<!--                                <sub>Услуга</sub>-->
<!--                                <v-select-->
<!--                                    v-model="selectedInsoleId"-->
<!--                                    :items="insoles"-->
<!--                                    item-text="name"-->
<!--                                    item-value="id"-->
<!--                                    single-line-->
<!--                                    data-vv-name="insole"-->
<!--                                    data-vv-as="Тип и Размер стелек"-->
<!--                                    :error-messages="errors.collect('insole')"-->
<!--                                    v-validate="'required'"-->
<!--                                ></v-select>-->
<!--                            </v-flex>-->
                            <v-flex xs12 sm6 md4>
                                <sub>Наименование</sub>
                                <v-select
                                    v-model="newActionData.product_id"
                                    :items="products"
                                    item-text="name"
                                    item-value="id"
                                    single-line
                                />
                            </v-flex>

                            <v-flex xs12 sm6 md4>
                                <sub>Материал</sub>
                                <v-select
                                    v-model="newActionData.type_id"
                                    :items="types"
                                    item-text="name"
                                    item-value="id"
                                    single-line
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <sub>Размер</sub>
                                <v-select
                                    v-model="newActionData.size_id"
                                    :items="sizes"
                                    item-text="name"
                                    item-value="id"
                                    single-line
                                    data-vv-as="Размер"
                                    data-vv-name="size"
                                    :error-messages="errors.collect('size')"
                                    v-validate="'required'"
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <sub>Сумма</sub>
                                <v-text-field
                                    v-model="newDealIncome"
                                    data-vv-name="price"
                                    data-vv-as="Стоимость"
                                    :error-messages="errors.collect('price')"
                                    v-validate="'required|integer'"
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
                    <v-btn color="green darken-1" flat @click="createDeal">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <new-customer-dialog
            :active="newCustomer"
            @cancel="cancelNewCustomer"
            @added="setNewCustomer"
        />

        <v-dialog v-model="confirm"
                  max-width="600"
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
                        @click="deleteDeal"
                    >
                        Удалить
                    </v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
    </v-flex>
</template>
<script>
    import NewCustomerDialog from './NewCustomerDialog'
    import Deal from './Deal'
    export default {
        name: 'DealsTable',
        data: () => ({
            dealToDelete: null,
            confirm: false,
            confirmText: '',
            newCustomer: false,
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
                {text: '', value: null},
                {text: '#', value: 'number'},
                {text: 'Сотрудник', value: 'id'},
                {text: 'Клиент', value: 'customer_id'},
                {text: 'Услуга', value: 'insole_id'},
                {text: 'Цена', value: 'income'},
                {text: 'Себестоимость', value: 'expense'},
                {text: 'Форма оплаты', value: 'is_cache'},
            ]
        }),
        computed: {
            isToday () {
                return this.$store.state.accountingDate === this.realDate
            },
            realDate () {
                return this.$store.state.realDate
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            basePath () {
                return this.$store.state.basePath
            },
            authUser () {
                return this.$store.state.authUser
            },
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
            deleteDeal () {
                this.$store.dispatch('deleteDeal', this.dealToDelete)
                    .then(() => {
                        this.confirm = false
                        this.showSnack(`Сделка ${this.dealToDelete.insole.name} на ${this.dealToDelete.income}р. удалена`, 'green')
                    })
            },
            deleteConfirm (deal) {
                this.dealToDelete = deal
                this.confirmText = `Удалить запись о сделке ${deal.insole.name} на ${deal.income}р. ?`
                this.confirm = true
            },
            setNewCustomer (customer) {
                this.newCustomer = false
                this.loadedCustomers.push(customer)
                this.selectedCustomerId = customer.id
            },
            cancelNewCustomer () {
                this.selectedCustomerId = -1
                this.newCustomer = false
            },
            createDeal () {
                this.$validator.validate()
                    .then(res => {
                        if (!res) return
                        this.$store.dispatch('addDeal', {
                            user_id: this.authUser.id,
                            island_id: this.$store.state.workingIslandId,
                            insole_id: this.selectedInsoleId,
                            customer_id: this.selectedCustomerId === -1 ? null : this.selectedCustomerId,
                            income: this.newDealIncome,
                            expense: 0,
                            is_cache: this.selectedPaymentType
                        })
                            .then(res => {
                                this.showSnack(`Сделка №${res.data.id} добавлена`, 'green')
                                this.dialog = false
                            })
                            .catch(e => this.showSnack(e.data, 'red'))
                    })
            },
            querySelection (text) {
                this.axios.post('/api/search_customer_by_text', {text: text})
                    .then(res => {
                        this.loadedCustomers = res.data
                    })
                    .catch(e => console.error(e))
            },
            showSnack (text, color) {
                this.snackText = text
                this.snackColor = color
                this.snackbar = true
            },
            showDialog () {
                if (!this.isDayOpen && !this.isSuperadmin) {
                    this.showSnack('Чтобы совершить сделку, начните рабочий день', 'red')
                    return
                }
                this.selectedCustomerId = -1
                this.selectedInsoleId = null
                this.newDealIncome = null
                this.dialog = true
            }
        },
        watch: {
            selectedCustomerId (val) {
                if (val === 0) {
                    this.newCustomer = true
                }
            },
            search (val) {
                val && val !== this.select && this.querySelection(val)
            }
        },
        components: {
            NewCustomerDialog,
            Deal
        }
    }
</script>
