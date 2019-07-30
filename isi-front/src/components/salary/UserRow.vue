<template>
    <tr>
        <td
            style="border: 1px solid black; padding: 0"
        >
            <v-card style="width: 270px">
                <v-card-title>
                    <v-avatar
                        size="36px"
                        class="align-center"
                    >
                        <img :src="basePath + user.avatar" alt="Фото" v-if="user.avatar">
                        <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
                    </v-avatar>
                    <div class="pl-2">
                        <strong>{{ user.full_name }}</strong>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-list dense>
                        <v-list-tile>
                            <v-list-tile-content>
                                <strong>Часы:</strong>
                            </v-list-tile-content>
                            <v-list-tile-content class="align-end">
                                <strong>{{ totalHours }}</strong>
                            </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile>
                            <v-list-tile-content>
                                <strong>Сделки:</strong>
                            </v-list-tile-content>
                            <v-list-tile-content class="align-end">
                                <strong>{{ totalDeals }}</strong>
                            </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile>
                            <v-list-tile-content>
                                <strong>Доход:</strong>
                            </v-list-tile-content>
                            <v-list-tile-content class="align-end">
                                <strong>{{ totalIncome }}</strong>
                            </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile>
                            <v-list-tile-content>
                                <strong>Расход:</strong>
                            </v-list-tile-content>
                            <v-list-tile-content class="align-end">
                                <strong>{{ totalExpense }}</strong>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card-text>

            </v-card>
        </td>
        <td v-for="(date, index) in dates" :key="index"
            style="border: 1px solid black; padding: 0"
            width="10em"
            :title="`${user.full_name} за ${hDate(date)}`"
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
            totalExpense () {
                const add = (a, b) => a + +b.expense
                let deals = this.user && this.user.monthDeals
                return deals.reduce(add, 0)
            },
            totalIncome () {
                const add = (a, b) => a + +b.income
                let deals = this.user && this.user.monthDeals
                return deals.reduce(add, 0)
            },
            totalHours () {
                let workdays = this.user && this.user.monthWorkdays
                const add = (a, b) => a + +b.working_hours
                return workdays.reduce(add, 0)
            },
            totalDeals () {
                let deals = this.user && this.user.monthDeals
                return deals.length
            },
            basePath () {
                return this.$store.state.basePath
            },
            dates () {
                return this.user && this.user.dates
            }
        },
        methods: {
            hDate (textDate) {
                let date = new Date(textDate)
                let options = {month: 'short', day: 'numeric', year: 'numeric'}
                return date.toLocaleDateString('ru-RU', options)
            },
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
