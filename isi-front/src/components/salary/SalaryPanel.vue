<template>
    <v-flex
        align-center
    >
        <island-switcher/>
        <v-layout v-if="dates && dates.length < 12">
            <v-data-table
                :items="['', ...users]"
                :headers="headers"
                hide-actions
                class="elevation-1"
            >
                <template v-slot:items="props">
                    <component
                        :is="props.index === 0 ? 'total-data-row' : 'user-row'"
                        :user="props.item"
                        :dates="dates"
                    />
                </template>
            </v-data-table>
        </v-layout>

        <div
            v-else
            style="width: 100%; overflow: hidden"
            id="long-list"
            onselect="return false"
            @mousedown="listMouseDown"
            @mouseup="listMouseUp"
            @mouseout="listMouseOut"
            @mousemove="listMouseMove"
        >
            <v-data-table
                :items="['', ...users]"
                :headers="headers"
                hide-actions
                class="elevation-1"
            >
                <template v-slot:items="props">
                    <component
                        :is="props.index === 0 ? 'total-data-row' : 'user-row'"
                        :user="props.item"
                        :dates="dates"
                    />
                </template>
            </v-data-table>

        </div>


    </v-flex>
</template>
<script>
    import TotalDataRow from './TotalDataRow'
    import UserRow from './UserRow'
    import IslandSwitcher from '../IslandSwitcher'

    export default {
        name: 'SalaryPanel',
        data: () => ({
            dragMode: false,
        }),
        computed: {
            currentMonth () {
                return this.$store.state.accountingDate && this.$store.state.accountingDate.split('-').slice(0, 2).join('-') || null
            },
            headers () {
                let dates = this.dates && this.dates.map(item => ({
                    text: this.hDate(item),
                    value: item,
                    sortable: false,
                    align: 'center'
                })) || []
                return [{
                    text: '',
                    value: null,
                    sortable: false,
                    align: 'center',
                    width: '370px'
                }, ... dates]
            },
            dates () {
                let today = new Date(this.$store.state.realDate)
                let tomorrow = today.setDate(today.getDate() + 1)
                return this.monthData && this.monthData.dates.filter(item => new Date(item) < tomorrow)
            },
            users () {
                const setHourRate = (user) => {
                    let hourRates = user.rates && user.rates.filter(item => item.type === 'hours') || []
                    let accurateRate = hourRates.find(item => item.month === this.currentMonth) && hourRates.find(item => item.month === this.currentMonth).value || null
                    if (accurateRate) {
                        user.hour_rate = accurateRate
                    } else {
                        hourRates.sort((a, b) => a.month < b.month ? 1 : a.month > b.month ? -1 : 0)
                        let prevRate = hourRates.find(item => item.month < this.currentMonth) && hourRates.find(item => item.month < this.currentMonth).value || null
                        user.hour_rate = prevRate ? prevRate : 0
                    }
                    return user
                }
                const setSalesRate = (user) => {
                    let salesRates = user.rates && user.rates.filter(item => item.type === 'sales') || []
                    let accurateRate = salesRates.find(item => item.month === this.currentMonth) && salesRates.find(item => item.month === this.currentMonth).value || null
                    if (accurateRate) {
                        user.sales_rate = accurateRate
                    } else {
                        salesRates.sort((a, b) => a.month < b.month ? 1 : a.month > b.month ? -1 : 0)
                        let prevRate = salesRates.find(item => item.month < this.currentMonth) && salesRates.find(item => item.month < this.currentMonth).value || null
                        user.sales_rate = prevRate ? prevRate : 0
                    }
                    return user
                }
                let base =  this.monthData && this.monthData.users || []
                const add = (a, b) => a + +b.income
                base = base.map(item => ({... item, totalIncome: item.monthDeals.reduce(add, 0)}))
                const sortByTotalIncome = (a, b) => {
                    return b.totalIncome - a.totalIncome
                }
                base = base.map(user => setHourRate(user))
                base = base.map(user => setSalesRate(user))
                return base.sort(sortByTotalIncome)
            },
            monthData () {
                return this.$store.state.salary.monthData
            }
        },
        methods: {
            listMouseOut () {
                if (!this.dragMode) {
                    document.body.style.cursor = 'default'
                }
            },
            listMouseMove () {
                if (!this.dragMode) {
                    document.body.style.cursor = 'default'
                }
            },
            listMouseUp () {
                this.dragMode = false
                document.body.style.cursor = 'default'
            },
            listMouseDown (e) {
                this.dragMode = true
                let centerX = document.body.clientWidth / 2
                document.body.style.cursor = e.clientX < centerX ? 'w-resize' : 'e-resize'
            },
            hDate (textDate) {
                let date = new Date(textDate)
                let options = {month: 'short', day: 'numeric'}
                return date.toLocaleDateString('ru-RU', options)
            },
            setCurrentIslandId (index) {
                this.$store.dispatch('setWorkingIslandId', this.tabs[index].id)
            },
            changeCurrentIslandId (id) {
                this.$store.dispatch('setWorkingIslandId', id)
            }
        },
        watch: {
            dates (val) {
                this.bottomPanel = val.length > 10
            }
        },
        components: {
            UserRow,
            TotalDataRow,
            IslandSwitcher
        }
    }
</script>
<style>
    ::selection {
        background: transparent;
    }
    ::-moz-selection {
        background: transparent;
    }
</style>
