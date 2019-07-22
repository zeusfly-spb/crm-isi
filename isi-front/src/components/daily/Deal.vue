<template>
    <tr>
        <td>
            <v-icon
                class="red--text delete"
                :title="`Удалить сделку ${deal.insole.name} на ${deal.income}р.`"
                @click="confirmToDelete"
                v-if="canUpdate"
            >
                clear
            </v-icon>
        </td>
        <td>
            {{ deal.number }}
        </td>
        <td>
            <v-avatar
                size="36px"
                :title="isSuperadmin ? `${deal.user.full_name} : чтобы изменить - клик мышкой` : deal.user.full_name"
                @click="isSuperadmin ? switchEditMode('user') : null"
                v-if="!editMode.user"
            >
                <img :src="basePath + deal.user.avatar" alt="Фото" v-if="deal.user.avatar">
                <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
            </v-avatar>
            <v-select
                v-else
                autofocus
                :items="users"
                v-model="deal.user_id"
                height="1em"
                style="width: 25em"
                item-text="full_name"
                item-value="id"
                single-line
                @focus="focused('user')"
                @blur="blur('user')"
                @change="updateDeal('user')"
            />
        </td>
        <td>
            <span
                @click="switchEditMode('customer')"
            >
                <span v-if="!editMode.customer"
                      :title="canUpdate ? 'Чтобы изменить клиента - клик мышкой' : ''"
                >
                    {{ deal.customer.full_name }}
                </span>
                <v-select
                    v-else
                    autofocus
                    :items="customers"
                    v-model="selectedCustomerId"
                    height="1em"
                    style="width: 25em"
                    item-text="full_name"
                    item-value="id"
                    single-line
                    @focus="focused('customer')"
                    @blur="blur('customer')"
                    @change="customerSelected"
                >
                    <template v-slot:item="data">
                        <span :class="{'red--text': data.item.id === null, 'green--text': data.item.id === 0}">
                            {{ data.item.full_name }}
                        </span>
                    </template>
                </v-select>
            </span>
        </td>
        <td>
            {{ deal.action && deal.action.text || '' }}
        </td>
        <td>
            <span
            >
                <span v-if="!editMode.insole"
                      :title="canUpdate ? 'Чтобы изменить цену - клик мышкой' : ''"
                >
                    {{ deal.insole.name }}
                </span>
                <v-select
                    v-else
                    autofocus
                    style="width: 17em"
                    height="1em"
                    v-model="deal.insole_id"
                    :items="insoles"
                    item-text="name"
                    item-value="id"
                    single-line
                    @focus="focused('insole')"
                    @blur="blur('insole')"
                    @change="updateDeal('insole')"
                />
            </span>
        </td>
        <td>
            <span
                @click="switchEditMode('income')"
            >
                <span v-if="!editMode.income"
                      :title="canUpdate ? 'Чтобы изменить цену - клик мышкой' : ''"
                >
                    {{ deal.income }}
                </span>
                <v-text-field
                    autofocus
                    v-else
                    v-model="deal.income"
                    single-line
                    maxlength="7"
                    style="width: 4em"
                    height="1em"
                    @focus="focused"
                    @blur="blur('income')"
                    @keyup.esc="blur('income')"
                    @keyup.enter="updateDeal('income')"
                    id="income"
                />
            </span>
        </td>
        <td>
            <span
                @click="switchEditMode('expense')"
            >
                <span v-if="!editMode.expense"
                      :title="canUpdate ? 'Чтобы изменить себестоимость - клик мышкой' : ''"
                >
                    {{ deal.expense }}
                </span>
                <v-text-field
                    autofocus
                    v-else
                    v-model="deal.expense"
                    single-line
                    maxlength="7"
                    style="width: 4em"
                    height="1em"
                    @focus="focused('expense')"
                    @blur="blur('expense')"
                    @keyup.esc="blur('expense')"
                    @keyup.enter="updateDeal('expense')"
                    id="expense"
                />
            </span>
        </td>
        <td>
            <span
                @click="switchEditMode('is_cache')"
            >
                <span
                    :title="canUpdate ? 'Чтобы изменить форму оплаты - клик мышкой' : ''"
                >
                    <span
                        v-if="!editMode.is_cache"
                    >
                        {{ deal.is_cache ? 'Наличный' : 'Безналичный' }}
                    </span>
                    <v-select
                        style="width: 3em"
                        v-else
                        autofocus
                        height="1em"
                        v-model="deal.is_cache"
                        :items="paymentTypes"
                        item-text="text"
                        item-value="value"
                        single-line
                        @focus="focused('is_cache')"
                        @blur="blur('is_cache')"
                        @change="updateDeal('is_cache')"
                    />
                </span>
            </span>
        </td>
        <new-customer-dialog
            :active="newCustomer"
            @cancel="cancelNewCustomer"
            @added="setNewCustomer"
        />
    </tr>
