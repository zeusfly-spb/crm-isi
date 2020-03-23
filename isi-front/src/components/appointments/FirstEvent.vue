<template>
    <span>
        <v-btn
            flat
            round
            outline
            v-if="!display"
            :draggable="event.draggable"
            title="Показать подробности"
            :style="{'cursor': !event.draggable ? 'pointer' : dragging ? 'grabbing' : 'grab'}"
            :ripple="false"
            :id="`first-${event.id}`"
            @click="show"
            @dragstart="dragStart"
            @dragend="dragEnd"
            @dragenter="dragEnter"
            @dragover="dragEnter"
            @dragleave="dragEnter"
            @mousedown="dragging = true"
            @mouseup="dragging = false"
            @contextmenu.prevent="menu = true"
        >
            <v-icon
                :color="event.icon.color"
                class="ml-1"
            >
                {{ event.icon.type }}
            </v-icon>
            <span
                class="green--text"
            >
                    {{ $store.state.appointment.displayTime(event.date.split(' ')[1]) }}
                </span>
            <span
                class="blue--text ml-1 mr-1"
            >
                    {{ event.client_name }}
            </span>
            <v-avatar
                size="28px"
                class="mr-1"
                :title="event.performer.full_name"
            >
                <img :src="basePath + event.performer.avatar" alt="Фото" v-if="event.performer.avatar">
                <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
            </v-avatar>
        </v-btn>
        <v-expand-x-transition>
            <v-chip
                disabled
                outline
                style="height: 40px; border: 1px solid lightgrey"
                v-if="display"
            >
                <event
                    first
                    :event="event"
                    @hide="display = false"
                />
                <v-icon
                    color="grey lighten-1"
                    class="clickable"
                    title="Скрыть подробности"
                    @click="hide"
                >
                    cancel
                </v-icon>
            </v-chip>
        </v-expand-x-transition>
        <event-context-menu
            v-model="menu"
            :selector="`#first-${event.id}`"
            :event="event"
        />
    </span>
</template>
<script>
    import EventContextMenu from './EventContextMenu'
    import Event from './Event'
    export default {
        name: 'FirstEvent',
        props: ['event'],
        data: () => ({
            menu: false,
            display: false,
            dragging: false,
            contextMenu: false
        }),
        computed: {
            displayedEvent: {
                get () {
                    return this.$store.state.appointment.displayedEvent
                },
                set (val) {
                    this.$store.commit('SET_DISPLAYED_EVENT', val)
                }
            },
            moveReady () {
                return this.$store.getters.moveReady
            },
            dialogLocked () {
                return this.$store.state.appointment.dialogLocked
            },
            basePath () {
                return this.$store.state.basePath
            }
        },
        methods: {
            dialogLockControl (val) {
                val ? this.$store.commit('LOCK_DIALOG') : this.$store.commit('UNLOCK_DIALOG')
            },
            show () {
                this.$store.commit('SET_DISPLAYED_EVENT', this.event)
                this.display = true
            },
            hide () {
                this.$store.commit('UNSET_DISPLAYED_EVENT')
                this.display = false
            },
            dragEnter (evt) {
                this.$emit('drag-enter', evt)
            },
            dragStart (evt) {
                this.dragging = true
                evt.dataTransfer.setData("Text", this.event.id)
                this.$store.commit('SET_DRAG_EVENT', this.event)
                return false
            },
            dragEnd () {
                this.dragging = false
                if (this.moveReady) {
                    this.$store.dispatch('moveEvent')
                }
            }
        },
        mounted () {
            if (!this.displayedEvent) {
                return
            }
            this.display = +this.displayedEvent.id === +this.event.id
        },
        watch: {
            menu (val) {
                this.dialogLockControl(val)
            }
        },
        components: {
            Event,
            EventContextMenu
        }
    }
</script>
<style scoped>
    .v-btn{
        text-transform: none!important;
        border: 1px solid lightgrey!important;
    }
    .v-btn__content {
        padding: .5em!important;
        margin: .5em!important;
    }
    .v-btn:hover:before {
        background-color: transparent!important;
        border: 1px solid black;
    }
    .v-btn:focus:before {
        background-color: transparent!important;
        border: 1px solid black;
    }
</style>
