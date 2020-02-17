<template>
    <v-flex>

    </v-flex>
</template>
<script>
    export default {
        name: 'MonthModeDate',
        props: ['date'],
        computed: {
            events () {
                return this.$store.state.appointment.appointments
                    .filter(item => item.date.split(' ')[0] === this.date)
            }
        }
    }
</script>
