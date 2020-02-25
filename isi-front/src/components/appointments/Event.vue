<template>
        <div
            class="mb-0 pb-0"
            draggable="true"
            style="cursor: grab"
            :title="caption"
            @dragstart="dragStart"
            @dragend="dragEnd"
        >
            <v-icon
                color="blue"
            >
                event
            </v-icon>
            <span class="blue--text title">{{ $store.state.appointment.displayTime(event.date.split(' ')[1]) }}</span>
            {{ event.service && event.service.description }}
            <strong>Клиент:</strong> {{ event.client_name }}
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
                if (this.draggedEvent && this.dragTarget && (this.dragTarget.hour !== this.hour || this.dragTarget.cabinet !== this.cabinet)) {
                    let minutes = this.draggedEvent.date.split(' ')[1].split(':')[1]
                    this.$store.dispatch('moveEvent', {
                        event_id: this.draggedEvent.id,
                        cabinet_id: this.dragTarget.cabinet.id,
                        date: this.dragTarget.date,
                        hour: this.dragTarget.hour
                    })
                        .then(() => {
                            let text = `Запись перенесена в кабинет ${this.dragTarget.cabinet.name} на ${this.$moment(this.dragTarget.date + ' ' + this.dragTarget.hour + ':' + minutes)
                                .format('DD MMMM YYYY г. HH:mm')}`
                            this.$store.commit('SEND_EVENT_MESSAGE', {text: text, color: 'green'})
                        })
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
