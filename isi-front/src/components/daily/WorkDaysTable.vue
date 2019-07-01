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
                    <tr :class="{'working red lighten-4': props.item.working && isToday}"
                        style="border-bottom: solid 1px #fafafa!important;"
                    >
                        <td>
                            {{ props.item.user && props.item.user.full_name}}
                        </td>
                        <td>
                            <v-text-field v-if="(props.item.user.id === authUser.id || isSuperAdmin) && !isDayClosed"
                                        type="text"
                                        maxlength="2"
                                        style="width: 2em"
                                        v-model="props.item.working_hours"
                                        ref="hoursInput"
                                        height="1em"
                                        @keyup.enter="attemptToCloseDay"
                                        @focus="$store.commit('SET_SCAN_MODE', {...$store.state.scanMode, workdays: false})"
                                        @blur="$store.commit('SET_SCAN_MODE', {...$store.state.scanMode, workdays: true})"
                            ></v-text-field>
                            <span v-else>{{ props.item.working_hours }}</span>
                        </td>
                        <td>{{ props.item.time_start }}</td>
                        <td>{{ props.item.time_finish || '' }}</td>
                        <td align="center">
                            <v-layout>
                                <v-text-field
                                        type="text"
                                        maxlength="5"
                                        style="width: 2em"
                                        height="1em"
                                        v-model="props.item.dinner_start"
                                        v-if="(props.item.user.id === authUser.id || isSuperAdmin) && !isDayClosed"
                                        mask="##:##"
                                />
                                <span v-else>{{ props.item.dinner_start }}</span>
                                -
                                <v-text-field
                                        type="text"
                                        maxlength="5"
                                        style="width: 2em"
                                        v-model="props.item.dinner_finish"
                                        v-if="(props.item.user.id === authUser.id || isSuperAdmin) && !isDayClosed"
                                        height="1em"
                                        mask="##:##"
                                />
                                <span v-else>{{ props.item.dinner_finish }}</span>
                            </v-layout>
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
                <v-btn flat :color="canCloseDay ? 'primary darken-1' : 'grey'"
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
                if (!this.canCloseDay) {
                    this.snackText = 'Чтобы закончить рабочий день введите количество отработанных часов'
                    this.snackColor = 'red'
                    this.snackbar = true
                    this.$refs.hoursInput.focus()
                    return
                }
            this.$store.dispatch('finishUserDay', {
                working_hours: this.currentWorkDay.working_hours,
                dinner_start: this.currentWorkDay.dinner_start,
                dinner_finish: this.currentWorkDay.dinner_finish
            })
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
