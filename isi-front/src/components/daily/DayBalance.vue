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
            </template>
        </v-data-table>
    </v-flex>
</template>
<script>
    import ExpensesTable from './ExpensesTable'
    export default {
        name: 'DayBalance',
        data: () => ({
            baseHeaders: [
                {text: 'На начало дня', value: null, sortable: false, align: 'center'},
                {text: 'Расходы', value: null, sortable: false, align: 'center'},
                {text: 'На конец дня', value: null, sortable: false, align: 'center'},
            ]
        }),
        computed: {
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
                return !this.cashlessPresent ? this.baseHeaders : [
                    ... this.baseHeaders,
                    {text: 'Безналичные платежи', value: null, sortable: false, align: 'center'}
                ]
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
        components: {
            ExpensesTable
        }
    }
</script>
