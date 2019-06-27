<template>
    <v-layout justify-center>
        <v-flex xs12 md6 text-xs-center>
            <span class="blue--text">Рабочее время</span>
            <v-data-table
                :headers="headers"
                :items="workdays"
                hide-actions
                class="elevation-1"
            >
                <template v-slot:items="props">
                    <td>{{ props.item.user.full_name }}</td>
                    <td>{{ props.item.working_hours }}</td>
                    <td>{{ props.item.time_start }}</td>
                    <td>{{ props.item.time_finish}}</td>
                    <td>{{ props.item.dinner_start }}</td>
                    <td>{{ props.item.dinner_finish }}</td>
                    <td>Действия</td>
                </template>
                <template v-slot:no-data>
                    <span class="red--text">Нет записей</span>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>


</template>
<script>
    export default {
        name: 'WorkDaysTable',
        data: () => ({
            headers: [
                {text: 'Сотрудник', value: 'user.full_name'},
                {text: 'Часы', value: 'working_hours', sortable: false},
                {text: 'Начало', value: 'time_start'},
                {text: 'Окончание', value: 'time_finish'},
                {text: 'Обед', value: null, sortable: false},
                {text: 'Действия', value: null, sortable: false}
            ]
        }),
        computed: {
            workdays () {
                return this.$store.state.workdays
            }
        }
    }
</script>
