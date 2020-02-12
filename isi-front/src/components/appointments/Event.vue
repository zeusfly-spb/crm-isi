<template>
    <div
        class="mb-0 pb-0"
    >
        <v-icon
            color="blue"
        >
            event
        </v-icon>
        <span class="blue--text title">{{ event.date.split(' ')[1] }}</span>
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
        <v-icon
            color="red"
            class="clickable"
            title="Удалить запись"
            v-if="isSuperadmin"
            @click="$emit('delete')"
        >
            close
        </v-icon>
    </div>
</template>
<script>
    import Caller from '../leads/Caller'
    export default {
        name: 'Event',
        props: ['event'],
        data: () => ({
            eventToDelete: null
        }),
        computed: {
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            basePath () {
                return this.$store.state.basePath
            }
        },
        components: {
            Caller
        }
    }
</script>
