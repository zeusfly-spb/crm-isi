<template>
    <v-flex align-center row>
        <v-tabs fixed-tabs>
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
            </v-tab-item>
        </v-tabs>
    </v-flex>
</template>
<script>
    import AdminPanel from './admin/AdminPanel'
    export default {
        name: 'HomeView',
        data: () => ({
            regularTabs: ['Учет на день', 'База клиентов'],
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

        },
        mounted () {
            console.log('Я дома ))')
        },
        components: {
            AdminPanel
        }
    }
</script>
