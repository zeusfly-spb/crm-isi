<template>
    <v-flex class="mt-2 ml-1">
                <v-avatar
                    class="mb-1 mr-1"
                    size="36px"
                    :title="user.full_name"
                >
                    <img :src="basePath + user.avatar" alt="Фото" v-if="user.avatar">
                    <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
                </v-avatar>
                <strong>{{ user.full_name }}</strong>
                <v-data-table
                    :headers="headers"
                    :items="row"
                    hide-actions
                    class="elevation-1"
                >
                    <template v-slot:items="props">
                        <td v-for="(value, index) in props.item" :key="index"
                            style="border: 1px solid black; padding: 0"
                            width="10em"
                        >
                                 <v-list dense>
                                     <v-list-tile>
                                         <v-list-tile-content>Часы:</v-list-tile-content>
                                         <v-list-tile-content class="align-end">{{ getHours(value.date)}}</v-list-tile-content>
                                     </v-list-tile>
                                     <v-list-tile>
                                         <v-list-tile-content>Сделки:</v-list-tile-content>
                                         <v-list-tile-content class="align-end">{{ getDealCount(value.date)}}</v-list-tile-content>
                                     </v-list-tile>
                                     <v-list-tile>
                                         <v-list-tile-content>Доход:</v-list-tile-content>
                                         <v-list-tile-content class="align-end">{{ getDealsIncome(value.date) }}</v-list-tile-content>
                                     </v-list-tile>
                                     <v-list-tile>
                                         <v-list-tile-content>Расход:</v-list-tile-content>
                                         <v-list-tile-content class="align-end">{{ getDealsExpense(value.date) }}</v-list-tile-content>
                                     </v-list-tile>
                                 </v-list>
                        </td>
                    </template>
                </v-data-table>
    </v-flex>
</template>
<script>
    export default {
        name: 'UserInfo',
        props: ['user'],
        computed: {
            row () {
                let data = this.user && this.user.dates.map(item => ({ date: item, text: this.hDate(item)}))
                return [data]
            },
            headers () {
                return this.user.dates.map(item => ({
                    text: this.hDate(item),
                    value: item,
                    sortable: false,
                    align: 'center'
                }))
            },
            basePath () {
                return this.$store.state.basePath
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
            hDate (textDate) {
                let date = new Date(textDate)
                let options = {month: 'short', day: 'numeric'}
                return date.toLocaleDateString('ru-RU', options)
            }
        }
    }
</script>

