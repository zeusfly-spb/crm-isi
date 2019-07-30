<template>
    <tr>
        <td v-for="(date, index) in dates" :key="index"
            style="border: 1px solid black; padding: 0"
            width="10em"
        >
            <v-list dense>
                <v-list-tile>
                    <v-list-tile-content>Часы:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ getHours(date)}}</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-content>Сделки:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ getDealCount(date)}}</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-content>Доход:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ getDealsIncome(date) }}</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-content>Расход:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ getDealsExpense(date) }}</v-list-tile-content>
                </v-list-tile>
            </v-list>
        </td>
    </tr>
</template>
<script>
    export default {
        name: 'UserRow',
        props: ['user'],
        computed: {
            dates () {
                return this.user && this.user.dates
            }
        },
        methods: {
            getDealsExpense (dateString) {
                let deals = this.user.deals.filter(deal => deal.created_at.split(' ')[0] === dateString)
                return deals.reduce((a, b) => a + +b.expense, 0)
            },
            getDealsIncome (dateString) {
                let deals = this.user.deals.filter(deal => deal.created_at.split(' ')[0] === dateString)
                return deals.reduce((a, b) => a + +b.income, 0)
            },
            getDealCount (dateString) {
                return this.user.deals.filter(deal => deal.created_at.split(' ')[0] === dateString).length
            },
            getHours (dateString) {
                let targetDay = this.user.workdays.find(day => day.date === dateString)
                return targetDay && targetDay.working_hours || 0
            },
        }
    }
</script>
