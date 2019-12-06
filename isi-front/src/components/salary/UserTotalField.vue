<template>
    <td
        style="border: 1px solid black; padding: 0"
        align="right"
    >
        <v-card
            style="width: 30em"
            elevation="0"
        >
            <v-card-title
                class="pb-0"
            >
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
            <v-card-text
                class="p-0 pt-0"
            >
                <table>
                    <tr>
                        <td class="info-tab">
                            Наименование
                        </td>
                        <td class="info-tab">
                            Всего
                        </td>
                        <td class="info-tab">
                            Сумма
                        </td>
                    </tr>
                    <tr>
                        <td class="info-tab">
                            Часы
                        </td>
                        <td class="info-tab">
                            <strong>{{ +totalHours.toFixed(2) | pretty }}</strong>
                        </td>
                        <td class="info-tab">
                            <strong>{{ +totalHourAmount.toFixed(2) | pretty }}</strong>
                        </td>
                    </tr>
                    <tr>
                        <td class="info-tab">
                            Оборот
                        </td>
                        <td class="info-tab">
                            <strong >{{ +totalIncome.toFixed(2) | pretty }}</strong>
                        </td>

                        <td class="info-tab">
                            <strong>{{ +totalIncomeAmount.toFixed(2) | pretty }}</strong>
                        </td>
                    </tr>
                    <tr
                        v-if="isChief"
                        class="light-blue lighten-4"
                    >
                        <td class="info-tab">
                            Руководящий оборот
                        </td>
                        <td class="info-tab">
                            <strong >{{ +controlledIslandsIncome.toFixed(2) | pretty }}</strong>
                        </td>
                        <td class="info-tab">
                            <strong>{{ +controlledIslandsAmount.toFixed(2) | pretty }}</strong>
                        </td>
                    </tr>
                </table>
            </v-card-text>

        </v-card>
    </td>
</template>
<script>
    export default {
        name: 'UserTotalField',
        props: ['user'],
        computed: {
            isChief () {
                return this.user && this.user.controlled_islands.length
            },
            currentMonth () {
                return this.$store.state.accountingDate && this.$store.state.accountingDate.split('-').slice(0, 2).join('-') || null
            },
            workdays () {
                return this.user && this.user.monthWorkdays || []
            },
            deals () {
                return this.user && this.user.monthDeals || []
            },
            totalHours () {
                return this.workdays.reduce((a, b) => a + +b.working_hours, 0)
            },
            totalHourAmount () {
                return [... new Set(this.workdays.map(item => item.island_id))]
                    .map(id => ({id: id}))
                    .map(island => ({
                        ... island,
                        hours: this.workdays.filter(workday => workday.island_id === island.id).reduce((a, b) => a + +b.working_hours, 0)
                    }))
                    .map(island => ({
                        ... island,
                        amount: island.hours * this.$store.state.userRate({user: this.user, island_id: island.id, month: this.currentMonth, rate: 'hours'})
                    }))
                    .reduce((a, b) => a + b.amount, 0)
            },
            totalIncome () {
                return this.deals.reduce((a, b) => a + +b.income, 0)
            },
            totalIncomeAmount () {
                return [... new Set(this.deals.map(deal => deal.island_id))]
                    .map(item => ({id: item}))
                    .map(island => ({
                        ... island,
                        totalDeals: this.deals.filter(deal => deal.island_id === island.id).reduce((a, b) => a + +b.income, 0)
                    }))
                    .map(island => ({
                        ... island,
                        dealsAmount: island.totalDeals * this.$store.state.userRate({user: this.user, island_id: island.id, month: this.currentMonth, rate: 'sales'})
                    }))
                    .reduce((a, b) => a + b.dealsAmount, 0)
            },
            controlledIslandIds () {
                return this.user && this.user.controlled_islands.map(item => +item.id) || []
            },
            controlledIslandsIncome () {
                return this.$store.state.salary.monthData.allDeals
                    .filter(deal => this.controlledIslandIds.includes(deal.island_id))
                    .reduce((a, b) => a + +b.income, 0)
            },
            controlledIslandsAmount () {
                return this.controlledIslandIds
                    .map(item => ({id: item}))
                    .map(island => ({... island, deals: this.$store.state.salary.monthData.allDeals.filter(deal => deal.island_id === island.id)}))
                    .map(island => ({... island, dealsIncome: island.deals.reduce((a, b) => a + +b.income, 0)}))
                    .map(island => ({
                        ... island,
                        chiefAmount: island.dealsIncome * this.$store.state.userRate({user: this.user, month: this.currentMonth, island_id: island.id, rate: 'chief'})
                    }))
                    .reduce((a, b) => a + b.chiefAmount, 0)
            },
            basePath () {
                return this.$store.state.basePath
            }
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
        text-align: right!important;
    }
</style>

