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
                            <v-flex xs12 sm6 md4>
                                <sub>Услуга</sub>
                                <v-select
                                    v-model="newDealData.deal_action_id"
                                    :items="actions"
                                    item-text="text"
                                    item-value="id"
                                    single-line
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <sub>Продукция</sub>
                                <v-select
                                    v-model="newDealData.product_id"
                                    :items="newDealActionType === 'sale' ? goods : products"
                                    item-text="name"
                                    item-value="id"
                                    single-line
                                    data-vv-name="product"
                                    data-vv-as="Продукция"
                                    :error-messages="errors.collect('product')"
                                    v-validate="'required'"
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md4
                                    v-show="newDealActionType !== 'sale'"
                            >
                                <sub>Материал</sub>
                                <v-select
                                    v-model="newDealData.type_id"
                                    :items="stockOptions.types"
                                    item-text="name"
                                    item-value="id"
                                    single-line
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md4
                                    v-show="newDealActionType !== 'sale'"
                            >
                                <sub>Размер</sub>
                                <v-select
                                    v-model="newDealData.size_id"
                                    :items="formattedSizes"
                                    item-text="name"
                                    item-value="id"
                                    single-line
                                    data-vv-as="Размер"
                                    data-vv-name="size"
                                    :error-messages="newDealActionType !== 'sale' ? errors.collect('size') : ''"
                                    v-validate="newDealActionType !== 'sale' ? 'required' : ''"
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <sub>Сумма</sub>
                                <v-text-field
                                    :disabled="['prodDefect', 'islandDefect', 'correction', 'alteration'].includes(newDealActionType)"
                                    :readonly="newDealActionType === 'sale'"
                                    v-model="newDealIncome"
                                    data-vv-name="price"
                                    data-vv-as="Сумма"
                                    :error-messages="errors.collect('price')"
                                    v-validate="['produce', 'return'].includes(newDealActionType) ? 'required|integer' : null"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <sub>Форма оплаты</sub>
                                <v-select
                                    :disabled="['prodDefect', 'islandDefect', 'correction', 'alteration'].includes(newDealActionType)"
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
            newDealData: {
                deal_action_id: null,
                product_id: null,
                type_id: null,
                size_id: null
            },
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
                {text: 'Услуга', value: 'action_type'},
                {text: 'Продукция', value: 'insole'},
                {text: 'Приход', value: 'income'},
                {text: 'Расход', value: 'expense'},
                {text: 'Форма оплаты', value: 'is_cache'},
            ]
        }),
        computed: {
            stockActions () {
                return this.$store.state.stock.stockActions
            },
            actions () {
                function sortAction (a, b) {
                    if (a.type === 'produce' && b.type === 'sale') {
                        return -1
                    }
                    if (a.type === 'sale' && b.type === 'produce') {
                        return 1
                    }
                    if (a.type === 'produce' && b.type !== 'sale') {
                        return -1
                    }
                    if (a.type === 'sale' && b.type !== 'sale') {
                        return -1
                    }
                    return a.id - b.id
                }
                return this.stockOptions.deal_actions && this.stockOptions.deal_actions.sort(sortAction)
            },
            goods () {
                const markLack = (goodsArray) => goodsArray.map(item => ({...item, count: this.goodCount(item.id), disabled: this.goodCount(item.id) < 1}))
                let result =  this.stockOptions.products && this.stockOptions.products.filter(item => item.description === 'good') || []
                return markLack(result)
            },
            products () {
                return this.stockOptions.products && this.stockOptions.products.filter(item => item.description === null) || []
            },
            formattedSizes () {
                let currentAction = this.stockOptions.deal_actions &&
                    this.stockOptions.deal_actions.find(item => +item.id === +this.newDealData.deal_action_id) &&
                    this.stockOptions.deal_actions.find(item => +item.id === +this.newDealData.deal_action_id).type || null
                let productName = this.stockOptions.products &&
                    this.stockOptions.products.find(item => +item.id === +this.newDealData.product_id) &&
                    this.stockOptions.products.find(item => +item.id === +this.newDealData.product_id).name || null
                let typeName = this.stockOptions.types &&
                    this.stockOptions.types.find(item => +item.id === +this.newDealData.type_id) &&
                    this.stockOptions.types.find(item => +item.id === +this.newDealData.type_id).name || null
                return currentAction === 'produce' ? this.newDealSizes &&
                    this.newDealSizes.map(item => this.currentCount(productName, typeName, item.id) > 0 ? item : ({...item, disabled: true})) : this.newDealSizes
            },
            currentReserves () {
                return this.$store.getters.currentReserves
            },
            newDealProduct () {
                let products = this.stockOptions.products || []
                return products && products.find(item => +item.id === +this.newDealData.product_id) || null
            },
            newDealActionType () {
                let actions = this.$store.state.stock.options.deal_actions || []
                return actions.find(item => +item.id === +this.newDealData.deal_action_id) &&  actions.find(item => +item.id === +this.newDealData.deal_action_id).type || null
            },
            newDealSizes () {
                let currentProduct = this.stockOptions.products && this.stockOptions.products.find(product => product.id === this.newDealData.product_id) || {name: 'Стельки'}
                return currentProduct.name === 'Стельки' ? this.$store.state.stock.options.sizes :
                    this.$store.state.stock.options.sizes.filter(size => !['29-30', '31-31.5', '32-33', '34-34.5', '46-46.5', '47'].includes(size.name))
            },
            stockOptions () {
                return this.$store.state.stock.options
            },
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
            goodCount (productId) {
                let target = this.currentReserves.find(item => +item.product_id === +productId)
                let initialCount = target && target.count || 0
                let targetActions = this.stockActions.filter(item => +item.product_id === +productId)
                const calculate = (a, b) => b.type === 'receipt' ? a + b.count : a - b.count
                return targetActions.reduce(calculate, initialCount)
            },
            currentCount (productName, typeName, sizeId) {
                let target = this.currentReserves.find(reserve => reserve.size_id === sizeId && reserve.product.name === productName && reserve.type.name === typeName)
                return target && target.count || 0
            },
            setDefaultDealData () {
                this.newDealData.deal_action_id = this.stockOptions.deal_actions[0].id
                this.newDealData.product_id = this.stockOptions.products[0].id
                this.newDealData.type_id = this.stockOptions.types.find(type => type.name === 'Кожа').id
            },
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
                            ...this.newDealData,
                            user_id: this.authUser.id,
                            island_id: this.$store.state.workingIslandId,
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
                this.setDefaultDealData()
                this.selectedCustomerId = -1
                this.selectedInsoleId = null
                this.newDealIncome = null
                this.dialog = true
            }
        },
        watch: {
            newDealActionType (value) {
                if (value === 'sale') {
                    let availableGood = this.goods.filter(item => !item.disabled)[0]
                    this.newDealData.product_id = availableGood && availableGood.id || null
                } else {
                    this.newDealData.product_id = this.products[0].id
                }
            },
            formattedSizes (value) {
                let available = value.filter(item => !item.disabled)
                return this.newDealData.size_id = available.length && available[0].id || null
            },
            selectedCustomerId (val) {
                if (val === 0) {
                    this.newCustomer = true
                }
            },
            search (val) {
                val && val !== this.select && this.querySelection(val)
            },
            newDealProduct (value) {
                if (!value) return
                if (value.description === 'good') {
                    this.newDealIncome = value.price
                } else {
                    this.newDealIncome = null
                }
            }
        },
        components: {
            NewCustomerDialog,
            Deal
        }
    }
</script>
