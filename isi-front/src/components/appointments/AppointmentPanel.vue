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
        <v-flex>
            <v-select
                class="ml-2"
                title="Режим просмотра"
                style="width: 7em"
                :items="viewModes"
                v-model="currentViewMode"
                item-text="description"
                item-value="name"
                single-line
            />
        </v-flex>
        <appointment-calendar
            :mode="currentViewMode"
            @message="showSnack"
        />
    </v-flex>
</template>
<script>
    import IslandSwitcher from '../IslandSwitcher'
    import AppointmentCalendar from './AppointmentCalendar'
    export default {
        name: 'AppointmentPanel',
        data: () => ({
            currentViewMode: 'day',
            snackbar: false,
            snackText: '',
            snackColor: 'green',
            viewModes: [
                {name: 'month', description: 'Месяц'},
                {name: 'week', description: 'Неделя'},
                {name: 'day', description: 'День'}
            ]
        }),
        computed: {
            workingIsland () {
                return this.$store.getters.workingIsland
            }
        },
        methods: {
            setViewMode (mode) {
                this.currentViewMode = mode
            },
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
