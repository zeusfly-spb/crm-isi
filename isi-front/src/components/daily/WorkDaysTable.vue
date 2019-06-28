<template>
    <v-flex xs 12 md6 offset-md3 justify-center class="mt-2">
        <v-snackbar
                v-model="snackbar"
                auto-height
                top
                :timeout="3000"
                :color="snackColor"
        >
            <span>{{ snackText }}</span>
        </v-snackbar>

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
                            <input v-if="props.item.user.id === authUser.id || isSuperAdmin"
                                        type="text"
                                        maxlength="2"
                                        style="width: 2em; border: 1px solid dimgrey"
                                        v-model="props.item.working_hours"
                                        ref="hoursInput"
                                        @keyup.enter="attemptToCloseDay"
                            />
                            <span v-else>{{ props.item.working_hours }}</span>
                        </td>
                        <td>{{ hideSeconds(props.item.time_start) }}</td>
                        <td>{{ props.item.time_finish}}</td>
                        <td align="center">
                                <input
                                        type="text"
                                        maxlength="4"
                                        style="width: 4em; border: 1px solid dimgrey"
                                        v-model="props.item.dinner_start"
                                        v-if="props.item.user.id === authUser.id"
                                />
                                <span v-else>{{ props.item.dinner_start }}</span>

                            -
                                <input
                                        type="text"
                                        max-length="4"
                                        style="width: 4em; border: 1px solid dimgrey"
                                        v-model="props.item.dinner_finish"
                                        v-if="props.item.user.id === authUser.id"
                                />
                                <span v-else>{{ props.item.dinner_finish }}</span>
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
                <v-btn flat :color="canCloseDay ? 'primary darken-1' : 'grey'"
                       @click="attemptToCloseDay"
                       v-if="isWorking"
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
            snackbar: false,
            snackColor: 'green',
            snackText: '',
            headers: [
                {text: 'Сотрудник', value: 'user.full_name'},
                {text: 'Часы', value: 'working_hours', sortable: false},
                {text: 'Начало', value: 'time_start'},
                {text: 'Окончание', value: 'time_finish'},
                {text: 'Обед', value: null, sortable: false, align: 'center'}
            ]
        }),
        computed: {
            isDayClosed () {
                return this.$store.getters.isDayClosed
            },
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
            attemptToCloseDay () {
                if (!this.canCloseDay) {
                    this.snackText = 'Чтобы закончить рабочий день введите количество отработанных часов'
                    this.snackColor = 'red'
                    this.snackbar = true
                    this.$refs.hoursInput.focus()
                    return
                }

            },
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
