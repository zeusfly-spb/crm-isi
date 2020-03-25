<template>
    <v-flex xs12 sm6 md6 justify-center>
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
                <tr>
                    <td
                            align="center"
                    >
                        Размер <strong>{{ normalInsolesReserves.find(item => item.size_id === props.item).size.name }}</strong>
                    </td>
                    <td align="center" style="border-right: 0">
                        <span>{{ reservesCount({sizeId: props.item, typeName: 'Кожа'}) }}</span>
                    </td>
                    <td align="center" style="border-left: 0; border-right: 0">
                        <span>{{ reservesCount({sizeId: props.item, typeName: 'Санаформ'}) }}</span>
                    </td>
                    <td align="center" style="border-left: 0">
                        <span>{{ reservesCount({sizeId: props.item, typeName: 'Флис'}) }}</span>
                    </td>
                    <td align="center" style="border-right: 0">
                        {{ findActionCount('receipt', 'Стельки', 'Кожа', props.item) }}
                    </td>
                    <td align="center" style="border-left: 0; border-right: 0">
                        {{ findActionCount('receipt', 'Стельки', 'Санаформ', props.item) }}
                    </td>
                    <td align="center" style="border-left: 0">
                        {{ findActionCount('receipt', 'Стельки', 'Флис', props.item) }}
                    </td>
                    <td align="center" style="border-right: 0">
                        {{ findActionCount('expense', 'Стельки', 'Кожа', props.item) }}
                    </td>
                    <td align="center" style="border-left: 0; border-right: 0">
                        {{ findActionCount('expense', 'Стельки', 'Санаформ', props.item) }}
                    </td>
                    <td align="center" style="border-left: 0">
                        {{ findActionCount('expense', 'Стельки', 'Флис', props.item) }}
                    </td>
                    <td align="center" style="border-right: 0">
                        {{ currentCount('Стельки', 'Кожа', props.item) }}
                    </td>
                    <td align="center" style="border-left: 0; border-right: 0">
                        {{ currentCount('Стельки', 'Санаформ', props.item) }}
                    </td>
                    <td align="center" style="border-left: 0">
                        {{ currentCount('Стельки', 'Флис', props.item) }}
                    </td>
                </tr>
            </template>
        </v-data-table>
    </v-flex>

</template>
<script>
    export default {
        name: 'InsolesTable',
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
            reserves () {
                return this.$store.state.stock.reserves
            },
            normalInsolesReserves () {
                return this.reserves.filter(item => item.product.name === 'Стельки')
            },
            normalInsolesSizeIds () {
                return [... new Set(this.normalInsolesReserves.map(item => item.size_id))]
            }
        },
        methods: {
            reservesCount ({sizeId, typeName}) {
                if (this.workingIslandId) {
                    let base = this.normalInsolesReserves.find(item => +item.size_id === +sizeId && item.type.name === typeName)
                    return base && base.count || 0
                }
                return this.normalInsolesReserves
                    .filter(item => +item.size_id === +sizeId && item.type.name === typeName)
                    .reduce((a, b) => a + b.count, 0)
            },
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
