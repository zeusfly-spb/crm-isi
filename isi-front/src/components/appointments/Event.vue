<template>
        <div
            class="mb-0 pb-0 event"
            draggable="true"
            style="cursor: grab"
            :class="{'teal lighten-4': mouseOver}"
            :title="caption"
            @mouseover="mouseOver = true"
            @mouseleave="mouseOver = false"
            @dragstart="dragStart"
            @dragend="dragEnd"
        >
            <v-icon
                color="blue"
            >
                event
            </v-icon>
            <span class="blue--text title">{{ $store.state.appointment.displayTime(event.date.split(' ')[1]) }}</span>
            <span class="pl-1 pr-1">{{ event.service && event.service.description }}</span>
            <strong>Клиент:</strong>
            <span class="pl-1">{{ event.client_name }}</span>
            {{ event.client_phone | phone }}
            <caller :phone="event.client_phone"/>
            <strong>Исполнитель:</strong>
            &nbsp;
            <v-avatar
                size="36px"
                :title="event.performer.full_name"
            >
                <img :src="basePath + event.performer.avatar" alt="Фото" v-if="event.performer.avatar">
                <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
            </v-avatar>
            &nbsp;
            <v-chip>
                <v-icon
                    size="20"
                    color="green"
                    class="clickable"
                    title="Редактировать запись"
                    @click="editMode = true"
                >
                    edit
                </v-icon>
                <v-icon
                    size="20"
                    color="red"
                    class="clickable"
                    title="Удалить запись"
                    v-if="isSuperadmin"
                    @click="$store.commit('ATTEMPT_TO_DELETE_EVENT', event)"
                >
                    delete
                </v-icon>
            </v-chip>
            <event-editor
                :event="event"
                v-if="editMode"
                @close="editMode = false"
            />
        </div>
</template>
<script>
    import EventEditor from './EventEditor'
    import Caller from '../leads/Caller'
    export default {
        name: 'Event',
        props: ['event'],
        data: () => ({
            mouseOver: false,
            eventToDelete: null,
            editMode: false
        }),
        computed: {
            draggedEvent () {
                return this.$store.state.appointment.draggedEvent
            },
            dragTarget () {
                return this.$store.state.appointment.dragTarget
            },
            caption () {
                return `Запись на ${this.$moment(this.event.date).format('DD MMMM YYYY г. HH:mm')}`
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            basePath () {
                return this.$store.state.basePath
            }
        },
        methods: {
            dragEnd () {
                if (this.$store.getters.moveReady) {
                    this.$store.dispatch('moveEvent')
                }
            },
            dragStart (evt) {
                evt.dataTransfer.setData("Text", this.event.id)
                this.$store.commit('START_DRAG_EVENT', this.event)
                return false
            }
        },
        components: {
            Caller,
            EventEditor
        }
    }
</script>
<style>
    .event {
        display: flex;
        align-items: center;
    }
</style>
