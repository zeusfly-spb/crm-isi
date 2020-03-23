<template>
    <v-flex xs12 sm6 md6 justify-center>
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
                        <strong>Полустельки</strong>
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
                        <span class="mat">Санаформ</span>
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
                        <span class="mat">Санаформ</span>
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
                        <span class="mat">Санаформ</span>
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
                        <span class="mat">Санаформ</span>
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
                    <td align="center"
                        style="border-top: 1px solid rgb(200,200,200); border-left: 1px solid rgb(200,200,200);"
                    >
                        Размер <strong>{{ halfInsolesReserves.find(item => item.size_id === props.item).size.name }}</strong>
                    </td>
                    <td align="center" style="border-right: 0">
                            <span v-if="workingIslandId">
                                {{ halfInsolesReserves.find(item => item.size_id === props.item && item.type.name === 'Кожа').count }}
                            </span>
                        <span v-else>
                                {{ halfInsolesReserves.filter(item => item.size_id === props.item && item.type.name === 'Кожа').reduce((a, b) => a + b.count, 0) }}
                            </span>
                    </td>
                    <td align="center" style="border-left: 0; border-right: 0">
                            <span v-if="workingIslandId">
                                {{ halfInsolesReserves.find(item => item.size_id === props.item && item.type.name === 'Санаформ').count }}
                            </span>
                        <span v-else>
                                {{ halfInsolesReserves.filter(item => item.size_id === props.item && item.type.name === 'Санаформ').reduce((a, b) => a + b.count, 0) }}
                            </span>
                    </td>
                    <td align="center" style="border-left: 0">
                            <span v-if="workingIslandId">
                                {{ halfInsolesReserves.find(item => item.size_id === props.item && item.type.name === 'Флис').count }}
                            </span>
                        <span v-else>
                                {{ halfInsolesReserves.filter(item => item.size_id === props.item && item.type.name === 'Флис').reduce((a, b) => a + b.count, 0) }}
                            </span>
                    </td>
                    <td align="center" style="border-right: 0">
                        {{ findActionCount('receipt', 'Полустельки', 'Кожа', props.item) }}
                    </td>
                    <td align="center" style="border-left: 0; border-right: 0">
                        {{ findActionCount('receipt', 'Полустельки', 'Санаформ', props.item) }}
                    </td>
                    <td align="center" style="border-left: 0">
                        {{ findActionCount('receipt', 'Полустельки', 'Флис', props.item) }}
                    </td>
                    <td align="center" style="border-right: 0">
                        {{ findActionCount('expense', 'Полустельки', 'Кожа', props.item) }}
                    </td>
                    <td align="center" style="border-left: 0; border-right: 0">
                        {{ findActionCount('expense', 'Полустельки', 'Санаформ', props.item) }}
                    </td>
                    <td align="center" style="border-left: 0">
                        {{ findActionCount('expense', 'Полустельки', 'Флис', props.item) }}
                    </td>
                    <td align="center" style="border-right: 0">
                        {{ currentCount('Полустельки', 'Кожа', props.item) }}
                    </td>
                    <td align="center" style="border-left: 0; border-right: 0">
                        {{ currentCount('Полустельки', 'Санаформ', props.item) }}
                    </td>
                    <td align="center" style="border-left: 0">
                        {{ currentCount('Полустельки', 'Флис', props.item) }}
                    </td>
                </tr>
            </template>
        </v-data-table>
    </v-flex>

</template>
<script>
    export default {
        name: 'HalfInsolesTable',
        computed: {
            currentReserves () {
                return this.$store.getters.currentReserves
            },
            stockActions () {
                return this.$store.state.stock.stockActions
            },
            workingIslandId () {
                return this.$store.state.workingIslandId
            },
            halfInsolesSizeIds () {
                return [... new Set(this.halfInsolesReserves.map(item => item.size_id))]
            },
            halfInsolesReserves () {
                return this.reserves.filter(item => item.product.name === 'Полустельки' && !['29-30', '30-31.5', '32-33', '34-34.5', '46-46.5', '47'].includes(item.size.name))
            },
            reserves () {
                return this.$store.state.stock.reserves
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
            }
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
    .clickable {
        opacity: .8;
        cursor: pointer;
    }
    .clickable:hover {
        opacity: 1;
    }
</style>