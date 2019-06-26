<template>
    <v-flex align-center>
        <v-tabs
            v-if="isSuperadmin"
            fixed-tabs
            centered
            slider-color="green"
            height="120"
            @change="setCurrentIslandId"
            hide-slider
        >
            <v-tab
                v-for="tab in tabs"
                :key="tab.id"
            >
                <v-card
                    :class="{'blue lighten-3': tab.id === currentIslandId}"
                >
                    <v-card-text>
                        <v-avatar
                            size="36px"
                            v-for="user in tab.users"
                            :key="user.id"
                        >
                            <img :src="`${basePath}${user.avatar}`"
                                 alt="Фото"
                                 :title="user.full_name"
                            />
                        </v-avatar>
                    </v-card-text>
                    <v-card-actions>
                        <span class="text-center">{{ tab.name }}</span>
                    </v-card-actions>
                </v-card>
            </v-tab>

        </v-tabs>
    </v-flex>
</template>
<script>
    export default {
        name: 'DailyAccounting',
        data: () => ({
            currentIslandId: 0
        }),
        computed: {
            basePath () {
                return this.$store.state.basePath
            },
            tabs () {
                return [{id: 0, name: 'Все островки', users: [{avatar: '/img/logo.png'}]}, ...this.islands]
            },
            islands () {
                return this.$store.state.islands
            },
            authUser () {
                return this.$store.state.authUser
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            }
        },
        methods: {
            setCurrentIslandId (index) {
                this.currentIslandId = this.tabs[index].id
            }
        }
    }
</script>
