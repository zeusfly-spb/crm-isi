<template>
    <v-flex>
        <event
            :event="firstEvent"
            @delete="emitDelete(firstEvent)"
        />
        <p class="text-md-center mt-0 pt-0">
            <v-icon
                class="mt-0 pt-0"
                v-if="events.length > 1"
                color="blue"
                @click="showAll"
                :title="`Показать все записи часа (${events.length})`"
            >
                more_horiz
            </v-icon>
        </p>

    </v-flex>
</template>
<script>
    import Event from './Event'
    export default {
        name: 'CabinetEntry',
        props: ['events', 'date', 'hour'],
        computed: {
            firstEvent () {
                return this.events[0]
            }
        },
        methods: {
            showAll () {

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
