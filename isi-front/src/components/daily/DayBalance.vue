<template>
    <v-flex xs12 md4 offset-md4 justify-center class="md2">
        <v-data-table
            :headers="headers"
            :items="items"
            hide-actions
            class="elevation-1"
        >
            <template v-slot:items="props">
                <td align="center">{{ props.item.start }}</td>
                <td align="center">
                    {{ props.item.expenses }}
                </td>
                <td align="center">{{ props.item.finish }}</td>
                <td align="center" v-if="cashlessPresent"
                    class="teal--text darken-3"
                >
                    {{ cashlessAmount }}
                </td>
                <td align="center"
                    v-if="handoversPresent"
                >
                    <span v-if="$store.state.workingIslandId > 0">
                        {{ currentHandover.amount }}
                    </span>
                    <span v-else>
                        {{ handovers.reduce((a, b) => a + b.amount, 0) }}
                    </span>
                </td>
            </template>
        </v-data-table>
        <p class="text-xs-right">
            <v-btn
                :disabled="!$store.state.workingIslandId"
                flat
                @click="showDialog"
            >
                Сдать кассу
            </v-btn>
        </p>
        <v-dialog
            v-model="dialog"
            max-width="300"
        >
            <v-card>
                <v-card-title class="subheading">
                    Сдать кассу
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field
                                    v-model="amount"
                                    label="Сумма"
                                    data-vv-as="Сумма"
                                    data-vv-name="amount"
                                    :error-messages="errors.collect('amount')"
                                    v-validate="'required|integer'"
                                    autofocus
                                />
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="dialog = false">Отмена</v-btn>
                    <v-btn color="green darken-1" flat @click="saveHandover">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-flex>
</template>
<script>
    import ExpensesTable from './ExpensesTable'
    export default {
        name: 'DayBalance',
        data: () => ({
            amount: null,
            dialog: false,
            baseHeaders: [
                {text: 'На начало дня', value: null, sortable: false, align: 'center'},
                {text: 'Расходы', value: null, sortable: false, align: 'center'},
                {text: 'На конец дня', value: null, sortable: false, align: 'center'},
            ]
        }),
        computed: {
            currentHandover () {
                this.handovers.find(item => item.island_id === this.$store.state.workingIslandId)
            },
            handoversPresent () {
                return this.handovers.length > 0
            },
            handovers () {
                return this.$store.state.handovers
            },
            cashlessAmount () {
                const add = (a, b) => +a + +b.income - +b.expense
                return this.cashlessDeals.reduce(add, 0)
            },
            cashlessPresent () {
                return this.cashlessDeals.length > 0
            },
            cashlessDeals () {
                return this.$store.state.deals.filter(item => !item.is_cache)
            },
            headers () {
                let result = this.baseHeaders
                if (this.cashlessPresent) {
                    result = [...result, {text: 'Безналичные платежи', value: null, sortable: false, align: 'center'}]
                }
                if (this.handoversPresent) {
                    result = [...result, {text: 'Сдано', value: null, sortable: false, align: 'center'}]
                }
                return result
            },
            expenses () {
                return this.$store.state.expenses
            },
            currentBalance () {
                const calculate = (a, b) => b.is_cache ? +a + +b.income - +b.expense : +a
                return this.$store.state.deals.reduce(calculate, 0)
            },
            items () {
                const add = (a, b)=> a + b.amount
                return [
                    {
                        start: this.$store.state.startBalance,
                        expenses: this.expenses.reduce(add, 0),
                        finish: this.$store.state.startBalance + this.currentBalance - this.expenses.reduce(add, 0)
                    }
                    ]
            }
        },
        methods: {
            saveHandover () {
                this.$store.dispatch('addHandOver', this.amount)
                    .then(() => {
                        this.dialog = false
                    })
            },
            showDialog () {
                this.dialog = true
            }
        },
        components: {
            ExpensesTable
        }
    }
</script>
