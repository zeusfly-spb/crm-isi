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
    <v-layout wrap>
        <v-flex xs12 sm8 md6 justify-center>
            <span class="title">Стельки</span>
            <v-data-table
                hide-actions
                :items="normalInsolesSizeIds"
                class="elevation-1"
            >
                <template slot="headers" slot-scope="row">
                    <tr
                    >
                        <td
                            rowspan="2"
                            align="center"
                        >
                            <strong>Стельки</strong>
                        </td>
                        <td
                            colspan="3"
                            align="center"
                            style="border-bottom: 0"

                        >
                            <strong>Начало дня</strong>
                        </td>
                        <td
                            colspan="3"
                            align="center"

                        >
                            <strong>Приход</strong>
                        </td>
                        <td
                            colspan="3"
                            align="center"

                        >
                            <strong>Расход</strong>
                        </td>
                        <td
                            colspan="3"
                            align="center"
                        >
                            <strong>Конец дня</strong>
                        </td>
                    </tr>
                    <tr
                        style="height: 1em"
                    >
                        <td align="center"
                            style="border-right: 0"
                        >
                            <span class="mat">Кожа</span>
                        </td>
                        <td align="center"
                            style="border-right: 0; border-left: 0;"
                        >
                            <span class="mat">Колоф</span>
                        </td>
                        <td align="center"
                            style="border-left: 0"
                        >
                            <span class="mat">Флис</span>
                        </td>
                        <td align="center"
                            style="border-right: 0"
                        >
                            <span class="mat">Кожа</span>
                        </td>
                        <td align="center"
                            style="border-right: 0; border-left: 0;"
                        >
                            <span class="mat">Колоф</span>
                        </td>
                        <td align="center"
                            style="border-left: 0"
                        >
                            <span class="mat">Флис</span>
                        </td>
                        <td align="center"
                            style="border-right: 0"
                        >
                            <span class="mat">Кожа</span>
                        </td>
                        <td align="center"
                            style="border-right: 0; border-left: 0;"
                        >
                            <span class="mat">Колоф</span>
                        </td>
                        <td align="center"
                            style="border-left: 0"
                        >
                            <span class="mat">Флис</span>
                        </td>
                        <td align="center"
                            style="border-right: 0"
                        >
                            <span class="mat">Кожа</span>
                        </td>
                        <td align="center"
                            style="border-right: 0; border-left: 0;"
                        >
                            <span class="mat">Колоф</span>
                        </td>
                        <td align="center"
                            style="border-left: 0"
                        >
                            <span class="mat">Флис</span>
                        </td>
                    </tr>
                </template>
                <template v-slot:items="props">
                    <tr>
                        <td
                            align="center"
                        >
                            Размер <strong>{{ normalInsolesReserves.find(item => item.size_id === props.item).size.name }}</strong>
                        </td>
                        <td align="center" style="border-right: 0">
                            {{ normalInsolesReserves.find(item => item.size_id === props.item && item.type.name === 'Кожа').count }}
                        </td>
                        <td align="center" style="border-left: 0; border-right: 0">
                            {{ normalInsolesReserves.find(item => item.size_id === props.item && item.type.name === 'Колоф').count }}
                        </td>
                        <td align="center" style="border-left: 0">
                            {{ normalInsolesReserves.find(item => item.size_id === props.item && item.type.name === 'Флис').count }}
                        </td>
                        <td align="center" style="border-right: 0">
                            {{ findActionCount('receipt', 'Стельки', 'Кожа', props.item) }}
                        </td>
                        <td align="center" style="border-left: 0; border-right: 0">
                            {{ findActionCount('receipt', 'Стельки', 'Колоф', props.item) }}
                        </td>
                        <td align="center" style="border-left: 0">
                            {{ findActionCount('receipt', 'Стельки', 'Флис', props.item) }}
                        </td>
                        <td align="center" style="border-right: 0">
                            {{ findActionCount('expense', 'Стельки', 'Кожа', props.item) }}
                        </td>
                        <td align="center" style="border-left: 0; border-right: 0">
                            {{ findActionCount('expense', 'Стельки', 'Колоф', props.item) }}
                        </td>
                        <td align="center" style="border-left: 0">
                            {{ findActionCount('expense', 'Стельки', 'Флис', props.item) }}
                        </td>
                        <td align="center" style="border-right: 0">
                            {{ currentCount('Стельки', 'Кожа', props.item) }}
                        </td>
                        <td align="center" style="border-left: 0; border-right: 0">
                            {{ currentCount('Стельки', 'Колоф', props.item) }}
                        </td>
                        <td align="center" style="border-left: 0">
                            {{ currentCount('Стельки', 'Флис', props.item) }}
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-flex>
        <v-flex xs12 sm8 md6 justify-center>
            <span class="title">Полустельки</span>
            <v-data-table
                hide-actions
                :items="halfInsolesSizeIds"
                class="elevation-1"
            >
                <template slot="headers" slot-scope="row">
                    <tr
                    >
                        <td
                            rowspan="2"
                            align="center"
                        >
                            <strong>Стельки</strong>
                        </td>
                        <td
                            colspan="3"
                            align="center"

                        >
                            <strong>Начало дня</strong>
                        </td>
                        <td
                            colspan="3"
                            align="center"

                        >
                            <strong>Приход</strong>
                        </td>
                        <td
                            colspan="3"
                            align="center"

                        >
                            <strong>Расход</strong>
                        </td>
                        <td
                            colspan="3"
                            align="center"
                        >
                            <strong>Конец дня</strong>
                        </td>
                    </tr>
                    <tr
                        style="height: 1em"
                    >
                        <td align="center"
                            style="border-right: 0"
                        >
                            <span class="mat">Кожа</span>
                        </td>
                        <td align="center"
                            style="border-right: 0; border-left: 0;"
                        >
                            <span class="mat">Колоф</span>
                        </td>
                        <td align="center"
                            style="border-left: 0"
                        >
                            <span class="mat">Флис</span>
                        </td>
                        <td align="center"
                            style="border-right: 0"
                        >
                            <span class="mat">Кожа</span>
                        </td>
                        <td align="center"
                            style="border-right: 0; border-left: 0;"
                        >
                            <span class="mat">Колоф</span>
                        </td>
                        <td align="center"
                            style="border-left: 0"
                        >
                            <span class="mat">Флис</span>
                        </td>
                        <td align="center"
                            style="border-right: 0"
                        >
                            <span class="mat">Кожа</span>
                        </td>
                        <td align="center"
                            style="border-right: 0; border-left: 0;"
                        >
                            <span class="mat">Колоф</span>
                        </td>
                        <td align="center"
                            style="border-left: 0"
                        >
                            <span class="mat">Флис</span>
                        </td>
                        <td align="center"
                            style="border-right: 0"
                        >
                            <span class="mat">Кожа</span>
                        </td>
                        <td align="center"
                            style="border-right: 0; border-left: 0;"
                        >
                            <span class="mat">Колоф</span>
                        </td>
                        <td align="center"
                            style="border-left: 0"
                        >
                            <span class="mat">Флис</span>
                        </td>
                    </tr>
                </template>
                <template v-slot:items="props">
                    <tr style="height: 1em">
                        <td align="center">
                            Размер <strong>{{ halfInsolesReserves.find(item => item.size_id === props.item).size.name }}</strong>
                        </td>
                        <td align="center" style="border-right: 0">
                            {{ halfInsolesReserves.find(item => item.size_id === props.item && item.type.name === 'Кожа').count }}
                        </td>
                        <td align="center" style="border-left: 0; border-right: 0">
                            {{ halfInsolesReserves.find(item => item.size_id === props.item && item.type.name === 'Колоф').count }}
                        </td>
                        <td align="center" style="border-left: 0">
                            {{ halfInsolesReserves.find(item => item.size_id === props.item && item.type.name === 'Флис').count }}
                        </td>
                        <td align="center" style="border-right: 0">
                            {{ findActionCount('receipt', 'Полустельки', 'Кожа', props.item) }}
                        </td>
                        <td align="center" style="border-left: 0; border-right: 0">
                            {{ findActionCount('receipt', 'Полустельки', 'Колоф', props.item) }}
                        </td>
                        <td align="center" style="border-left: 0">
                            {{ findActionCount('receipt', 'Полустельки', 'Флис', props.item) }}
                        </td>
                        <td align="center" style="border-right: 0">
                            {{ findActionCount('expense', 'Полустельки', 'Кожа', props.item) }}
                        </td>
                        <td align="center" style="border-left: 0; border-right: 0">
                            {{ findActionCount('expense', 'Полустельки', 'Колоф', props.item) }}
                        </td>
                        <td align="center" style="border-left: 0">
                            {{ findActionCount('expense', 'Полустельки', 'Флис', props.item) }}
                        </td>
                        <td align="center" style="border-right: 0">
                            {{ currentCount('Полустельки', 'Кожа', props.item) }}
                        </td>
                        <td align="center" style="border-left: 0; border-right: 0">
                            {{ currentCount('Полустельки', 'Колоф', props.item) }}
                        </td>
                        <td align="center" style="border-left: 0">
                            {{ currentCount('Полустельки', 'Флис', props.item) }}
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
    <new-stock-action-dialog/>
    <stock-actions-table/>

    </v-flex>
