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
<v-container grid-list-md>
    <v-layout wrap>
        <table
            border="1"
        >
            <caption><strong>Обычные</strong></caption>
            <tbody>
            <tr>
                <td
                    bgcolor="#34fb68"
                    rowspan="2"
                >
                    Стельки
                </td>
                <td
                    colspan="3"
                    bgcolor="#85dbff"
                >
                    Начало дня
                </td>
                <td
                    colspan="3"
                    bgcolor="#ff4026"
                >
                    Приход

                </td>
                <td
                    colspan="3"
                    bgcolor="#fff963"
                >
                    Расход
                </td>
                <td
                    colspan="3"
                    bgcolor="#8cfff8"
                >
                    Конец дня
                </td>

            </tr>
            <tr>
                <td>Обыч.</td>
                <td>Колоф</td>
                <td>Флис</td>
                <td>Обыч.</td>
                <td>Колоф</td>
                <td>Флис</td>
                <td>Обыч.</td>
                <td>Колоф</td>
                <td>Флис</td>
                <td>Обыч.</td>
                <td>Колоф</td>
                <td>Флис</td>
            </tr>
            </tbody>
        </table>
        <v-spacer></v-spacer>
        <table
            border="1"
        >
            <caption><strong>Полустельки</strong></caption>
            <tbody>
            <tr>
                <td
                    bgcolor="#34fb68"
                    rowspan="2"
                >
                    Стельки
                </td>
                <td
                    colspan="3"
                    bgcolor="#85dbff"
                >
                    Начало дня
                </td>
                <td
                    colspan="3"
                    bgcolor="#ff4026"
                >
                    Приход

                </td>
                <td
                    colspan="3"
                    bgcolor="#fff963"
                >
                    Расход
                </td>
                <td
                    colspan="3"
                    bgcolor="#8cfff8"
                >
                    Конец дня
                </td>

            </tr>
            <tr>
                <td>Обыч.</td>
                <td>Колоф</td>
                <td>Флис</td>
                <td>Обыч.</td>
                <td>Колоф</td>
                <td>Флис</td>
                <td>Обыч.</td>
                <td>Колоф</td>
                <td>Флис</td>
                <td>Обыч.</td>
                <td>Колоф</td>
                <td>Флис</td>
            </tr>
            </tbody>
        </table>

    </v-layout>
</v-container>

    </v-flex>
</template>
<script>
    export default {
        name: 'StockPanel',
        data: () => ({
            headers: [
                {text: '#', value: 'id'},
                {text: 'Тип', value: 'type'},
                {text: 'Размер', value: 'size'},
                {text: 'Материал', value: 'material'}
            ]
        }),
        computed: {
            basePath () {
                return this.$store.state.basePath
            },
            workingIslandId () {
                return this.$store.state.workingIslandId
            },
            tabs () {
                return [{id: 0, name: 'Все островки', users: [{avatar: '/img/logo.png'}]}, ...this.islands]
            },
            islands () {
                return this.$store.state.islands
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            insoles () {
                return this.$store.state.insoles
            }
        },
        methods: {
            setCurrentIslandId (index) {
                this.$store.dispatch('setWorkingIslandId', this.tabs[index].id)
            }
        }
    }
</script>
<style scoped>
    table {
        border: solid 1px grey;
        display: table;
        border-collapse: collapse;
        border-spacing: 2px;
        border-color: grey;
    }
    td {
        border: solid 1px grey;
        padding-left: .25em;
        padding-right: .25em;
    }
</style>
