<template>
    <v-flex class="cab-entry"
            :center="events < 2"
            style="display: flex; flex-direction: column"
    >
        <event
            :event="firstEvent"
            @delete="emitDelete(firstEvent)"
        />
        <div class="text-md-center mt-0 pt-0">
            <span
                v-if="events.length > 1"
                class="title blue--text clickable"
                @click="showAll"
                :title="`Показать все записи часа (${events.length})`"
            >
                + {{ `${events.length - 1}` }}
            </span>
        </div>
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