</template>
<script>
    import NewStockActionDialog from './NewStockActionDialog'
    import StockActionsTable from './StockActionsTable'
    export default {
        name: 'StockPanel',
        data: () => ({
            insolesHeaders: [

            ],
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
                const nameOfType = (type_id) => this.$store.state.stock.options.types && this.$store.state.stock.options.types.find(item => +item.id === +type_id).name
                const add = (a, b) => +a + +b.count
                let currentEntityActions = this.stockActions.filter(item => item.type === action && item.product.name === productName && nameOfType(item.type_id) === typeName && +item.size_id === +sizeId)
                return currentEntityActions.reduce(add, 0) || 0
            },
            setCurrentIslandId (index) {
                this.$store.dispatch('setWorkingIslandId', this.tabs[index].id)
            }
        },
        components: {
            NewStockActionDialog,
            StockActionsTable
        }
    }
</script>
<style scoped>
    table {
        border: solid 1px rgb(200,200,200);
        display: table;
        border-collapse: collapse;
        border-spacing: 2px;
    }
    td {
        border: solid 1px rgb(200,200,200);
        padding-left: .25em!important;
        padding-right: .25em!important;
    }
    .mat {
        color: rgba(0,0,0,0.54);
        font-weight: 500;
        font-size: 12px;
    }
</style>
