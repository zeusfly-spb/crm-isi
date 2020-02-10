<template>
    <v-flex>
        <event
            v-for="event in jetEvents"
            :key="event.id"
            :event="event"
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
        components: {
            Event
        }
    }
</script>
