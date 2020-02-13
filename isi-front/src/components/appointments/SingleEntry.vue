<template>
    <v-flex
        style="display: flex"
        @click.self="bodyClicked"
    >
        <event
            :event="firstEvent"
        />
        <div
            class="text-md-center mt-0 pt-0 mr-2"
            v-if="events.length > 1"
        >
            <v-menu
                :close-on-click="!addMode"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
            >
                <template v-slot:activator="{ on }">
                    <v-btn
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
                <v-card class="round-corner">
                    <v-card-title
                        class="light-blue darken-3 pt-0 pb-0"
                    >
                        <span class="subheading white--text">
                            Все записи островка {{ workingIsland.name }} на {{ date | moment('DD MMMM YYYY г.') }}
                            c <em>{{ hour }}:00</em> до <em>{{ hour }}:59</em>
                        </span>
                        <v-spacer/>
                        <v-btn
                            outline
                            small
                            icon
                            flat
                            color="white"
                            @click="addMode = true"
                            :title="`Добавить запись на ${this.$moment(date).format('DD MMMM YYYY г.')}`"
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
                            v-for="event in events"
                            :key="event.id"
                            :event="event"
                            @delete="emitDelete(event)"
                        />
                    </v-card-text>
                </v-card>
            </v-menu>
        </div>
        <cabinet-record-adder
            v-if="addMode"
            @reset="addMode = false"
            :preset-hour="hour"
        />
    </v-flex>
</template>
<script>
    import CabinetRecordAdder from './CalendarRecordAdder'
    import Event from './Event'
    export default {
        name: 'SingleEntry',
        props: ['events', 'date', 'hour'],
        data: () => ({
            addMode: false
        }),
        computed: {
            firstEvent () {
                return this.events[0]
            },
            workingIsland () {
                return this.$store.getters.workingIsland
            }
        },
        methods: {
            bodyClicked () {
                this.$emit('addAttempt')
            },
            emitDelete (event) {
                this.$emit('delete', event)
            }
        },
        components: {
            Event,
            CabinetRecordAdder
        }
    }
</script>
