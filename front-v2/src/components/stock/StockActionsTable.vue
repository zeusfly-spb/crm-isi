<template>
    <v-flex>
        <v-data-table
            :headers="headers"
            :items="actions"
            hide-default-footer
            class="elevation-1"
        >
            <template v-slot:items="props">
                <td>
                    {{ props.index + 1 }}
                </td>
                <td>
                    {{ props.item.type === 'receipt' ? 'Приход' : 'Расход'}}
                </td>
                <td>
                    {{ props.item.product.name }}
                </td>
                <td>
                    {{ !!props.item.product.description ? '' : typeName(props.item.type_id) }}
                </td>
                <td>
                    {{ !!props.item.product.description ? '' : props.item.size.name }}
                </td>
                <td>
                    {{ props.item.count }}
                </td>
                <td>
                    {{ props.item.user.full_name }}
                </td>
                <td>
                    {{ props.item.comment || ' - '}}
                </td>
            </template>

            <template v-slot:no-data>
                <span class="red--text">Нет операций по складу</span>
            </template>
        </v-data-table>
    </v-flex>
</template>
<script>
    export default {
        name: 'StockActionsTable',
        data: () => ({
            headers: [
                {text: '#', value: 'id'},
                {text: 'Операция', value: 'type'},
                {text: 'Продукция', value: 'product.name'},
                {text: 'Материал', value: 'type_id'},
                {text: 'Размер', value: 'size.name'},
                {text: 'Количество', value: 'count'},
                {text: 'Инициатор', value: 'user.full_name'},
                {text: 'Комментарий', value: 'comment'}
            ]
        }),
        computed: {
            types () {
                return this.$store.state.stock.options.types
            },
            actions () {
                return this.$store.state.stock.stockActions
            }
        },
        methods: {
            typeName (typeId) {
                return this.types && this.types.find(item => +item.id === +typeId).name || ''
            }
        }
    }
</script>
