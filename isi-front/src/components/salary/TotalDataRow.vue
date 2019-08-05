<template>
    <tr>
        <td
            style="border: 1px solid black; padding: 0"
        >
            <table>
                <table>
                    <tr>
                        <td
                        >
                            Итого наличным:
                        </td>
                        <td
                        >
                            {{ totalIncome(true) }}
                        </td>
                    </tr>
                    <tr>
                        <td
                        >
                            Итого безналичным:
                        </td>
                        <td
                        >
                            {{ totalIncome(false) }}
                        </td>
                    </tr>
                </table>

            </table>
        </td>
        <td
            v-for="(date, index) in dates"
            :key="index"
            width="10em"
            style="border: 1px solid black!important; padding: 0"
            :title="`ИТОГО за ${hDate(date)}`"
            :class="{'red lighten-4': isHoliday(date)}"
        >
            <table>
                <tr>
                    <td
                        class="cond-tr"
                    >
                        {{ dateIncome({date: date, isCache: true})}}
                    </td>
                </tr>
                <tr>
                    <td
                        class="cond-tr"
                    >
                        {{ dateIncome({date: date, isCache: false})}}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</template>
<script>
    export default {
        name: 'TotalDataRow',
        props: ['dates'],
        computed: {
            deals () {
                return this.$store.state.salary.monthData.allDeals
            },
            basePath () {
                return this.$store.state.basePath
            }
        },
        methods: {
            dateIncome ({date, isCache}) {
                let deals = this.deals.filter(item => item.created_at.split(' ')[0] === date && item.is_cache === isCache)
                const add = (a, b) => a + +b.income
                return deals.reduce(add, 0)
            },
            hDate (textDate) {
                let date = new Date(textDate)
                let options = {month: 'short', day: 'numeric', year: 'numeric'}
                return date.toLocaleDateString('ru-RU', options)
            },
            totalIncome (isCache) {
                let deals = this.deals.filter(item => item.is_cache === isCache)
                const add = (a, b) => a + +b.income
                return deals.reduce(add, 0)
            },
            isHoliday (textDate) {
                let date = new Date(textDate)
                return [0, 1].includes(date.getDay())
            }
        }
    }
</script>
<style>
    .cond-tr {
        padding: 0 2px!important;
    }
</style>

