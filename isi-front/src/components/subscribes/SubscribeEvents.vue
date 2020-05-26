<template>
    <v-flex>
        <v-dialog
            v-model="active"
            max-width="800px"
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
                        Записи абонемента
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
                    Записи
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
    export default {
        name: 'SubscribeEvents',
        computed: {
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
    .subscribe-name {
        color: yellow;
        font-weight: bold;
    }
    .start-date {
        color: orange;
        font-weight: bold;
    }
</style>
