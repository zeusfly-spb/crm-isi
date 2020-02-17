<template>
    <div
        style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%"
    >
        <span
            v-if="appointments.length"
            class="title text-md-center blue--text"
        >
            Записей: <span class="green--text">{{ appointments.length }}</span>
        </span>
    </div>
</template>
<script>
    export default {
        name: 'WeekModePeriod',
        props: ['date', 'hour'],
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
                return this.$store.state.appointment.appointments
                    .filter(item => item.date.split(' ')[0] === this.date && +item.date.split(' ')[1].split(':')[0] === +this.hour)
            }
        }
    }
</script>
