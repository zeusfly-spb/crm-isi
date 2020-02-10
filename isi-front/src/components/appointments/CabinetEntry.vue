<template>
    <v-flex>
        <event
            v-for="event in jetEvents"
            :key="event.id"
            :event="event"
            @delete="emitDelete(event)"
        />
    </v-flex>
</template>
<script>
    import Event from './Event'
    export default {
        name: 'CabinetEntry',
        props: ['events'],
        computed: {
            jetEvents () {
                return this.events
            }
        },
        methods: {
            emitDelete (event) {
                this.$emit('delete', event)
            }
        },
        components: {
            Event
        }
    }
</script>
