<template>
    <v-flex>
        <v-layout>
            <v-flex
                v-for="(cabinet, index) in cabinets"
                :key="index"
                :style="{width: `${columnWidth}px`, height: `${$parent.intervalHeight}px`}"
                style="border: 1px solid grey; display: flex"
                column
                :align-center="cabinetEvents(cabinet.id).length < 2"
            >
                &nbsp;
                <cabinet-entry
                    v-if="cabinetEvents(cabinet.id).length"
                    :events="cabinetEvents(cabinet.id)"
                    @delete="emitDelete"
                    :date="date"
                    :hour="hour"
                />
            </v-flex>
        </v-layout>
    </v-flex>
</template>
<script>
    import CabinetEntry from './CabinetEntry'
    export default {
        name: 'CabinetsModePeriod',
        props: ['cabinets', 'columnWidth', 'hour', 'date'],
        computed: {
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
            emitDelete (event) {
                this.$emit('delete', event)
            },
            fieldClicked ({cabinet, hour}) {
            },
            cabinetEvents (id) {
                return this.periodAppointments.filter(event => event.cabinet_id === id)
            }
        },
        components: {
            CabinetEntry
        }
    }
</script>
