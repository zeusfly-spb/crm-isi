<template>
    <tr>
        <td
            style="border: 1px solid black; padding: 0"
        >
            <v-card style="width: 350px">
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
                <v-card-text class="p-0">
                    <table>
                        <tr>
                            <td class="info-tab">
                                Наименование
                            </td>
                            <td class="info-tab">
                                Всего
                            </td>
                            <td class="info-tab">
                                Коэф.
                            </td>
                            <td class="info-tab">
                                Итог
                            </td>
                        </tr>
                        <tr>
                            <td class="info-tab">
                                Часы
                            </td>
                            <td class="info-tab">
                                <strong>{{ totalHours.toFixed(2) | pretty }}</strong>
                            </td>
                            <td class="info-tab">
                                <rate-updater v-if="isSuperadmin"
                                              :user="user" mode="hours"
                                              @updated=""
                                />
                                <strong v-else>{{ user.hour_rate }}</strong>
                            </td>
                            <td class="info-tab">
                                <strong>{{ hourRateAmount.toFixed(2) | pretty }}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td class="info-tab">
                                Оборот
                            </td>
                            <td class="info-tab">
                                <strong >{{ totalIncome.toFixed(2) | pretty }}</strong>
                            </td>
                            <td class="info-tab">
                                <rate-updater v-if="isSuperadmin" :user="user" mode="sales" :caption="user.sales_rate"/>
                                <strong v-else>{{ user.sales_rate }}</strong>
                            </td>
                            <td class="info-tab">
                                <strong>{{ salesRateAmount.toFixed(2) | pretty }}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td class="info-tab">
                                Премия
                            </td>
                            <td class="info-tab"></td>
                            <td class="info-tab"></td>
                            <td class="info-tab">
                                <user-prizes :user="user"/>
                            </td>
                        </tr>
                        <tr>
                            <td class="info-tab">
                                Штраф
                            </td>
                            <td class="info-tab"></td>
                            <td class="info-tab"></td>
                            <td class="info-tab">
                                <user-forfeits :user="user"/>
                            </td>
                        </tr>
                        <tr>
                            <td class="info-tab">
                                Больничный
                            </td>
                            <td class="info-tab"></td>
                            <td class="info-tab"></td>
                            <td class="info-tab">
                                <user-sicks :user="user"></user-sicks>
                            </td>
                        </tr>
                        <tr>
                            <td class="info-tab">
                                Аванс
                            </td>
                            <td class="info-tab"></td>
                            <td class="info-tab"></td>
                            <td class="info-tab">
                                <strong>{{ salesRateAmount.toFixed(2) | pretty }}</strong>
                            </td>
                        </tr>

                       <tr>
                            <td class="total-tab"
                                colspan="3"
                            >
                                <strong>ИТОГО</strong>
                            </td>
                            <td class="info-tab">
                                <strong>{{ salesRateAmount.toFixed(2) | pretty }}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td class="total-tab"
                                colspan="3"
                            >
                                <strong>Выдано</strong>
                            </td>
                            <td class="info-tab">
                                <strong>{{ salesRateAmount.toFixed(2) | pretty }}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td class="total-tab"
                                colspan="3"
                            >
                                <strong>Остаток</strong>
                            </td>
                            <td class="info-tab">
                                <strong>{{ salesRateAmount.toFixed(2) | pretty }}</strong>
                            </td>
                        </tr>
                    </table>
                </v-card-text>

            </v-card>
        </td>
        <td v-for="(date, index) in dates" :key="index"
            style="border: 1px solid black; padding: 0"
            width="10em"
            :title="`${user.full_name} за ${hDate(date)}`"
        >
            <v-list dense
                    :class="{'red lighten-5': isHoliday(date)}"
            >
                <v-list-tile>
                    <v-list-tile-content>Часы:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ getHours(date) }}</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-content>Сделки:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ getDealCount(date) }}</v-list-tile-content>
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
    import RateUpdater from './RateUpdater'
    import UserPrizes from './UserPrizes'
    import UserForfeits from './UserForfeits'
    import UserSicks from './UserSicks'
    export default {
        name: 'UserRow',
        props: ['user'],
        computed: {
            salesRateAmount () {
                return this.user.sales_rate * this.totalIncome
            },
            hourRateAmount () {
                return this.user.hour_rate * this.totalHours
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
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
            isHoliday (textDate) {
                let date = new Date(textDate)
                let day = date.getDay()
                return [0, 6].includes(day)
            },
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
        },
        components: {
            RateUpdater,
            UserPrizes,
            UserForfeits,
            UserSicks
        }
    }
</script>
<style scoped>
    .total-tab {
        height: 1em;
        padding: .1em 1em!important;
        text-align: left;
    }
    .info-tab {
        height: 1em;
        padding: .1em 1em!important;
        text-align: right;
    }
</style>
