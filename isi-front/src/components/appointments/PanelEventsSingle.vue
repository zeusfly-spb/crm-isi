<template>
    <v-sheet>
        <v-calendar
            locale="ru"
            type="day"
            first-interval="8"
            interval-count="15"
            v-model="addingDate"
            :interval-height="intervalHeight"
            :interval-format="intervalFormat"
        >
            <template v-slot:dayHeader="{ date, past, present, future }">
                <div>
                    <v-menu
                            :close-on-content-click="false"
                            lazy
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px"
                            v-model="menu"
                    >
                        <template v-slot:activator="{ on }">
                            <span class="clickable"
                                  title="Изменить дату календаря"
                                  v-on="on"
                            >
                                    <div
                                          class="ml-1 clickable"
                                          :class="{
                                                    'green--text': present,
                                                    'grey--text': past,
                                                    'blue--text': future
                                                  }"
                                    >
                                        {{ date | moment('D MMMM YYYY г.') }}
                                    </div>
                            </span>
                        </template>
                        <v-date-picker v-model="addingDate" no-title scrollable
                                       @change="menu = false"
                                       locale="ru"
                                       first-day-of-week="1"
                        >
                        </v-date-picker>
                    </v-menu>
                </div>
            </template>
            <template v-slot:interval="{ hour }">
                <v-flex
                    class="interval"
                    :class="{'effect': borderEffect && addingHour === hour}"
                >
                    <v-badge
                        right
                        overlap
                        v-if="hourEvents(hour).length > 1"
                    >
                        <template v-slot:badge>
                            <span>{{ hourEvents(hour).length }}</span>
                        </template>
                        <v-icon
                            large
                            color="green"
                        >
                            event
                        </v-icon>
                    </v-badge>
                    <v-icon
                        large
                        color="green"
                        v-if="hourEvents(hour).length === 1"
                    >
                        event
                    </v-icon>
                    <span
                        class="blue--text body-2"
                        v-if="hourEvents(hour).length"
                    >
                        {{ eventNames(hourEvents(hour)) }}
                    </span>
                </v-flex>
            </template>
        </v-calendar>
    </v-sheet>
</template>
<script>
    export default {
        name: 'PanelEventsSingle',
        data: () => ({
            menu:false,
            timerId: null,
            borderEffect: false
        }),
        computed: {
            attemptToEvent () {
                return this.$store.state.lead.attemptToEvent
            },
            addingHour () {
                return this.$store.state.appointment.addingHour
            },
            addingDate: {
                get () {
                    return this.$store.state.appointment.addingDate || this.$store.state.realDate
                },
                set (val) {
                    this.$store.commit('SET_ADDING_DATE', val);
                }
            },
            events () {
                return this.$store.state.appointment.appointments
                    .filter(item => item.status === 'active')
                    .filter(item => item.date.split(' ')[0] === this.addingDate)
                    .map(item => ({...item, hour: item.date.split(' ')[1].split(':')[0]}))
            },
            intervalHeight () {
                return this.windowHeight / 15
            },
            windowHeight () {
                return window.innerHeight * .85
            },
            workingIsland () {
                return this.$store.getters.workingIsland
            },
            workingIslandId () {
                return this.$store.state.workingIslandId
            }
        },
        methods: {
            datePicked (val) {
                this.$store.commit('SET_ADDING_DATE', val)
            },
            showHourBorder () {
                if (this.timerId) {
                    clearTimeout(this.timerId)
                }
                this.borderEffect = false
                this.timerId = setTimeout(() => {
                    this.borderEffect = true
                }, 500)
            },
            eventNames (events) {
                let base = events.map(item => item.client_name)
                return events.length === 1 ? base[0] : base.join(', ')
            },
            hourEvents (hour) {
                return this.events.filter(item => +item.date.split(' ')[1].split(':')[0] === +hour)
            },
            intervalFormat (interval) {
                return interval.time
            }
        },
        mounted () {
            setInterval(() => {
                if (this.addingHour) {
                    this.showHourBorder()
                }
            }, 1000)
        },
        watch: {
            addingHour (val) {
                if (val) {
                    this.showHourBorder()
                }
            }
        }
    }
</script>
<style scoped>
    .effect {
        border: 3px solid green;
    }
    .interval {
        height: 100%!important;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
</style>
