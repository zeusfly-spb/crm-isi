<template>
    <v-flex class="cab-entry"
            :center="events < 2"
            style="display: flex; flex-direction: column"
    >
        <event
            :event="firstEvent"
            @delete="emitDelete(firstEvent)"
        />
        <div
            class="text-md-center mt-0 pt-0"
            v-if="events.length > 1"
        >


            <v-menu
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                :min-width="`${$parent.columnWidth}`"
                v-model="extended"
            >
                <template v-slot:activator="{ on }">
                    <span
                        class="subheading blue--text clickable"
                        v-on="on"
                        :title="`Показать все записи часа (${events.length})`"
                    >
                        + {{ `${events.length - 1}` }}
                    </span>
                </template>
                <v-card
                    class="round-corner"
                >
                    <v-card-title
                        class="light-blue darken-3"
                    >
                        <span class="subheading white--text">
                            Все записи в кабинет "{{ cabinet.name }}" на {{ date | moment('DD MMMM YYYY г.') }}
                            c <em>{{ hour }}:00</em> до <em>{{ hour }}:59</em>
                        </span>
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
    </v-flex>
</template>
<script>
    import Event from './Event'
    export default {
        name: 'CabinetEntry',
        props: ['events', 'date', 'hour', 'cabinet'],
        data: () => ({
            extended: false
        }),
        computed: {
            firstEvent () {
                return this.events[0]
            }
        },
        methods: {
            showAll () {
                this.extended = true
            },
            emitDelete (event) {
                this.$emit('delete', event)
            }
        },
        components: {
            Event
        }
    }
</script>
