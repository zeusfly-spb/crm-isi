<template>
    <v-flex>
        <div v-if="cabinets.length">
            <div class="text-md-center"
                 v-if="events.length && breakpoint.name !== 'xs'"
            >
                <span class="title">Записи:</span>
            </div>
            <v-layout v-for="(item, index) in cabinets.filter(cabinet => cabinet.events.length > 0)"
                      :key="`${index}${item.id}`"
            >
                <v-flex left>
                    <v-icon
                        v-if="breakpoint.name === 'xs'"
                        small
                    >
                        meeting_room
                    </v-icon>
                    <span
                        v-else
                        class="subheading"
                    >
                        Кабинет "{{ item.name }}"
                    </span>
                </v-flex>
                <v-flex
                    right
                    class="text-md-right"
                >
                    <span class="title blue--text">{{ item.events.length }}</span>
                </v-flex>
            </v-layout>
        </div>
        <v-flex
            v-else
            class="text-md-center"
        >
            <v-icon
                small
                v-if="breakpoint.name === 'xs'"
            >
                event
            </v-icon>
            <span
                v-else
            >
                Записей:
            </span>
            <span class="title blue--text">{{ events.length }}</span>
        </v-flex>
    </v-flex>
</template>
<script>
    export default {
        name: 'MonthModeDate',
        props: ['date'],
        computed: {
            breakpoint () {
                return this.$vuetify.breakpoint
            },
            events () {
                let base = this.$store.state.appointment.appointments
                    .filter(item => item.date.split(' ')[0] === this.date)
                if (this.workingIsland && this.workingIsland.cabinets.length) {
                    return base.filter(item => this.workingIsland.cabinets.map(cab => cab.id).includes(item.cabinet_id))
                } else {
                    return base.filter(item => item.cabinet_id === null)
                }
            },
            workingIsland () {
                return this.$store.getters.workingIsland
            },
            cabinets () {
                let base = this.workingIsland && this.workingIsland.cabinets || []
                if (base.length) {
                    return base.map(cabinet => ({...cabinet, events: this.events.filter(event => event.cabinet_id === cabinet.id)}))
                } else {
                    return base
                }
            }
        }
    }
</script>
