<template>
    <v-layout justify-center class="mt-2">
        <v-card xs12 md6 text-xs-center>
            <div class="blue--text text-xs-center">Рабочее время</div>
            <v-data-table
                :headers="headers"
                :items="workdays"
                hide-actions
            >
                <template v-slot:items="props">
                    <td>{{ props.item.user.full_name }}</td>
                    <td>{{ props.item.working_hours }}</td>
                    <td>{{ props.item.time_start }}</td>
                    <td>{{ props.item.time_finish}}</td>
                    <td>{{ props.item.dinner_start }} - {{ props.item.dinner_finish }}</td>
                    <td>Действия</td>
                </template>
                <template v-slot:no-data>
                    <span class="red--text">Нет записей</span>
                </template>
            </v-data-table>
            <div class="text-xs-center">
                <v-btn flat color="primary darken-1"
                       @click="startDay"
                >
                    Начать рабочий день
                </v-btn>
            </div>
        </v-card>
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
        },
        methods: {
            startDay () {
                this.$store.dispatch('startUserDay')
            }
        }
    }
</script>
