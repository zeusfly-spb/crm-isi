<template>
    <v-flex
        align-center
    >
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
            >
                <v-card
                    :class="{'blue lighten-3': tab.id === workingIslandId}"
                    height="65"
                >
                    <v-card-text style="padding: 10px!important;">
                        <v-avatar
                            size="30px"
                            v-for="user in tab.users"
                            :key="user.id"
                            style="margin-right: .1em; margin-left: .1em"
                        >
                            <img :src="`${basePath}${user.avatar ? user.avatar : '/img/default.jpg'}`"
                                 alt="Фото"
                                 :title="user.full_name"
                            />
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
    </v-flex>
</template>
<script>
    export default {
        name: 'SalaryPanel',
        computed: {
            basePath () {
                return this.$store.state.basePath
            },
            workingIslandId () {
                return this.$store.state.workingIslandId
            },
            islands () {
                return this.$store.state.islands
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            tabs () {
                return [{id: 0, name: 'Все островки', users: [{avatar: '/img/logo.png'}]}, ...this.islands]
            }
        },
        methods: {
            setCurrentIslandId (index) {
                this.$store.dispatch('setWorkingIslandId', this.tabs[index].id)
            }
        }
    }
</script>
