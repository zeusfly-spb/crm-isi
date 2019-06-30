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

    export default {
        name: 'HomeView',
        data: () => ({
            regularTabs: ['Учет на день', 'База клиентов', 'Склад'],
            adminTabs: ['Учет на день', 'База клиентов', 'Склад', 'Зарплата', 'Администрирование']
        }),
        computed: {
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
                this.$store.commit('SET_SCAN_MODE', {workdays: false, accesses: false})
                switch (index) {
                    case 0: this.$store.commit('SET_SCAN_MODE', {workdays: true, accesses: false})
                        break
                    case 1: this.$store.dispatch('setCustomers')
                        break
                    case 2: this.$store.dispatch('setInsoles')
                        break
                }
            }
        },
        mounted () {
            console.log('Я дома ))')
        },
        components: {
            AdminPanel,
            StockPanel,
            CustomerPanel,
            DailyAccounting
        }
    }
</script>
