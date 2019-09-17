<template>
    <v-flex>
        <span class="title">Заявки</span>
        <v-data-table
            :headers="headers"
            :items="leads"
            hide-actions
            class="elevation-1"
        >
            <template v-slot:items="props">
                <td>{{ props.index + 1 }}</td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.phone }}</td>
                <td>{{ props.item.site }}</td>
                <td>{{ props.item.comment }}</td>
                <td>{{ props.item.created_at | moment('DD MMMM YYYY г. HH:mm:ss') }}</td>
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет заявок</span>
            </template>
        </v-data-table>
    </v-flex>
</template>
<script>
    export default {
        name: 'LeadsPanel',
        data: () => ({
            headers: [
                {text: '№', value: null},
                {text: 'Имя', value: 'name'},
                {text: 'Телефон', value: 'phine'},
                {text: 'Сайт', value: 'site'},
                {text: 'Комментарий', value: 'comment'},
                {text: 'Дата/Время', value: 'created_at'},
            ]
        }),
        computed: {
            leads () {
                return this.$store.state.loader.leads
            }
        }
    }
</script>
