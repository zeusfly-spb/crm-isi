<template>
    <v-flex>
        <v-tabs
            slider-color="red"
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
            </v-tab-item>
        </v-tabs>
    </v-flex>

</template>

<script>
    import UsersControl from './UsersControl'
    import GroupsControl from './GroupsControl'

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
        components: {
            UsersControl,
            GroupsControl
        }
    }
</script>
