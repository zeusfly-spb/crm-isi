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
                        <td
                            :class="{'mini': mini}"
                        >
                            <user-avatar
                                :user="props.item.user"
                                :mini="mini"
                            />
                            {{ props.item.user && props.item.user.full_name}}
                        </td>
                        <td
                            :class="{'mini': mini}"
                        >
                            <v-text-field
                                    type="number"
                                    step="0.01"
                                    max="12"
                                    min="0"
                                    v-if="(isSuperAdmin || props.item.user.id === authUser.id) && !isDayClosed"
                                    v-model="props.item.working_hours"
                                    height="1em"
                                    maxlength="5"
                                    style="width: 4em"
                                    @focus="stopScanWorkdays"
                                    @blur="startScanWorkdays"
                                    ref="hoursInput"
                                    @keyup.enter="updateHours(props.item)"
                            />
                            <span v-else>{{ props.item.working_hours }}</span>
                        </td>
                        <td
                            :class="{'mini': mini}"
                        >
                            {{ displayTime(props.item.time_start) }}
                        </td>
                        <td
                            :class="{'mini': mini}"
                        >
                            <v-icon
                                class="clickable"
                                v-if="isAdmin && !props.item.time_finish && +props.item.user.id !== +authUser.id"
                                color="blue"
                                :title="`Закончить рабочий день сотрудника ${props.item.user.full_name}`"
                                @click="setClosingUser(props.item.user)"
                            >
                                directions_walk
                            </v-icon>
                            <span>{{ displayTime(props.item.time_finish) || '' }}</span>
                        </td>
                        <td align="center"
                            :class="{'mini': mini}"
                        >
                            <v-flex v-for="timeBreak in props.item.time_breaks"
                                    :key="timeBreak.id"
                                    class="text-xs-center"
                            >
                                <span>{{ displayTime(timeBreak.start_time) }}</span>
                                -
                                <span>{{ displayTime(timeBreak.finish_time) }}</span>
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
                       :disabled="loading"
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
        <workdays-admin-panel v-if="isAdmin && isToday && isDayOpen"/>
        <v-dialog
            v-model="adminClosing"
            max-width="800px"
            @update:returnValue="closeDialog"
        >
            <v-card
                class="round-corner"
            >
                <v-card-title
                        class="light-blue darken-3"
                >
                    <span
                            class="white--text title"
                    >
                        {{ `Закончить рабочий день сотрудника ${closingUser && closingUser.full_name || ''}` }}
                    </span>
                    <v-spacer/>
                    <v-icon
                            class="clickable"
                            color="white"
                            @click="closeDialog"
                    >
                        close
                    </v-icon>
                </v-card-title>
                <v-card-text>
                    ntcn
                </v-card-text>


            </v-card>
        </v-dialog>
    </v-flex>

</template>
<script>
    import UserAvatar from '../main/UserAvatar'
    import WorkdaysAdminPanel from './WorkdaysAdminPanel'
    export default {
        name: 'WorkDaysTable',
        data: () => ({
            adminClosing: false,
            closingUser: null,
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
            isAdmin () {
                return this.$store.state.authUser && this.$store.state.authUser.is_admin
            },
            mini () {
                return this.$store.getters.miniMode
            },
            loading () {
                return this.$store.getters.busy
            },
            basePath () {
                return this.$store.state.basePath
            },
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
            closeDialog () {
                this.closingUser = null
            },
            setClosingUser (user) {
                console.log('Setting user ' + user)
                this.closingUser = user
            },
            displayTime (fullTime) {
                if (!fullTime || !fullTime.length) {
                    return ''
                }
                return this.$store.state.appointment.displayTime(fullTime)
            },
            updateHours (workday) {
                if (!this.isSuperAdmin) return
                this.$store.dispatch('updateWorkDay', {
                    id: workday.id,
                    working_hours: workday.working_hours
                })
                    .then(() => this.showSnack('Количество часов изменено', 'green'))
            },
            startScanWorkdays () {
                this.$store.commit('SET_SCAN_MODE', {...this.$store.state.scanMode, workdays: true})
            },
            stopScanWorkdays () {
                this.$store.commit('SET_SCAN_MODE', {...this.$store.state.scanMode, workdays: false})
            },
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
                if (!this.currentWorkDay.working_hours) {
                    this.$refs.hoursInput.focus()
                    this.showSnack('Чтобы завершить рабочий день введите количество отработанных часов', 'red')
                    return
                }
                this.$store.dispatch('finishUserDay', {working_hours: this.currentWorkDay.working_hours})
                    .then(() => this.showSnack(`Спасибо за работу, ${this.authUser.first_name} ${this.authUser.patronymic}`, 'green'))
            },
            startDay () {
                this.$store.dispatch('startUserDay')
                    .then(() => this.showSnack(`Добро пожаловать, ${this.authUser.first_name} ${this.authUser.patronymic}`, 'green'))
            }
        },
        watch: {
            closingUser (val) {
                this.adminClosing = !!val
            }
        },
        components: {
            UserAvatar,
            WorkdaysAdminPanel
        }
    }
</script>
<style>
    .mini {
        height: 1em!important;
        padding: 0!important;
        padding-left: 1em!important;
    }
    .working {
        border-bottom: 2pt solid #fafafa!important;
    }
</style>
