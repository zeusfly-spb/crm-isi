<template>
    <v-toolbar
        app
        clipped-left
        :class="{'p-0': isMobile, 'm-0': isMobile}"
    >
        <v-layout
            align-center
            class="p-0 m-0"
            style="padding-left: 0!important; padding-right: 0!important; margin-left: 0!important; margin-right: 0!important;"
        >

            <v-flex
                text-xs-left
            >
                <v-toolbar-title
                    :class="{'headline': !isMobile, 'caption': isMobile}"
                >
                    <v-layout
                        align-center
                    >
                        <v-avatar
                            color="white"
                            style="box-shadow: black"
                            v-if="isAuth"
                            :size="isMobile ? 24 : 48"
                        >
                            <img
                                v-if="isAuth && !authUser.is_superadmin && authUser.avatar"
                                :src="`${basePath}${authUser.avatar}`"
                                :lazy-src="`${basePath}${authUser.avatar}`"
                                alt="Лого"
                                :height="isMobile ? '22px' : '45px'"
                            />
                            <img
                                v-else
                                :src="`${basePath}/img/logo.png`"
                                :lazy-src="`${basePath}/img/logo.png`"
                                alt="Лого"
                                :height="isMobile ? '22px' : '45px'"
                            />
                        </v-avatar>
                        &nbsp;
                        <div>
                            <div v-if="isAuth">
                              <span
                                  :class="{'headline': !isMobile, 'caption': isMobile}"
                              >
                                  Crmkin
                              </span>
                                <div
                                    class="font-weight-bold"
                                    :class="{'caption': isMobile, 'headline': !isMobile}"
                                >
                                    {{ authUser && authUser.full_name }}
                                    <span v-if="access && access.island" class="blue--text">({{ access && access.island && access.island.name }})</span>
                                </div>
                            </div>
                        </div>
                    </v-layout>
                </v-toolbar-title>
            </v-flex>
            <v-flex
                text-xs-center
            >
                <date-selector
                    v-if="isAuth && ($store.getters.isAllowed || $store.state.access === 'allowed')"
                />
                <v-spacer v-else/>
            </v-flex>
            <v-flex
                class="m-0 p-0"
                text-xs-right
            >
<!--                <v-icon-->
<!--                    :title="`${sidePanel ? 'Закрыть' : 'Открыть'} панель записей`"-->
<!--                    style="user-select: none"-->
<!--                    color="grey lighten-1"-->
<!--                    class="clickable mr-2"-->
<!--                    :small="isMobile"-->
<!--                    :large="!isMobile"-->
<!--                    @click=""-->
<!--                >-->
<!--                    event-->
<!--                </v-icon>-->
                <v-icon
                    :title="`${sidePanel ? 'Закрыть' : 'Открыть'} панель настроек отображения`"
                    style="user-select: none"
                    color="grey lighten-1"
                    class="clickable mr-2"
                    :small="isMobile"
                    :large="!isMobile"
                    @click="sidePanel = !sidePanel"
                >
                    settings
                </v-icon>
                <v-icon
                    v-if="isAuth"
                    title="Выход"
                    color="orange darken-2"
                    :small="isMobile"
                    :large="!isMobile"
                    @click="logOut"
                >
                    exit_to_app
                </v-icon>
            </v-flex>
        </v-layout>
    </v-toolbar>
</template>
<script>
    import DateSelector from '../DateSelector'
    export default {
        name: 'AppToolbar',
        computed: {
            sidePanel: {
                get () {
                    return this.$store.state.layout.sidePanel && this.$store.state.layout.sidePanelMode === 'view-options'
                },
                set (val) {
                    this.$store.commit('SET_SIDE_PANEL_STATUS', {
                        status: val,
                        mode: val ? 'view-options' : null
                    })
                }
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            access () {
                return this.$store.state.access
            },
            basePath () {
                return this.$store.state.basePath
            },
            isMobile () {
                return ['xs', 'sm'].includes(this.breakpoint.name)
            },
            breakpoint () {
                return this.$vuetify.breakpoint
            },
            isAuth () {
                return this.$store.getters.isAuth
            },
            authUser () {
                return this.$store.state.authUser
            }
        },
        methods: {
            logOut () {
                this.$store.dispatch('logOut')
                this.$router.push('/login')
            }
        },
        components: {
            DateSelector
        }
    }
</script>
<style scoped>
    .ghost {
        opacity: 0;
    }
    .ghost:hover {
        opacity: 1;
    }
    .v-btn__content {
        margin: 0!important;
        padding: 0!important;
    }
</style>
