<template>
    <v-flex align-center row>
        <v-tabs fixed-tabs
                @change="loadContent"
        >
            <v-tab
                v-for="(item, index) in tabs"
                :key="index"
            >
                {{ item }}
            </v-tab>
            <v-tabs-items touchless>
                <v-tab-item
                    v-for="(item, index) in tabs"
                    :key="index"
                >
                    <daily-accounting v-if="index === 0"></daily-accounting>
                    <customer-panel v-if="index === 1"></customer-panel>
                    <stock-panel v-if="index === 2"></stock-panel>
                    <salary-panel v-if="index === 3"></salary-panel>
                    <admin-panel v-if="index === 4"></admin-panel>
                </v-tab-item>
            </v-tabs-items>

        </v-tabs>
    </v-flex>
</template>
<script>
    import AdminPanel from './admin/AdminPanel'
    import StockPanel from './stock/StockPanel'
    import CustomerPanel from './customers/CustomerPanel'
    import DailyAccounting from './daily/DailyAccounting'
    import SalaryPanel from './salary/SalaryPanel'

    export default {
        name: 'HomeView',
        data: () => ({
            regularTabs: ['Учет на день', 'База клиентов', 'Склад'],
            adminTabs: ['Учет на день', 'База клиентов', 'Склад', 'Зарплата', 'Администрирование']
        }),
        computed: {
            scanMode () {
                return this.$store.state.scanMode
            },
            tabs () {
                return this.isSuperadmin ? this.adminTabs : this.regularTabs
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            user () {
                return this.$store.state.authUser || null
            }
        },
        methods: {
            loadContent (index) {
                this.$store.commit('SET_SCAN_MODE', {
                    workdays: false,
                    accesses: false,
                    deals: false,
                    expenses: false
                })
                switch (index) {
                    case 0: this.$store.commit('SET_SCAN_MODE', {...this.scanMode, workdays: true, expenses: true, deals: true})
                        this.$store.dispatch('setCurrentPage', 'daily')
                        break
                    case 1: this.$store.dispatch('setCustomers')
                        this.$store.dispatch('setCurrentPage', 'customers')
                        break
                    case 2: this.$store.dispatch('setCurrentPage', 'stock')
                        break
                    case 3: this.$store.dispatch('setCurrentPage', 'salary')
                        break
                    case 4: this.$store.dispatch('setCurrentPage', 'admin')
                        break
                }
            }
        },
        components: {
            AdminPanel,
            StockPanel,
            CustomerPanel,
            DailyAccounting,
            SalaryPanel
        }
    }
</script>
