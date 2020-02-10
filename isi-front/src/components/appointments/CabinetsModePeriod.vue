<template>
    <v-flex>
        <v-layout>
            <v-flex
                v-for="(cabinet, index) in cabinets"
                :key="index"
                :style="{width: `${columnWidth}px`}"
                style="border: 1px solid grey; vertical-align: top; display: flex; height: 70px"
                column
                align-content-start
            >
                &nbsp;
                <v-flex v-for="(event, index) in periodAppointments.filter(item => item.cabinet_id === cabinet.id)"
                     :key="index"
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
                    <v-avatar
                        size="36px"
                        :title="event.performer.full_name"
                    >
                        <img :src="basePath + event.performer.avatar" alt="Фото" v-if="event.performer.avatar">
                        <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
                    </v-avatar>
                </v-flex>
            </v-flex>
        </v-layout>
    </v-flex>
</template>
<script>
    import Caller from '../leads/Caller'
    export default {
        name: 'CabinetsModePeriod',
        props: ['cabinets', 'columnWidth', 'hour', 'date'],
        computed: {
            basePath () {
                return this.$store.state.basePath
            },
            names () {
                return this.cabinets.map(item => item.name)
            },
            appointments () {
                return this.$store.state.appointment.appointments
            },
            periodAppointments () {
                return this.appointments && this.appointments.filter(item => item.date.split(' ')[0] === this.date && +item.date.split(' ')[1].split(':')[0] === +this.hour) || []
            }
        },
        methods: {
            fieldClicked ({cabinet, hour}) {

            }
        },
        components: {
            Caller
        }
    }
</script>