</template>
<script>
    import NewCustomerDialog from './NewCustomerDialog'
    export default {
        name: 'Deal',
        props: ['deal'],
        data: () => ({
            newCustomer: false,
            selectedCustomerId: null,
            paymentTypes: [
                {value: true, text: 'Наличный'},
                {value: false, text: 'Безналичный'}
            ],
            editMode: {
                income: false,
                expense: false,
                is_cache: false,
                insole: false,
                customer: false,
                user: false
            }
        }),
        computed: {
            users () {
                return this.$store.state.users
            },
            customers () {
                return [
                    {id: null, full_name: 'Аноним'},
                    {id: 0, full_name: 'Новый клиент'},
                    ...this.$store.state.customers
                ]
            },
            insoles () {
                return this.$store.state.insoles
            },
            isToday () {
                return this.$store.state.accountingDate === this.realDate
            },
            realDate () {
                return this.$store.state.realDate
            },
            canUpdate () {
                return !this.isToday ? false : this.isSuperadmin ? true :  this.deal.user_id === this.authUser.id
            },
            basePath () {
                return this.$store.state.basePath
            },
            authUser () {
                return this.$store.state.authUser
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            }
        },
        methods: {
            setNewCustomer (customer) {
                this.newCustomer = false
                this.selectedCustomerId = this.deal.customer_id = customer.id
                this.$store.dispatch('updateDeal', this.deal)
                    .then(() => {
                        this.blur('customer')
                        this.$emit('snack', 'Значение "Клиент" изменено', 'green')
                    })
            },
            cancelNewCustomer () {
                this.newCustomer = false
            },
            customerSelected () {
               switch (this.selectedCustomerId) {
                   case 0:
                       this.newCustomer = true
                       break
                   default:
                       this.deal.customer_id = this.selectedCustomerId
                       this.$store.dispatch('updateDeal', this.deal)
                           .then(() => {
                               this.blur('customer')
                               this.$emit('snack', 'Значение "Клиент" изменено', 'green')
                           })
                       break
               }
            },
            confirmToDelete () {
                this.$emit('delete', this.deal)
            },
            updateDeal (mode) {
                this.$validator.validate()
                    .then(valid => {
                        if (!valid) return
                        this.$store.dispatch('updateDeal', this.deal)
                            .then(() => {
                                this.blur(mode)
                                this.$emit('snack', `Значение "${{
                                    insole: 'Услуга',
                                    income: 'Цена',
                                    expense: 'Себестоимость',
                                    is_cache: 'Форма оплаты',
                                    customer: 'Клиент',
                                    user: 'Сотрудник'
                                }[mode]}" изменено.`, 'green')
                            })
                            .catch(e => console.error(e))
                    })
            },
            blur (mode) {
                this.editMode[mode] = false
                this.$store.commit('SET_SCAN_MODE', {...this.$store.state.scanMode, deals: true})
            },
            focused () {
                this.$store.commit('SET_SCAN_MODE', {...this.$store.state.scanMode, deals: false})
            },
            switchEditMode (mode) {
                if (!this.canUpdate) return
                for(let key in this.editMode) {
                    this.editMode[key] = false
                }
                this.editMode[mode] = true
            }
        },
        created () {
            this.selectedCustomerId = this.deal.customer_id
        },
        components: {
            NewCustomerDialog
        }
    }
</script>
<style scoped>
    .delete {
        cursor: pointer;
        opacity: .6;
    }
    .delete:hover {
        opacity: 1;
    }
</style>
