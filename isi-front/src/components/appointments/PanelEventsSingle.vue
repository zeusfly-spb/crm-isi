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
            <template v-slot:interval="{ hour }">
                <v-flex
                    class="interval"
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
        computed: {
            addingDate () {
                return this.$store.state.appointment.addingDate || this.$store.state.realDate
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
        }
    }
</script>
<style scoped>
    .interval {
        height: 100%!important;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
</style>
