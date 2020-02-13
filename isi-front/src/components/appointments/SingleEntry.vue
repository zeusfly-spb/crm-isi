<template>
    <v-flex
        style="display: flex"
        @click.self="bodyClicked"
    >
        <event
            :event="firstEvent"
        />

    </v-flex>
</template>
<script>
    import Event from './Event'
    export default {
        name: 'SingleEntry',
        props: ['events', 'date', 'hour'],
        computed: {
            firstEvent () {
                return this.events[0]
            },
            bodyClicked () {
                this.$emit('addAttempt')
            }
        },
        components: {
            Event
        }
    }
</script>
