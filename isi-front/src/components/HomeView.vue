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
            <v-tab-item
                v-for="(item, index) in tabs"
                :key="index"
            >
                <admin-panel v-if="index === 4"></admin-panel>
                <stock-panel v-if="index === 2"></stock-panel>
            </v-tab-item>
        </v-tabs>
    </v-flex>
</template>
<script>
    import AdminPanel from './admin/AdminPanel'
    import StockPanel from './stock/StockPanel'
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
                switch (index) {
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
            StockPanel
        }
    }
</script>
