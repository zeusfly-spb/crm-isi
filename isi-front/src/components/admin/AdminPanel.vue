<template>
    <v-flex>
        <v-tabs
            slider-color="red"
            @change="loadTabContent"
        >
            <v-tab
                v-for="item in sections"
                :key="item.id"
            >
                {{ item.label }}
            </v-tab>
            <v-tab-item
                v-for="item in sections"
                :key="item.id"
            >
                <users-control v-if="item.id === 1"></users-control>
                <groups-control v-if="item.id === 2"></groups-control>
                <accesses-control v-if="item.id === 4"></accesses-control>
            </v-tab-item>
        </v-tabs>
    </v-flex>

</template>

<script>
    import UsersControl from './UsersControl'
    import GroupsControl from './GroupsControl'
    import AccessesControl from './AccessesControl'

    export default {
        name: 'AdminPanel',
        data: () => ({
            sections: [
                {id: 1, label: 'Сотрудники'},
                {id: 2, label: 'Группы'},
                {id: 3, label: 'Островки'},
                {id: 4, label: 'Доступы'},
            ],
            activeSection: 1
        }),
        computed: {
            users () {
                return this.$store.state.users
            }
        },
        methods: {
            loadTabContent (index) {
                switch (index) {
                    case 0: this.$store.dispatch('setUsers')
                        break
                    case 1: this.$store.dispatch('setGroups')
                        break
                    case 3: this.$store.dispatch('setAccessRequests')
                        break
                }
            }
        },
        components: {
            UsersControl,
            GroupsControl,
            AccessesControl
        }
    }
</script>
