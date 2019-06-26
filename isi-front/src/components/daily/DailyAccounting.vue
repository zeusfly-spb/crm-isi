<template>
    <v-flex align-center>
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
                    :class="{'blue lighten-3': tab.id === currentIslandId}"
                    height="65"
                >
                    <v-card-text style="padding: 10px!important;">
                        <v-avatar
                            size="30px"
                            v-for="user in tab.users"
                            :key="user.id"
                            class="ml-1"
                        >
                            <img :src="`${basePath}${user.avatar ? user.avatar : '/img/default.jpg'}`"
                                 alt="Фото"
                                 :title="user.full_name"
                                 class="ml-1 mr-1"
                            />
                        </v-avatar>

                        <v-card-actions class="m-0 p-0" style="padding: 5px!important;"
                                        :class="{'mt-2': !tab.users.length && tab.id !== 0}"
                        >
                            <div class="text-center">{{ tab.name }}</div>
                        </v-card-actions>

                    </v-card-text>

<!--                    <v-card-actions>-->
<!--                    </v-card-actions>-->
                </v-card>
            </v-tab>

        </v-tabs>
    </v-flex>
</template>
<script>
    export default {
        name: 'DailyAccounting',
        data: () => ({
            currentIslandId: 0,
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
