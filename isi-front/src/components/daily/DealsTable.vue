<template>
    <v-flex>
        <v-data-table
                :headers="headers"
                :items="deals"
                hide-actions
                class="elevation-1"
        >
            <template v-slot:items="props">
                <tr>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                </tr>
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет сделок</span>
            </template>
        </v-data-table>

    </v-flex>
</template>
<script>
    export default {
        name: 'DealsTable',
        data: () => ({
            headers: [
                {text: '#', value: 'id'},
                {text: 'Клиент', value: 'customer_id'},
                {text: 'Услуга', value: 'insole_id'},
                {text: 'Стоимость', value: 'income'},
                {text: 'Расход', value: 'expense'},
                {text: 'Форма оплаты', value: 'is_cache'},
            ]
        }),
        computed: {
            deals () {
                return this.$store.state.deals
            }
        }
    }
</script>