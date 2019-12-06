<template>
    <td
        style="border: 1px solid black; padding: 0"
    >
        <v-card
            style="width: 30em"
            elevation="0"
        >
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
            <v-card-text
                class="p-0"
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
                            <strong>{{ totalHours }}</strong>
                        </td>
                        <td class="info-tab">
                            <strong>{{ totalHourAmount }}</strong>
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
            currentMonth () {
                return this.$store.state.accountingDate && this.$store.state.accountingDate.split('-').slice(0, 2).join('-') || null
            },
            workdays () {
                return this.user && this.user.monthWorkdays || []
            },
            totalHours () {
                const add = (a, b) => a + +b.working_hours
                return this.workdays.reduce(add, 0)
            },
            totalHourAmount () {
                const add = (a, b) => a + +b.working_hours
                let existsIslandIds = [... new Set(this.workdays.map(item => item.island_id))]
                let existsIslands = existsIslandIds.map(id => ({id: id}))
                let withHours = existsIslands.map(island => ({
                    ... island,
                    hours: this.workdays.filter(workday => workday.island_id === island.id).reduce(add, 0)
                }))
                let withAmounts = withHours.map(island => ({
                    ... island,
                    amount: island.hours * this.$store.state.userRate({user: this.user, island_id: island.id, month: this.currentMonth, rate: 'hours'})
                }))
                return withAmounts.reduce((a, b) => a + b.amount, 0)
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

