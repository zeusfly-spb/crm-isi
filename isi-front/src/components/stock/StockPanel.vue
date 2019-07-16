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
                <td>Кожа</td>
                <td>Колоф</td>
                <td>Флис</td>
                <td>Кожа</td>
                <td>Колоф</td>
                <td>Флис</td>
                <td>Кожа</td>
                <td>Колоф</td>
                <td>Флис</td>
                <td>Кожа</td>
                <td>Колоф</td>
                <td>Флис</td>
            </tr>
            <tr v-for="sizeId in normalInsolesSizeIds">
                <td>
                    Размер <strong>{{ normalInsolesReserves.find(item => item.size_id === sizeId).size.name }}</strong>
                </td>
                <td align="right">
                    {{ normalInsolesReserves.find(item => item.size_id === sizeId && item.type.name === 'Кожа').count }}
                </td>
                <td align="right">
                    {{ normalInsolesReserves.find(item => item.size_id === sizeId && item.type.name === 'Колоф').count }}
                </td>
                <td align="right">
                    {{ normalInsolesReserves.find(item => item.size_id === sizeId && item.type.name === 'Флис').count }}
                </td>
                <td align="right">
                    {{ findActionCount('receipt', 'Стельки', 'Кожа', sizeId) }}
                </td>
                <td align="right">
                    {{ findActionCount('receipt', 'Стельки', 'Колоф', sizeId) }}
                </td>
                <td align="right">
                    {{ findActionCount('receipt', 'Стельки', 'Флис', sizeId) }}
                </td>
                <td align="right">
                    {{ findActionCount('expense', 'Стельки', 'Кожа', sizeId) }}
                </td>
                <td align="right">
                    {{ findActionCount('expense', 'Стельки', 'Колоф', sizeId) }}
                </td>
                <td align="right">
                    {{ findActionCount('expense', 'Стельки', 'Флис', sizeId) }}
                </td>
                <td align="right">
                    {{ currentCount('Стельки', 'Кожа', sizeId) }}
                </td>
                <td align="right">
                    {{ currentCount('Стельки', 'Колоф', sizeId) }}
                </td>
                <td align="right">
                    {{ currentCount('Стельки', 'Флис', sizeId) }}
                </td>
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
                <td>Кожа</td>
                <td>Колоф</td>
                <td>Флис</td>
                <td>Кожа</td>
                <td>Колоф</td>
                <td>Флис</td>
                <td>Кожа</td>
                <td>Колоф</td>
                <td>Флис</td>
                <td>Кожа</td>
                <td>Колоф</td>
                <td>Флис</td>
            </tr>
            <tr v-for="sizeId in halfInsolesSizeIds">
                <td>
                    Размер <strong>{{ halfInsolesReserves.find(item => item.size_id === sizeId).size.name }}</strong>
                </td>
                <td align="right">
                    {{ halfInsolesReserves.find(item => item.size_id === sizeId && item.type.name === 'Кожа').count }}
                </td>
                <td align="right">
                    {{ halfInsolesReserves.find(item => item.size_id === sizeId && item.type.name === 'Колоф').count }}
                </td>
                <td align="right">
                    {{ halfInsolesReserves.find(item => item.size_id === sizeId && item.type.name === 'Флис').count }}
                </td>
                <td align="right">
                    {{ findActionCount('receipt', 'Полустельки', 'Кожа', sizeId) }}
                </td>
                <td align="right">
                    {{ findActionCount('receipt', 'Полустельки', 'Колоф', sizeId) }}
                </td>
                <td align="right">
                    {{ findActionCount('receipt', 'Полустельки', 'Флис', sizeId) }}
                </td>
                <td align="right">
                    {{ findActionCount('expense', 'Полустельки', 'Кожа', sizeId) }}
                </td>
                <td align="right">
                    {{ findActionCount('expense', 'Полустельки', 'Колоф', sizeId) }}
                </td>
                <td align="right">
                    {{ findActionCount('expense', 'Полустельки', 'Флис', sizeId) }}
                </td>
                <td align="right">
                    {{ currentCount('Полустельки', 'Кожа', sizeId) }}
                </td>
                <td align="right">
                    {{ currentCount('Полустельки', 'Колоф', sizeId) }}
                </td>
                <td align="right">
                    {{ currentCount('Полустельки', 'Флис', sizeId) }}
                </td>
            </tr>
            </tbody>
        </table>
    </v-layout>
    <new-stock-action-dialog/>
</v-container>

    </v-flex>
</template>
<script>
    import NewStockActionDialog from './NewStockActionDialog'
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
            currentReserves () {
                return this.$store.getters.currentReserves
            },
            stockActions () {
                return this.$store.state.stock.stockActions
            },
            halfInsolesSizeIds () {
                return [... new Set(this.halfInsolesReserves.map(item => item.size_id))]
            },
            normalInsolesSizeIds () {
                return [... new Set(this.normalInsolesReserves.map(item => item.size_id))]
            },
            halfInsolesReserves () {
                return this.reserves.filter(item => item.product.name === 'Полустельки' && !['29-30', '30-31.5', '32-33', '34-34.5', '46-46.5', '47'].includes(item.size.name))
            },
            normalInsolesReserves () {
                return this.reserves.filter(item => item.product.name === 'Стельки')
            },
            reserves () {
                return this.$store.state.stock.reserves
            },
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
            currentCount (productName, typeName, sizeId) {
                let target = this.currentReserves.find(reserve => reserve.size_id === sizeId && reserve.product.name === productName && reserve.type.name === typeName)
                return target && target.count || 0
            },
            findActionCount (action, productName, typeName, sizeId) {
                let target = this.stockActions.find(item => item.type === action && item.product.name === productName && item.type.name === typeName && item.size_id === sizeId)
                return target && target.count || 0
            },
            setCurrentIslandId (index) {
                this.$store.dispatch('setWorkingIslandId', this.tabs[index].id)
            }
        },
        components: {
            NewStockActionDialog
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
