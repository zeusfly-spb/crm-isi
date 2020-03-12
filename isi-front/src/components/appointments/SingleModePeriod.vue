<template>
    <div
        class="single-mode-period"
        :class="{'target': canDrop}"
        :style="{height: `${$parent.intervalHeight}px`}"
        :title="`Добавить запись на ${textDate} в ${hour}:**`"
        @click.self="periodClicked"
        @dragenter="dragEnter"
        @dragover="dragOver"
        @dragleave="dragLeave"
        @drop="dragDrop"
    >
        <v-menu
            v-model="display"
            v-if="hasEvents"
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
                    flat
                    round
                    :draggable="firstEvent.draggable"
                    title="Просмотр записи"
                    :style="{'cursor': !firstEvent.draggable ? 'pointer' : firstDragging ? 'grabbing' : 'grab'}"
                    :ripple="false"
                    :id="`first-${firstEvent.id}`"
                    v-on="on"
                    @dragstart="firstDragStart"
                    @dragend="firstDragEnd"
                    @dragenter="dragEnter"
                    @dragover="dragEnter"
                    @dragleave="dragEnter"
                    @mousedown="firstDragging = true"
                    @mouseup="firstDragging = false"
                    @contextmenu.prevent="firstRightClick"
                >
                    <v-icon
                        :color="firstEvent.icon.color"
                        class="ml-1"
                    >
                        {{ firstEvent.icon.type }}
                    </v-icon>
                    <span
                        class="green--text"
                    >
                            {{ $store.state.appointment.displayTime(firstEvent.date.split(' ')[1]) }}
                        </span>
                    <span
                        class="blue--text ml-1 mr-1"
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
            v-model="periodDisplay"
            v-if="events.length > 1"
            :close-on-content-click="false"
            :close-on-click="!addMode && !deleteMode"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
        >
            <template v-slot:activator="{ on }">
                <v-btn
                    style="margin: 0; padding: 0"
                    small
                    icon
                    v-on="on"
                    color="blue"
                    :title="`Показать все записи часа (${events.length})`"
                >
                        <span class="subheading white--text">
                            <strong>
                                + {{ `${events.length - 1}` }}
                            </strong>
                        </span>
                </v-btn>
            </template>
            <v-card
                class="round-corner teal lighten-5"
            >
                <v-card-title
                    class="light-blue darken-3 pt-0 pb-0"
                >
                    <span class="subheading white--text">
                        Все записи островка {{ workingIsland && workingIsland.name }} на {{ date | moment('DD MMMM YYYY г.') }} c {{ hour }}:00 до {{ hour }}:59
                    </span>
                    <v-spacer/>
                    <v-btn
                        outline
                        small
                        icon
                        flat
                        color="white"
                        @click="addMode = true"
                        :title="`Добавить запись на ${$moment(date).format('DD MMMM YYYY г.')}`"
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
                        @delete="emitDelete(event)"
                    />
                </v-card-text>
            </v-card>
        </v-menu>
        <calendar-record-adder
            v-if="addMode"
            :date-prop="date"
            :preset-hour="hour"
            @reset="addMode = false"
        />
        <event-context-menu
                v-if="hasEvents"
                v-model="contextMenu"
                :event="firstEvent"
                :selector="`#first-${firstEvent.id}`"
        />
    </div>
</template>
<script>
    import EventContextMenu from './EventContextMenu.vue'
    import Event from './Event'
    import CalendarRecordAdder from './CalendarRecordAdder'
    export default {
        name: 'SingleModePeriod',
        props: ['date', 'hour'],
        data: () => ({
            contextMenu: false,
            firstDragging: false,
            draggingOver: false,
            addMode: false,
            display: false,
            periodDisplay: false
        }),
        computed: {
            moveReady () {
                return this.$store.getters.moveReady
            },
            canDrop () {
                return this.draggingOver && +this.draggedEvent.hour !== +this.hour
            },
            draggedEvent () {
                return this.$store.state.appointment.draggedEvent
            },
            firstEvent () {
                const extend = (base) => {
                    base.draggable = base.status !== 'completed'
                    base.icon = {
                        type: {active: 'event', cancelled: 'event_busy', completed: 'event_available'}[base.status],
                        color: {active: 'blue', cancelled: 'red', completed: 'green'}[base.status]
                    }
                    return base
                }
                return this.hasEvents && extend(this.events[0])
            },
            hasEvents () {
                return this.events.length
            },
            dialogLocked () {
                return this.$store.state.appointment.dialogLocked
            },
            deleteMode () {
                return this.$store.state.appointment.deleteMode
            },
            textDate () {
                return this.$moment(this.date).format('DD MMMM YYYY г.')
            },
            appointments () {
                return this.$store.state.appointment.appointments
            },
            workingIsland () {
                return this.$store.getters.workingIsland
            },
            events () {
                let base = this.appointments && this.appointments.filter(item => item.date.split(' ')[0] === this.date && +item.date.split(' ')[1].split(':')[0] === +this.hour) || []
                return base.sort(this.$store.state.appointment.sortByDateTime)
            }
        },
        methods: {
            dialogLockControl (val) {
                val ? this.$store.commit('LOCK_DIALOG') : this.$store.commit('UNLOCK_DIALOG')
            },
            firstRightClick () {
                if (!this.dialogLocked) {
                    this.contextMenu = true
                }
            },
            dragDrop (evt) {
                evt.preventDefault()
                evt.dataTransfer.dropEffect = "move"
                this.draggingOver = false
            },
            firstDragEnd () {
                this.firstDragging = false
                if (this.moveReady) {
                    this.$store.dispatch('moveEvent')
                }
            },
            dragLeave (evt) {
                evt.preventDefault()
                this.draggingOver = false
            },
            dragOver (evt) {
                evt.preventDefault()
            },
            dragEnter (evt) {
                this.draggingOver = true
                this.$store.commit('SET_DRAG_TARGET', {
                    cabinet: null,
                    cabinet_id: null,
                    date: this.date,
                    hour: this.hour
                })
                evt.dataTransfer.effectAllowed = "move"
            },
            firstDragStart (evt) {
                this.firstDragging = true
                evt.dataTransfer.setData("Text", this.firstEvent.id)
                this.$store.commit('SET_DRAG_EVENT', this.firstEvent)
                return false
            },
            periodClicked () {
                if (this.dialogLocked) {
                    return
                }
                this.addMode = true
            },
            emitDelete (event) {
                this.$emit('delete', event)
            }
        },
        watch: {
            contextMenu (val) {
                this.dialogLockControl(val)
            },
            display (val) {
                this.dialogLockControl(val)
            },
            periodDisplay (val) {
                this.dialogLockControl(val)
            }
        },
        components: {
            CalendarRecordAdder,
            Event,
            EventContextMenu
        }
    }
</script>
<style scoped>
    .disabled {
        color: darkgray!important;
        cursor: not-allowed;
    }
    .v-btn{
        text-transform: none!important;
    }
    .v-btn__content {
           padding: .5em!important;
           margin: .5em!important;
    }
    .v-btn:hover:before {
        background-color: transparent!important;
        border: 2px solid black;
    }
    .v-btn:focus:before {
        background-color: transparent!important;
        border: 2px solid black;
    }
    .context-menu {
        cursor: default;
    }
    .target {
        border: 3px solid green;
    }
    .single-mode-period {
        width: 100%;
        height: 100%;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
</style>
