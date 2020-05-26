<template>
    <v-flex>
        <v-dialog
            v-model="active"
            max-width="1000px"
        >
            <v-card
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
                    <v-container
                        grid-list-md
                    >
                        <v-layout
                            wrap
                        >
                            <v-flex xs3 sm2 md1
                                v-for="(item, index) in scale"
                            >
                                <v-icon
                                    large
                                    color="grey lighten-2"
                                >
                                    event
                                </v-icon>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
    export default {
        name: 'SubscribeEvents',
        computed: {
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
            hideDialog () {
                this.active = false
            }
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
