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
                <td align="center">{{ props.item.expenses }}</td>
                <td align="center">{{ props.item.finish }}</td>
            </template>
        </v-data-table>
    </v-flex>
</template>
<script>
    export default {
        name: 'DayBalance',
        data: () => ({
            headers: [
                {text: 'На начало дня', value: null, sortable: false, align: 'center'},
                {text: 'Расходы', value: null, sortable: false, align: 'center'},
                {text: 'На конец дня', value: null, sortable: false, align: 'center'},
            ]
        }),
        computed: {
            expenses () {
                return this.$store.state.expenses
            },
            currentBalance () {
                const calculate = (a, b) => a + b.income - b.expense
                return this.$store.state.deals.reduce(calculate, 0)
            },
            items () {
                const add = (a, b)=> a + b.amount
                return [
                    {
                        start: this.$store.state.startBalance,
                        expenses: this.expenses.reduce(add, 0),
                        finish: this.$store.state.startBalance + this.currentBalance
                    }
                    ]
            }
        }
    }
</script>
