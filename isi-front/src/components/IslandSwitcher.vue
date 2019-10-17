<template>
    <v-tabs
        v-if="isSuperadmin"
        fixed-tabs
        centered
        slider-color="green"
        height="70"
        @change="setCurrentIslandId"
        hide-slider
    >
        <v-tab
            v-for="tab in tabs"
            :key="tab.id"
            @click="changeCurrentIslandId(tab.id)"
        >
            <v-card
                :class="{'blue lighten-3': tab.id === workingIslandId}"
                height="65"
            >
                <v-card-text style="padding: 10px!important;">
                    <v-avatar
                        size="30px"
                        v-for="user in sliceUsers(tab)"
                        :key="user.id"
                        style="margin-right: .1em; margin-left: .1em"
                    >
                        <img :src="`${basePath}${user.avatar ? user.avatar : '/img/default.jpg'}`"
                             alt="Фото"
                             :title="user.full_name"
                             v-if="user.avatar !== 'plus'"
                        />
                        <span
                            v-else
                            :title="hiddenUsers(tab).map(item => item.full_name).join(' ,')"
                        >
                            + {{ hiddenUsers(tab).length }}
                        </span>
                    </v-avatar>

                    <v-card-actions class="m-0 p-0" style="padding: 5px!important;"
                                    :class="{'mt-2': (tab.users && !tab.users.length) && tab.id !== 0}"
                    >
                        <div class="text-center">{{ tab.name }}</div>
                    </v-card-actions>

                </v-card-text>
            </v-card>
        </v-tab>
    </v-tabs>

</template>
<script>
    export default {
        name: 'IslandSwitcher',
        computed: {
            maxAvaCount () {
                return this.$store.state.settings.data.switcherPanel.maxAvaCount
            },
            workingIslandId () {
                return this.$store.state.workingIslandId
            },
            basePath () {
                return this.$store.state.basePath
            },
            tabs () {
                return [{id: 0, name: 'Все островки', users: [{avatar: '/img/logo.png'}]}, ...this.islands]
            },
            islands () {
                return this.$store.state.islands
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            }
        },
        methods: {
            hiddenUsers (tab) {
                let hiddenCount = tab.users.length - this.maxAvaCount
                if (hiddenCount) {
                    return tab.users.slice(this.maxAvaCount, tab.users.length)
                }
                return []
            },
            sliceUsers (tab) {
                if (tab.users.length > this.maxAvaCount) {
                    return [... tab.users.slice(0, this.maxAvaCount), {avatar: 'plus'}]
                }
                return  tab.users
            },
            setCurrentIslandId (index) {
                this.$store.dispatch('setWorkingIslandId', this.tabs[index].id)
            },
            changeCurrentIslandId (id) {
                this.$store.dispatch('setWorkingIslandId', id)
            }
        }
    }
</script>
