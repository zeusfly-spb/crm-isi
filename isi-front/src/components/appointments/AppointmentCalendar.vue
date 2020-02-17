<template>
    <v-flex>
        <v-layout class="mb-2">
            <v-flex xs12 sm6 md4>
                <v-select
                    class="mb-2 ml-2"
                    :items="viewModes"
                    v-model="mode"
                    title="Режим просмотра"
                    style="width: 7em!important; height: 1em"
                    item-text="description"
                    item-value="name"
                    single-line
                />
            </v-flex>
            <v-flex
                class="text-sm-right"
            >
                <v-btn
                    small
                    icon
                    @click="goPrev"
                >
                    <v-icon
                        small
                    >
                        keyboard_arrow_left
                    </v-icon>
                </v-btn>
            </v-flex>
            <v-flex
                class="text-xs-center"
                style="display: flex; justify-content: center; align-items: center"
            >
                <v-menu
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                    v-model="menu"
                >
                    <template v-slot:activator="{ on }">
                    <span
                        v-on="on"
                        class="clickable title blue--text"
                        title="Изменить месяц"
                        v-if="['month', 'week'].includes(mode)"
                    >
                        {{ currentMonth | moment('MMMM YYYY') | upFirst }}
                    </span>
                        <span
                            v-on="on"
                            class="clickable title blue--text"
                            title="Изменить день"
                            v-else
                        >
                        {{ currentMonth | moment('DD MMMM YYYY') | upFirst }}
                    </span>

                    </template>
                    <v-date-picker
                        :type="mode === 'month' ? 'month' : 'date'"
                        :value="currentMonth"
                        no-title
                        scrollable
                        @change="monthPicked"
                        locale="ru"
                        first-day-of-week="1"
                    />
                </v-menu>
            </v-flex>
            <v-flex
                class="text-sm-left"
            >
                <v-btn
                    small
                    icon
                    @click="goNext"
                >
                    <v-icon
                        small
                    >
                        keyboard_arrow_right
                    </v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs12 sm6 md4>
                &nbsp;
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex
                xs12
                class="mb-3"
            >
                <v-calendar
                    :type="mode"
                    locale="ru"
                    :weekdays="[1,2,3,4,5,6,0]"
                    ref="calendar"
                    v-model="currentMonth"
                    first-interval="8"
                    interval-count="15"
                    :interval-format="intervalFormat"
                    interval-height="48"
                    @click:date="selectDate"
                >
                    <template v-slot:day="{ date }">
                        <v-menu
                            :value="date === openDate && workingIslandId"
                            :close-on-content-click="false"
                            :close-on-click="false"
                            max-width="1000px"
                        >
                            <template v-slot:activator="{ on }">
                                <div v-on="on"></div>
                            </template>
                            <calendar-record-adder
                                v-if="date === openDate && mode === 'month'"
                                :date="openDate"
                                @reset="resetOpenDate"
                                @message="forwardMessage"
                            />
                        </v-menu>
                        <div style="width: 100%; height: 100%; cursor: pointer"
                             @click="dayClick(date)"
                             :title="`Переключить на ${$moment(date).format('DD MMMM YYYY г.')} в режим 'день'`"
                        >
                            <month-mode-date
                                v-if="appointments.filter(item => item.date.split(' ')[0] === date).length"
                                :date="date"
                            />
                        </div>
                    </template>
                    <template v-slot:dayHeader="{ date }">
                        <calendar-record-adder
                            v-if="date === openDate && ['week', 'day'].includes(mode)"
                            :date="openDate"
                            @reset="resetOpenDate"
                            @message="forwardMessage"
                        />
                        <cabinets-mode-header
                            v-if="displayMode === 'cabinets'"
                            :cabinets="cabinets"
                            @computed="setCabinetsWidth"
                        />
                    </template>
                    <template v-slot:interval="{ hour, date }">
                        <cabinets-mode-period
                            v-if="displayMode === 'cabinets'"
                            :cabinets="cabinets"
                            :columnWidth="cabinetsWidth"
                            :hour="hour"
                            :date="date"
                            @delete="showDeleteConfirm"
                        />
                        <single-mode-period
                            v-if="displayMode === 'single'"
                            :hour="hour"
                            :date="date"
                            @delete="showDeleteConfirm"
                        />
                        <week-mode-period
                            v-if="displayMode === 'week'"
                            :hour="hour"
                            :date="date"
                        />
                    </template>
                </v-calendar>
            </v-flex>
        </v-layout>


        <v-dialog
            :value="!!eventToDelete"
            max-width="500px"
            v-if="eventToDelete"
        >
            <v-card
                class="round-corner"
            >
                <v-card-title class="red lighten-1">
                    <span class="title white--text">Подтверждение</span>
                </v-card-title>
                <v-card-text class="subheading">
                    Удалить запись <strong>{{ eventToDelete.service.description }}</strong>
                    островка <strong><em>{{ eventToDelete.island.name }}</em></strong> на
                    <strong>{{ eventToDelete.date | moment('DD MMMM YYYY г. в hh:mm')}}</strong>,
                    клиента <strong>{{ eventToDelete.client_name }}</strong>?
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn
                        flat
                        @click="resetDeleting"
                    >
                        Отмена
                    </v-btn>
                    <v-btn
                        color="red darken-1"
                        flat
                        @click="deleteEvent"
                    >
                        Удалить
                    </v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
    </v-flex>
