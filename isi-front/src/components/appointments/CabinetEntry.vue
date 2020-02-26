<template>
    <div
        class="cabinet-entry"
        :style="{width: `${fieldWidth}px`, height: `${fieldHeight}px`, border: canDrop ? '3px solid green' : '1px solid lightgray'}"
        :title="`Добавить запись на ${hour}:__ в кабинет ${cabinet.name}`"
        @click.self="bodyClicked"
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @dragover="dragOver"
        v-on:drop="dragDrop"
    >
        <v-menu
            v-if="hasEvents"
            v-model="firstDisplayed"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
        >
            <template v-slot:activator="{ on }">
                <v-btn
                    round
                    flat
                    small
                    draggable="true"
                    style="margin: 3px; padding: 3px"
                    title="Просмотр записи"
                    :style="{'cursor': firstDragging ? 'grabbing' : 'grab'}"
                    :disabled="listDisplayed"
                    :ripple="false"
                    v-on="on"
                    @dragstart="firstDragStart"
                    @dragend="firstDragEnd"
                    @dragenter="dragEnter"
                    @dragover="dragEnter"
                    @dragleave="dragEnter"
                >
                    <v-icon
                        color="blue"
                        ref="firstIcon"
                    >
                        event
                    </v-icon>
                    <span
                        class="green--text"
                    >
                    {{ displayTime(firstEvent.date.split(' ')[1]) }}
                </span>
                    <span
                        class="blue--text ml-1"
                    >
                    {{ firstEvent.client_name }}
                </span>
                </v-btn>
            </template>
            <div
                class="teal lighten-5"
            >
                <event
                    :event="firstEvent"
                />
            </div>
        </v-menu>
        <v-menu
            v-if="hasMultiplyEvents"
            v-model="listDisplayed"
            :close-on-content-click="false"
            :close-on-click="!$parent.addMode && !eventToDelete"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
        >
            <template v-slot:activator="{ on }">
                <v-btn
                    small
                    icon
                    color="blue"
                    style="margin: 0; padding: 0;"
                    :title="`Показать все записи часа (${events.length})`"
                    :disabled="firstDisplayed"
                    v-on="on"
                >
                    <span
                        class="subheading white--text"
                    >
                        <strong>+{{ events.length - 1 }}</strong>
                    </span>
                </v-btn>
            </template>
            <v-card
                class="round-corner teal lighten-5"
            >
                <v-card-title
                    class="light-blue darken-3 pt-0 pb-0"
                >
                    <span
                        class="subheading white--text"
                    >
                        Все записи в кабинет {{ cabinet.name }} на {{ date | moment('DD MMMM YYYY г.') }} c <em>{{ hour }}:00</em> до <em>{{ hour }}:59</em>
                    </span>
                    <v-spacer/>
                    <v-btn
                        outline
                        small
                        icon
                        flat
                        color="white"
                        :title="`Добавить запись на ${$moment(date).format('DD MMMM YYYY г.')}`"
                        @click="emitAddAttempt"
                    >
                        <v-icon
                            small
                            color="white"
                        >
                            queue
                        </v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <event
                        v-for="(event, index) in events"
                        :key="`e${event.id}${index}`"
                        :event="event"
                    />
                </v-card-text>
            </v-card>
        </v-menu>
    </div>
</template>
<script>
    import Event from './Event'
    export default {
        name: 'CabinetEntry',
        props: ['cabinet', 'events', 'date', 'hour', 'fieldWidth', 'fieldHeight'],
        data: () => ({
            dropped: false,
            canDrop: false,
            firstDragging: false,
            firstDisplayed: false,
            listDisplayed: false
        }),
        computed: {
            moveReady () {
                return this.$store.getters.moveReady
            },
            dragTarget () {
                return this.$store.state.appointment.dragTarget
            },
            draggedEvent () {
                return this.$store.state.appointment.draggedEvent
            },
            eventToDelete () {
                return this.$store.state.appointment.eventToDelete
            },
            displayTime () {
                return this.$store.state.appointment.displayTime
            },
            hasMultiplyEvents () {
                return this.hasEvents && this.events.length > 1
            },
            hasEvents () {
                return this.events.length
            },
            firstEvent () {
                return this.events[0]
            }
        },
        methods: {
            dragOver (evt) {
                evt.preventDefault()
            },
            dragDrop (evt) {
                evt.preventDefault()
                evt.dataTransfer.dropEffect = "move"
                this.canDrop = false
            },
            dragEnter (evt) {
                this.canDrop = true
                this.$store.commit('SET_DRAG_TARGET', {cabinet: this.cabinet, date: this.date, hour: this.hour})
                evt.dataTransfer.effectAllowed = "move"
            },
            dragLeave (evt) {
                evt.preventDefault()
                this.canDrop = false
            },
            firstDragStart (evt) {
                evt.dataTransfer.setData("Text", this.firstEvent.id)
                this.firstDragging = true
                this.$store.commit('SET_DRAG_EVENT', this.firstEvent)
                return false
            },
            firstDragEnd () {
                this.dropped = true
                this.firstDragging = false
                if (this.moveReady) {
                    this.$store.dispatch('moveEvent')
                }
            },
            emitAddAttempt () {
                this.$emit('addAttempt', this.cabinet)
            },
            bodyClicked () {
                this.$emit('fieldClicked', this.cabinet)
            }
        },
        watch: {
            hasMultiplyEvents (val) {
                if (!val) {
                    this.listDisplayed = false
                }
            },
            firstDisplayed (val) {
                val ? this.$store.commit('LOCK_DIALOG') : this.$store.commit('UNLOCK_DIALOG')
            },
            listDisplayed (val) {
                val ? this.$store.commit('LOCK_DIALOG') : this.$store.commit('UNLOCK_DIALOG')
            }
        },
        components: {
            Event
        }
    }
</script>
<style>
    .cabinet-entry {
        padding: 0;
        margin: 0;
        border: 1px solid lightgray;
        display: flex;
        cursor: pointer;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;
    }
</style>
