<template>
    <v-item-group
        class="mb-0 pb-0"
        draggable="true"
        :title="caption"

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
    </v-item-group>
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
        components: {
            Caller,
            EventEditor
        }
    }
</script>
