<template>
    <v-flex align-center row>
        <v-tabs fixed-tabs
                @change="loadContent"
        >
            <v-tab
                v-for="(item, index) in tabs"
                :key="index"
            >
                <v-badge color="red"
                         v-if="index === 3 && waitingLeadsCount"
                >
                    <template v-slot:badge>
                        <span>{{ waitingLeadsCount }}</span>
                    </template>
                    {{ item }}
                </v-badge>
                <span v-else>{{ item }}</span>
            </v-tab>
            <v-tabs-items touchless>
                <v-tab-item
                    v-for="(item, index) in tabs"
                    :key="index"
                >
                    <daily-accounting v-if="index === 0"/>
                    <customer-panel v-if="index === 1"/>
                    <stock-panel v-if="index === 2"/>
                    <lead-panel v-if="index === 3"/>
                    <salary-panel v-if="index === 4"/>
                    <admin-panel v-if="index === 5"/>
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
    import LeadPanel from './leads/LeadPanel'

    export default {
        name: 'HomeView',
        data: () => ({
            regularTabs: ['Учет на день', 'База клиентов', 'Склад', 'Заявки'],
            adminTabs: ['Учет на день', 'База клиентов', 'Склад', 'Заявки', 'Зарплата', 'Администрирование']
        }),
        computed: {
            waitingLeadsCount () {
                return this.$store.getters.waitingLeadsCount
            },
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
                    case 3: this.$store.dispatch('setCurrentPage', 'leads')
                        this.$store.commit('SET_SCAN_MODE', {...this.scanMode, leads: true})
                        break
                    case 4: this.$store.dispatch('setCurrentPage', 'salary')
                        break
                    case 5: this.$store.dispatch('setCurrentPage', 'admin')
                        break
                }
            }
        },
        components: {
            AdminPanel,
            StockPanel,
            CustomerPanel,
            DailyAccounting,
            SalaryPanel,
            LeadPanel
        }
    }
</script>
