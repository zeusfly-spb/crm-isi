<template>
    <v-flex>
        <v-snackbar
            v-model="snackbar"
            auto-height
            top
            :timeout="3000"
            :color="snackColor"
        >
            <span>{{ snackText }}</span>
        </v-snackbar>
        <island-switcher/>
        <appointment-calendar @message="showSnack"/>
    </v-flex>
</template>
<script>
    import IslandSwitcher from '../IslandSwitcher'
    import AppointmentCalendar from './AppointmentCalendar'
    export default {
        name: 'AppointmentPanel',
        data: () => ({
            snackbar: false,
            snackText: '',
            snackColor: 'green'
        }),
        computed: {
            workingIsland () {
                return this.$store.getters.workingIsland
            }
        },
        methods: {
            showSnack ({color, text}) {
                this.snackColor = color
                this.snackText = text
                this.snackbar = true
            }
        },
        components: {
            IslandSwitcher,
            AppointmentCalendar
        }
    }
</script>
