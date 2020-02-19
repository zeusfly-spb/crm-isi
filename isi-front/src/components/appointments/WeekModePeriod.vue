<template>
    <div
        style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%"
        :class="{'red lighten-5': [0, 6].includes(weekday)}"
    >
        <div
            v-if="appointments.length"
            class="subheading text-md-center"
        >
            <v-icon
                    v-if="$vuetify.breakpoint.name === 'xs'"
                    small
            >
                event
            </v-icon>
            <span v-else>
                Записей:
            </span>
            <span class="title blue--text">{{ appointments.length }}</span>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'WeekModePeriod',
        props: ['date', 'hour', 'weekday'],
        computed: {
            single () {
                return this.cabinets.length === 0
            },
            workingIsland () {
                return this.$store.getters.workingIsland
            },
            cabinets () {
                return this.workingIsland && this.workingIsland.cabinets || []
            },
            appointments () {
                let base = this.$store.state.appointment.appointments
                    .filter(item => item.date.split(' ')[0] === this.date && +item.date.split(' ')[1].split(':')[0] === +this.hour)
                if (this.single) {
                    return base.filter(item => item.cabinet_id === null)
                } else {
                    return base.filter(item => item.cabinet_id !== null)
                }
            }
        }
    }
</script>
