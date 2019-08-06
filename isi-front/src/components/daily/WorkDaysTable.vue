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
                class="elevation-1"
            >
                <template v-slot:items="props">
                    <tr :class="{'working red lighten-5': props.item.working && isToday}"
                        style="border-bottom: solid 1px #fafafa!important;"
                    >
                        <td>
                            {{ props.item.user && props.item.user.full_name}}
                        </td>
                        <td>
                            <span>{{ props.item.working_hours }}</span>
                        </td>
                        <td>{{ props.item.time_start }}</td>
                        <td>{{ props.item.time_finish || '' }}</td>
                        <td align="center">
                            <v-flex v-for="timeBreak in props.item.time_breaks"
                                    :key="timeBreak.id"
                                    class="text-xs-center"
                            >
                                <span>{{ timeBreak.start_time }}</span>
                                -
                                <span>{{ timeBreak.finish_time }}</span>
                            </v-flex>
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
                       v-if="!isDayOpen && !isDayClosed"
                >
                    Начать рабочий день
                </v-btn>
                <v-btn flat
                       @click="attemptToCloseDay"
                       v-if="isDayOpen"
                >
                    Закончить рабочий день
                </v-btn>
                <v-btn flat color="primary darken-1"
                       @click="resumeDay"
                       v-if="isDayClosed && isToday"
                >
                    Продолжить рабочий день
                </v-btn>
                <v-btn flat color="green darken-1"
                       @click="startTimeBreak"
                       v-if="!isOnTimeBreak && !isDayClosed && isDayOpen"
                >
                    Начать перерыв
                </v-btn>
                <v-btn flat color="green darken-1"
                       @click="finishTimeBreak"
                       v-if="isOnTimeBreak && !isDayClosed"
                >
                    Закончить перерыв
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
                {text: 'Перерывы', value: null, sortable: false, align: 'center'}
            ]
        }),
        computed: {
            isOnTimeBreak () {
                return this.timeBreaks && this.timeBreaks.length && this.timeBreaks.filter(item => !item.finish_time).length
            },
            timeBreaks () {
                return this.currentWorkDay && this.currentWorkDay.time_breaks
            },
            isDinnerFinished () {
                return !!this.currentWorkDay && this.currentWorkDay.dinner_finish
            },
            isOnDinner () {
                return !!this.currentWorkDay && this.currentWorkDay.dinner_start
            },
            realDate () {
                return this.$store.state.realDate
            },
            isDayClosed () {
                return this.$store.getters.isDayClosed
            },
            canCloseDay () {
                return this.isDayOpen && !!this.currentWorkDay && !!this.currentWorkDay.working_hours
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
                return this.$store.state.accountingDate === this.realDate
            },
            isDayOpen () {
                return this.$store.getters.isDayOpen
            },
            workdays () {
                const addWorkState = (workday) => {
                    workday.working = !!workday.time_start && !workday.time_finish
                    workday.closed = !!workday.time_start && !!workday.time_finish
                    return workday
                }
                return this.$store.state.workdays.map(item => addWorkState(item))
            }
        },
        methods: {
            finishTimeBreak () {
                this.$store.dispatch('finishTimeBreak')
                    .then(() => this.showSnack('Закончили перерыв', 'green'))
            },
            startTimeBreak () {
                this.$store.dispatch('startTimeBreak')
                    .then(() => this.showSnack('Начали перерыв', 'green'))
            },
            resumeDay () {
                this.$store.dispatch('resumeUserDay')
                    .then(() => this.showSnack(`С возвращением, ${this.authUser.first_name} ${this.authUser.patronymic}`, 'green'))
            },
            showSnack (text, color) {
                this.snackColor = color
                this.snackText = text
                this.snackbar = true
            },
            attemptToCloseDay () {
                this.$store.dispatch('finishUserDay')
                    .then(() => this.showSnack(`Спасибо за работу, ${this.authUser.first_name} ${this.authUser.patronymic}`, 'green'))
            },
            startDay () {
                this.$store.dispatch('startUserDay')
                    .then(() => this.showSnack(`Добро пожаловать, ${this.authUser.first_name} ${this.authUser.patronymic}`, 'green'))
            }
        }
    }
</script>
<style>
    .working {
        border-bottom: 2pt solid #fafafa!important;
    }
</style>
