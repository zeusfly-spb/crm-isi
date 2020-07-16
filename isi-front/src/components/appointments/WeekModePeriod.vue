<template>
    <div
        class="week-mode-period"
        :class="{'red lighten-5': [0, 6].includes(weekday)}"
        style="border: lightgrey 1px solid!important;"
        @click="dayClick(date)"
        @touchend="dayClick(date)"
        :title="`Переключить на ${$moment(date).format('DD MMMM YYYY г.')} в режим 'день'`"
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
                if (this.$store.getters.callCenter) {
                    return this.$store.getters.inspectingIsland && this.$store.getters.inspectingIsland.cabinets || []
                }
                return this.workingIsland && this.workingIsland.cabinets || []
            },
            appointments () {
                const compareItem = (item) => {
                    let dateEq = item.date && item.date.split(' ')[0] === this.date || false
                    let hourEq = item.date && item.date.split(' ')[1] && +item.date.split(' ')[1].split(':')[0] === +this.hour || false
                    return dateEq && hourEq
                }
                let base = this.$store.state.appointment.appointments
                    .filter(item => compareItem(item))
                if (this.single) {
                    return base.filter(item => item.cabinet_id === null)
                } else {
                    return base.filter(item => item.cabinet_id !== null)
                }
            }
        },
        methods: {
            dayClick (date) {
                this.$emit('date', date)
            }
        }
    }
</script>
<style>
    .week-mode-period {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%; height: 100%;
    }
</style>
