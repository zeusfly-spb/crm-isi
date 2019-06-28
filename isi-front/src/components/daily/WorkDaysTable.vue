<template>
    <v-flex xs 12 md6 offset-md3 justify-center class="mt-2">
            <v-data-table
                :headers="headers"
                :items="workdays"
                hide-actions
            >
                <template v-slot:items="props">
                    <tr :class="{'working': props.item.working && isToday}"
                        style="background: #EF9A9A"
                    >
                        <td>
                            {{ props.item.user.full_name }}
                        </td>
                        <td>
                            <v-text-field v-if="props.item.user.id === authUser.id || isSuperAdmin"
                                          maxlength="2"
                                          style="width: 2em"
                                          v-model="props.item.working_hours"
                            ></v-text-field>
                            <span v-else>{{ props.item.working_hours }}</span>
                        </td>
                        <td>{{ hideSeconds(props.item.time_start) }}</td>
                        <td>{{ props.item.time_finish}}</td>
                        <td>{{ props.item.dinner_start }} - {{ props.item.dinner_finish }}</td>
                        <td>
                            <v-btn flat icon color="green"
                                   v-if="isSuperAdmin || props.item.user.id === authUser.id"
                            >
                                <v-icon>save</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>
                <template v-slot:no-data>
                    <span class="red--text">Нет записей</span>
                </template>
            </v-data-table>
            <div class="text-xs-center"
                 v-if="isToday && !isSuperAdmin"
            >
                <v-btn flat color="primary darken-1"
                       @click="startDay"
                       v-if="!isWorking"
                >
                    Начать рабочий день
                </v-btn>
                <v-btn flat color="primary darken-1"
                       @click=""
                       v-if="isWorking"
                       :disabled="!canCloseDay"
                >
                    Закончить рабочий день
                </v-btn>
            </div>
    </v-flex>

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
            canCloseDay () {
                return this.isWorking && !!this.currentWorkDay && !!this.currentWorkDay.working_hours
            },
            currentWorkDay () {
                return this.$store.getters.currentWorkDay
            },
            authUser () {
                return this.$store.state.authUser
            },
            isSuperAdmin () {
                return this.$store.getters.isSuperadmin
            },
            isToday () {
                return this.$store.state.accountingDate === new Date().toISOString().split('T')[0]
            },
            isWorking () {
                return this.$store.getters.isWorking
            },
            workdays () {
                const addWorkState = (workday) => {
                    workday.working = !!workday.time_start && !workday.time_finish
                    return workday
                }
                return this.$store.state.workdays.map(item => addWorkState(item))
            }
        },
        methods: {
            hideSeconds (time) {
                let params = time.split(':')
                return `${params[0]}:${params[1]}`
            },
            startDay () {
                this.$store.dispatch('startUserDay')
            }
        }
    }
</script>
<style>
    .working {
        border-bottom: 2pt solid #fafafa!important;
    }
</style>
