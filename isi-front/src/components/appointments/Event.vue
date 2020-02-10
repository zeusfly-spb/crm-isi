<template>
    <v-flex>
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
        <v-avatar
            size="36px"
            :title="event.performer.full_name"
        >
            <img :src="basePath + event.performer.avatar" alt="Фото" v-if="event.performer.avatar">
            <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
        </v-avatar>
    </v-flex>
</template>
<script>
    import Caller from '../leads/Caller'
    export default {
        name: 'Event',
        props: ['event'],
        computed: {
            basePath () {
                return this.$store.state.basePath
            }
        },
        components: {
            Caller
        }
    }
</script>
