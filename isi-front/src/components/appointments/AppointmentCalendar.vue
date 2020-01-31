<template>
    <v-layout wrap>
        <v-flex
            sm4
            xs12
            class="text-sm-left text-xs-center"
        >
            <v-btn
                icon
                @click="goPrev"
            >
                <v-icon>
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
                    >
                        {{ currentMonth | moment('MMMM YYYY') | upFirst }}
                    </span>
                </template>
                <v-date-picker
                    v-model="currentMonth" no-title scrollable
                    @change="monthPicked"
                    locale="ru"
                    first-day-of-week="1"
                />
            </v-menu>
        </v-flex>
        <v-flex
            sm4
            xs12
            class="text-sm-right text-xs-center"
        >
            <v-btn
                icon
                @click="goNext"
            >
                <v-icon>
                    keyboard_arrow_right
                </v-icon>
            </v-btn>
        </v-flex>
        <v-flex
            xs12
            class="mb-3"
        >
            <v-sheet
                :height="windowHeight"
                elevation="2"
            >
                <v-calendar
                    :type="mode"
                    locale="ru"
                    :weekdays="[1,2,3,4,5,6,0]"
                    ref="calendar"
                    v-model="currentMonth"
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
                                v-if="date === openDate"
                                :date="openDate"
                                @reset="resetOpenDate"
                            />
                        </v-menu>
                    </template>
                </v-calendar>
            </v-sheet>
        </v-flex>
    </v-layout>
</template>
<script>
    import CalendarRecordAdder from './CalendarRecordAdder'
    export default {
        name: 'AppointmentCalendar',
        props: ['mode'],
        data: () => ({
            currentMonth: null,
            newDate: null,
            menu: false,
            openDate: null
        }),
        computed: {
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
            resetOpenDate () {
                this.openDate = null
            },
            selectDate (data) {
                if (data.past) {
                    this.$emit('message', {text: 'Невозможно добавить запись на дату в прошлом!', color: 'red'})
                    return
                }
                this.openDate = data.date
            },
            monthPicked (val) {
                this.currentMonth = val + '-01'
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
            accountingDate (val) {
                this.currentMonth = val
            }
        },
        components: {
            CalendarRecordAdder
        }
    }
</script>
