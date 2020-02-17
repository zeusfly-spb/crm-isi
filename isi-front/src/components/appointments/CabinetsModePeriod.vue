<template>
    <v-layout>
        <v-flex
            class="cab-mode-period"
            v-for="(cabinet, index) in cabinets"
            :key="index"
            :style="{width: `${columnWidth}px`, height: `${$parent.intervalHeight}px`}"
            style="border: 1px solid grey; display: flex"
            column
            align-center
        >
            <v-menu
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
            >
                <template v-slot:activator="{ on }">
                    <span
                        class="ml-2"
                        style="cursor: pointer"
                        title="Просмотр записи"
                        v-if="!display && cabinetEvents(cabinet.id).length"
                        v-on="on"
                    >
                        <v-icon
                            color="blue"
                        >
                            event
                        </v-icon>
                        <span
                            class="green--text"
                        >
                            {{ cabinetEvents(cabinet.id)[0].date.split(' ')[1] }}
                        </span>
                        <span
                            class="blue--text ml-1"
                        >
                            {{ cabinetEvents(cabinet.id)[0].client_name }}
                        </span>
                    </span>
                </template>
                <div
                    style="width: 100%; height: 100%; cursor: pointer; background-color: white"
                    @click.self="fieldClicked({cabinet: cabinet, hour: hour})"
                    :title="cabinetEvents(cabinet.id).length < 2 ? `Добавить запись на ${textDate} в ${hour}:** в кабинет ${cabinet.name}` : ''"
                >
                    <cabinet-entry
                        v-if="cabinetEvents(cabinet.id).length"
                        :events="cabinetEvents(cabinet.id)"
                        @delete="emitDelete"
                        @addAttempt="addAttempt"
                        :date="date"
                        :hour="hour"
                        :cabinet="cabinet"
                    />
                </div>
            </v-menu>

        </v-flex>
        <calendar-record-adder
            v-if="activeCabinet"
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
    export default {
        name: 'CabinetsModePeriod',
        props: ['cabinets', 'columnWidth', 'hour', 'date'],
        data: () => ({
            display: false,
            activeCabinet: null
        }),
        computed: {
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
            addAttempt (cabinet) {
                this.activeCabinet = cabinet
            },
            resetAdding () {
                this.activeCabinet = null
            },
            emitDelete (event) {
                this.$emit('delete', event)
            },
            fieldClicked ({cabinet, hour}) {
                this.activeCabinet = cabinet
            },
            cabinetEvents (id) {
                return this.periodAppointments.filter(event => event.cabinet_id === id)
            }
        },
        components: {
            CabinetEntry,
            CalendarRecordAdder
        }
    }
</script>