</template>
<script>
    import CalendarRecordAdder from './CalendarRecordAdder'
    import CabinetsModeHeader from './CabinetsModeHeader'
    import CabinetsModePeriod from './CabinetsModePeriod'
    import SingleModePeriod from './SingleModePeriod'
    import WeekModePeriod from './WeekModePeriod'
    import MonthModeDate from './MonthModeDate'
    export default {
        name: 'AppointmentCalendar',
        data: () => ({
            mode: 'day',
            eventToDelete: null,
            cabinetsWidth: null,
            currentMonth: null,
            newDate: null,
            menu: false,
            openDate: null,
            viewModes: [
                {name: 'month', description: 'Месяц'},
                {name: 'week', description: 'Неделя'},
                {name: 'day', description: 'День'}
            ]
        }),
        computed: {
            intervalHeight () {
                return this.$refs.calendar && this.$refs.calendar.intervalHeight
            },
            cabinets () {
                return this.workingIsland && this.workingIsland.cabinets
            },
            displayMode () {
                if (this.mode === 'day') {
                    return this.workingIsland.cabinets.length ? 'cabinets' : 'single'
                } else {
                    return this.mode
                }
            },
            workingIsland () {
                return this.$store.getters.workingIsland
            },
            appointments () {
                return this.$store.state.appointment.appointments
            },
            workingIslandId () {
                return this.$store.state.workingIslandId
            },
            accountingDate () {
                return this.$store.state.accountingDate
            },
            windowHeight () {
                return window.innerHeight * .7
            }
        },
        methods: {
            resetDeleting () {
                this.eventToDelete = null
            },
            showDeleteConfirm (event) {
                this.eventToDelete = event
            },
            deleteEvent () {
                this.$store.dispatch('deleteAppointment', this.eventToDelete)
                    .then(() => {
                        this.forwardMessage({text: 'Запись удалена', color: 'green'})
                        this.resetDeleting()
                    })
            },
            setCabinetsWidth (width) {
                this.cabinetsWidth = width
            },
            dayClick (date) {
                this.currentMonth = date
                this.$emit('mode', 'day')
                console.log(date)
            },
            intervalFormat (interval) {
                return interval.time
            },
            forwardMessage (message) {
                this.$emit('message', {... message})
            },
            resetOpenDate () {
                this.openDate = null
            },
            selectDate (data) {
                /** Commented out to add a appointment retroactively
                 if (data.past) {
                    this.$emit('message', {text: 'Невозможно добавить запись на дату в прошлом!', color: 'red'})
                    return
                }
                 **/
                if (!this.workingIslandId) {
                    this.$emit('message', {text: 'Чтобы добавить запись, выберите островок', color: 'blue'})
                    return
                }
                this.currentMonth = data.date
                this.openDate = data.date
            },
            monthPicked (val) {
                let withDay = val.split('-').length > 2
                if (withDay) {
                    this.currentMonth = val
                } else {
                    this.currentMonth = `${val}-01`
                }
                this.menu = false
            },
            goNext () {
                this.resetOpenDate()
                this.$refs.calendar.next()
            },
            goPrev () {
                this.resetOpenDate()
                this.$refs.calendar.prev()
            }
        },
        created () {
            this.currentMonth = this.accountingDate
        },
        watch: {
            accountingDate (val, oldVal) {
                if (!oldVal) {
                    this.currentMonth = val
                }
            },
            currentMonth (val) {
                this.$store.dispatch('changeAppointmentDate', val)
            }
        },
        components: {
            CalendarRecordAdder,
            CabinetsModeHeader,
            CabinetsModePeriod,
            SingleModePeriod,
            WeekModePeriod,
            MonthModeDate
        }
    }
</script>
