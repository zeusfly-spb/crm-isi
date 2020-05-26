<template>
    <v-flex>
        <v-dialog
            v-model="active"
            max-width="1000px"
        >
            <v-card
                v-blur="loading "
                class="round-corner"
            >
                <v-card-title
                    class="light-blue darken-3"
                >
                    <span
                        class="white--text title"
                    >
                        <v-icon
                            color="white"
                        >
                            event_note
                        </v-icon>
                        Записи абонента
                        <span
                            class="customer-name"
                        >
                            {{ customerName }}
                        </span>
                        по абонементу
                        <span
                            class="subscribe-name"
                        >
                            "{{ subName }}"
                        </span> от
                        <span
                            class="start-date"
                        >
                            {{ startDate | moment('D MMMM YYYY г.') }}
                        </span>
                    </span>
                    <v-spacer/>
                    <v-icon
                        color="white"
                        class="clickable"
                        title="Закрыть"
                        @click="hideDialog"
                    >
                        close
                    </v-icon>
                </v-card-title>
                <v-card-text>
                    <v-btn
                            flat
                            dark
                            color="primary"
                            @click="addModeOn"
                    >
                        Назначить запись
                    </v-btn>
                    <v-container
                        grid-list-md
                    >
                        <v-layout
                            wrap
                        >
                            <v-flex xs3 sm2 md1
                                v-for="(item, index) in scale"
                                :key="index"
                            >
                                <v-icon
                                    large
                                    :color="eventColor(item)"
                                >
                                    event
                                </v-icon>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <calendar-record-adder
            v-if="addMode"
            :subscribe="subscribe"
            @reset="addModeOff"
        />
    </v-flex>
</template>

<script>
    import CalendarRecordAdder from '../appointments/CalendarRecordAdder'
    export default {
        name: 'SubscribeEvents',
        data: () => ({
            addMode: false
        }),
        computed: {
            loading () {
                return this.$store.state.subscribes.subscribesLoading
            },
            customerName () {
                return this.subscribe && this.subscribe.customer && this.subscribe.customer.full_name || ''
            },
            scale () {
                return this.subscribe && this.subscribe.scale || []
            },
            nominal () {
                return this.subscribe && this.subscribe.nominal || 0
            },
            subName () {
                return this.subscribe && this.subscribe.subscription &&this.subscribe.subscription.name || 'Абонемент'
            },
            startDate () {
                return this.subscribe && this.subscribe.start_date || ''
            },
            events () {
                return this.subscribe && this.subscribe.events || []
            },
            subscribe () {
                return this.$store.getters.eventsOpenSubscribe
            },
            active: {
                get () {
                    return !!this.eventsOpenId
                },
                set (val) {
                    !val ? this.$store.commit('SET_SUBSCRIBE_EVENTS_OPEN_ID', null) : null
                }
            },
            eventsOpenId () {
                return this.$store.state.subscribes.eventsOpenId
            }
        },
        methods: {
            eventColor (event) {
                if (!event) {
                    return 'grey lighten-2'
                }
                switch (event.status) {
                    case 'active':
                        return 'blue'
                    case 'completed':
                        return 'green'
                    case 'cancelled':
                        return 'red'
                    case 'postponed':
                        return 'orange accent-4'
                    case 'moderate':
                        return 'amber darken-3'
                }
            },
            addModeOff () {
                this.addMode = false
            },
            addModeOn () {
                this.addMode = true
            },
            hideDialog () {
                this.active = false
            }
        },
        components: {
            CalendarRecordAdder
        }
    }
</script>

<style scoped>
    .customer-name  {
        color: orange;
        font-weight: bolder;
    }
    .subscribe-name {
        color: yellow;
        font-weight: bold;
    }
    .start-date {
        color: orange;
        font-weight: bold;
        font-style: italic;
    }
</style>
