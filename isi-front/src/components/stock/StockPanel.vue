<template>
    <v-flex align-center>
        <span class="title ml-2">Каталог продукции</span>
        <v-data-table
            :headers="headers"
            :items="insoles"
            hide-actions
            class="elevation-1"
        >
            <template v-slot:items="props">
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.type }}</td>
                <td>{{ props.item.size }}</td>
                <td>{{ props.item.material }}</td>
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет продукции</span>
            </template>
        </v-data-table>
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
            insoles () {
                return this.$store.state.insoles
            }
        }
    }
</script>
