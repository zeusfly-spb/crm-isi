<template>
    <v-flex
        style="display: flex"
        @click.self="bodyClicked"
    >
        <event
            :event="firstEvent"
            @delete="emitDelete(firstEvent)"
        />

    </v-flex>
</template>
<script>
    import CalendarRecordAdder from './CalendarRecordAdder'
    import Event from './Event'
    export default {
        name: 'CabinetEntry',
        props: ['events', 'date', 'hour', 'cabinet'],
        data: () => ({
            extended: false,
            addMode: false
        }),
        computed: {
            firstEvent () {
                return this.events[0]
            }
        },
        methods: {
            bodyClicked () {
                this.$emit('addAttempt', this.cabinet)
            },
            emitDelete (event) {
                this.$emit('delete', event)
            }
        },
        components: {
            Event,
            CalendarRecordAdder
        }
    }
</script>
