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
        </v-calendar>
    </v-sheet>
</template>
<script>
    export default {
        name: 'PanelEventsSingle',
        computed: {
            addingDate () {
                return this.$store.state.appointment.addingDate
            },
            events () {
                let base = this.$store.state.appointment.appointments
                return base
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
            intervalFormat (interval) {
                return interval.time
            }
        }
    }
</script>
