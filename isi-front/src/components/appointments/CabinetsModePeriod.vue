<template>
    <v-layout
        ref="mainLayout"
        style="width: 100%"
    >
        <div
            class="cab-mode-period p-0 m-0"
            v-for="cabinet in cabinets"
            :key="cabinet.id"
            :style="{width: `${fieldWidth}px`, height: `${$parent.intervalHeight}px`}"
            @click.self="fieldClicked({cabinet: cabinet, hour: hour})"
            :title="`Добавить запись на ${hour} в кабинет ${cabinet.name}`"
        >
            <v-menu
                @update:returnValue="menuAction"
                v-if="cabinetEvents(cabinet.id).length"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
            >
                <template v-slot:activator="{ on }">
                    <v-btn
                        round
                        flat
                        small
                        style="margin: 3px; padding: 3px"
                        title="Просмотр записи"
                        v-on="on"
                        @click="menuOpen = true"
                        :disabled="menuOpen"
                    >
                        <v-icon
                            color="blue"
                        >
                            event
                        </v-icon>
                        <span
                            class="green--text"
                        >
                            {{ $store.state.appointment.displayTime(cabinetEvents(cabinet.id)[0].date.split(' ')[1])  }}
                        </span>
                        <span
                            class="blue--text ml-1"
                        >
                            {{ cabinetEvents(cabinet.id)[0].client_name }}
                        </span>
                    </v-btn>
                </template>
                <div
                    class="teal lighten-5"
                >
                    <cabinet-entry
                        v-if="cabinetEvents(cabinet.id).length"
                        :events="cabinetEvents(cabinet.id)"
                        @addAttempt="addAttempt"
                        :date="date"
                        :hour="hour"
                        :cabinet="cabinet"
                    />
                </div>
            </v-menu>
            <v-menu
                @update:returnValue="menuAction"
                v-if="cabinetEvents(cabinet.id).length > 1"
                :close-on-content-click="false"
                :close-on-click="!addMode"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
            >
                <template v-slot:activator="{ on }">
                    <v-btn
                        style="margin: 0; padding: 0"
                        small
                        icon
                        v-on="on"
                        color="blue"
                        :title="`Показать все записи часа (${cabinetEvents(cabinet.id).length})`"
                        @click="menuOpen = true"
                        :disabled="menuOpen"
                    >
                        <span class="subheading white--text">
                            <strong>
                                + {{ `${cabinetEvents(cabinet.id).length - 1}` }}
                            </strong>
                        </span>
                    </v-btn>
                </template>
                <v-card
                    class="round-corner teal lighten-5"
                >
                    <v-card-title
                        class="light-blue darken-3 pt-0 pb-0"
                    >
                        <span class="subheading white--text">
                            Все записи в кабинет "{{ cabinet.name }}" на {{ date | moment('DD MMMM YYYY г.') }}
                            c <em>{{ hour }}:00</em> до <em>{{ hour }}:59</em>
                        </span>
                        <v-spacer/>
                        <v-btn
                            outline
                            small
                            icon
                            flat
                            color="white"
                            @click="addMode = true"
                            :title="`Добавить запись на ${$moment(date).format('DD MMMM YYYY г.')}`"
                        >
                            <v-icon
                                small
                                color="white"
                            >
                                queue
                            </v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <event
                            v-for="(event,  index) in cabinetEvents(cabinet.id)"
                            :key="`e${event.id}${index}`"
                            :event="event"
                        />
                    </v-card-text>
                </v-card>
            </v-menu>
        </div>
        <calendar-record-adder
            v-if="addMode"
            :date="date"
            :preset-cabinet="activeCabinet"
            :preset-hour="hour"
            @reset="resetAdding"
        />
    </v-layout>
</template>
<script>
    import CalendarRecordAdder from './CalendarRecordAdder'
    import CabinetEntry from './CabinetEntry'
    import Event from './Event'
    export default {
        name: 'CabinetsModePeriod',
        props: ['cabinets', 'hour', 'date'],
        data: () => ({
            menuOpen: false,
            fullWidth: null,
            itemDisplay: false,
            listDisplay: false,
            addMode: false,
            activeCabinetId: null
        }),
        computed: {
            dialogLocked () {
                return this.$store.state.appointment.dialogLocked
            },
            fieldWidth () {
                return this.fullWidth / this.cabinets.length
            },
            breakpoint () {
                return this.$vuetify.breakpoint
            },
            textDate () {
                return this.$moment(this.date).format('DD MMMM YYYY г.')
            },
            names () {
                return this.cabinets.map(item => item.name)
            },
            appointments () {
                return this.$store.state.appointment.appointments
            },
            periodAppointments () {
                return this.appointments && this.appointments.filter(item => item.date.split(' ')[0] === this.date && +item.date.split(' ')[1].split(':')[0] === +this.hour) || []
            }
        },
        methods: {
            menuAction () {
                this.menuOpen = false
            },
            addAttempt (cabinet) {
                this.activeCabinet = cabinet
            },
            resetAdding () {
                this.addMode = false
            },
            fieldClicked ({cabinet}) {
                if (this.dialogLocked) {
                    return
                }
                this.activeCabinet = cabinet
                this.addMode = true
            },
            cabinetEvents (id) {
                return this.periodAppointments.filter(event => event.cabinet_id === id)
            }
        },
        mounted () {
            this.fullWidth = this.$refs.mainLayout.offsetWidth
        },
        watch: {
            menuOpen (val) {
                val ? this.$store.commit('LOCK_DIALOG') : this.$store.commit('UNLOCK_DIALOG')
            }
        },
        components: {
            CabinetEntry,
            CalendarRecordAdder,
            Event
        }
    }
</script>
<style>
    .cab-mode-period {
        border: 1px solid lightgray;
        display: flex;
        cursor: pointer;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;
    }
</style>
