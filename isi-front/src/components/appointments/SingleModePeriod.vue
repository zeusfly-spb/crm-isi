<template>
    <div
        @click.self="periodClicked"
        style="width: 100%; height: 100%; cursor: pointer; display: flex; justify-content: flex-start; align-items: center"
        :style="{height: `${$parent.intervalHeight}px`}"
        :title="`Добавить запись на ${textDate} в ${hour}:**`"
    >
        <v-menu
            v-model="display"
            v-if="events.length"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
        >
            <template v-slot:activator="{ on }">
                <v-btn
                    round
                    flat
                    small
                    style="margin: 3px; padding: 3px"
                    title="Просмотр записи"
                    v-on="on"
                >
                    <v-icon
                        color="blue"
                    >
                        event
                    </v-icon>
                    <span
                        class="green--text"
                    >
                            {{ $store.state.appointment.displayTime(events[0].date.split(' ')[1]) }}
                        </span>
                    <span
                        class="blue--text ml-1"
                    >
                            {{ events[0].client_name }}
                        </span>
                </v-btn>
            </template>
            <div
                class="teal lighten-5"
            >
                <event
                    :event="events[0]"
                />
            </div>
        </v-menu>
        <v-menu
            v-model="periodDisplay"
            v-if="events.length > 1"
            :close-on-content-click="false"
            :close-on-click="!addMode && !deleteMode"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
        >
            <template v-slot:activator="{ on }">
                <v-btn
                    style="margin: 0; padding: 0"
                    small
                    icon
                    v-on="on"
                    color="blue"
                    :title="`Показать все записи часа (${events.length})`"
                >
                        <span class="subheading white--text">
                            <strong>
                                + {{ `${events.length - 1}` }}
                            </strong>
                        </span>
                </v-btn>
            </template>
            <v-card
                class="round-corner teal lighten-5"
            >
                <v-card-title
                    class="light-blue darken-3 pt-0 pb-0"
                >
                    <span class="subheading white--text">
                        Все записи островка {{ workingIsland.name }} на {{ date | moment('DD MMMM YYYY г.') }}
                    </span>
                    <v-spacer/>
                    <v-btn
                        outline
                        small
                        icon
                        flat
                        color="white"
                        @click="addMode = true"
                        :title="`Добавить запись на ${$moment(date).format('DD MMMM YYYY г.')}`"
                    >
                        <v-icon
                            small
                            color="white"
                        >
                            queue
                        </v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <event
                        v-for="(event, index) in events"
                        :key="`e${event.id}${index}`"
                        :event="event"
                        @delete="emitDelete(event)"
                    />
                </v-card-text>
            </v-card>
        </v-menu>
        <calendar-record-adder
            v-if="addMode"
            :date="date"
            :preset-hour="hour"
            @reset="addMode = false"
        />
    </div>
</template>
<script>
    import Event from './Event'
    import CalendarRecordAdder from './CalendarRecordAdder'
    export default {
        name: 'SingleModePeriod',
        props: ['date', 'hour'],
        data: () => ({
            addMode: false,
            display: false,
            periodDisplay: false
        }),
        computed: {
            dialogLocked () {
                return this.$store.state.appointment.dialogLocked
            },
            deleteMode () {
                return this.$store.state.appointment.deleteMode
            },
            textDate () {
                return this.$moment(this.date).format('DD MMMM YYYY г.')
            },
            appointments () {
                return this.$store.state.appointment.appointments
            },
            workingIsland () {
                return this.$store.getters.workingIsland
            },
            events () {
                return this.appointments && this.appointments.filter(item => item.date.split(' ')[0] === this.date && +item.date.split(' ')[1].split(':')[0] === +this.hour) || []
            }
        },
        methods: {
            periodClicked () {
                if (this.dialogLocked) {
                    return
                }
                this.addMode = true
            },
            emitDelete (event) {
                this.$emit('delete', event)
            }
        },
        watch: {
            display (val) {
                val ? this.$store.commit('LOCK_DIALOG') : this.$store.commit('UNLOCK_DIALOG')
            },
            periodDisplay (val) {
                val ? this.$store.commit('LOCK_DIALOG') : this.$store.commit('UNLOCK_DIALOG')
            }
        },
        components: {
            CalendarRecordAdder,
            Event
        }
    }
</script>
