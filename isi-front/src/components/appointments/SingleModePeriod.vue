<template>
    <div
        @click.self="periodClicked"
        style="width: 100%; height: 100%; cursor: pointer; display: flex"
        :style="{height: `${$parent.intervalHeight}px`}"
        :title="`Добавить запись на ${textDate} в ${hour}:**`"
    >
        &nbsp;
        <calendar-record-adder
            v-if="addMode"
            :date="date"
            :preset-hour="hour"
            @reset="addMode = false"
        />
        <single-entry
            v-if="periodAppointments.length"
            :events="periodAppointments"
            :date="date"
            :hour="hour"
            @addAttempt="periodClicked"
        />
    </div>
</template>
<script>
    import SingleEntry from './SingleEntry'
    import CalendarRecordAdder from './CalendarRecordAdder'
    export default {
        name: 'SingleModePeriod',
        props: ['date', 'hour'],
        data: () => ({
            addMode: false
        }),
        computed: {
            textDate () {
                return this.$moment(this.date).format('DD MMMM YYYY г.')
            },
            appointments () {
                return this.$store.state.appointment.appointments
            },
            workingIsland () {
                return this.$store.getters.workingIsland
            },
            periodAppointments () {
                return this.appointments && this.appointments.filter(item => item.date.split(' ')[0] === this.date && +item.date.split(' ')[1].split(':')[0] === +this.hour) || []
            }
        },
        methods: {
            periodClicked () {
                this.addMode = true
            }
        },
        components: {
            CalendarRecordAdder,
            SingleEntry
        }
    }
</script>
