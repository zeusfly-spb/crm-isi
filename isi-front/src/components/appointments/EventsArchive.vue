<template>
    <v-flex>
        <v-tabs
            fixed-tabs
            @change="setCurrentIndex"
        >
            <v-tabs-slider
                :color="sliderColor"
            />
            <v-tab
                v-for="(tab, index) in tabs"
                :key="index"
            >
                <v-icon
                    :color="tab.color"
                    class="mr-1"
                >
                    {{ tab.icon }}
                </v-icon>
                {{ tab.title }}
                <span
                    class="ml-1"
                    :class="`${tab.color}--text`"
                >
                    ({{ statusEvents(tab.status).length }})
                </span>
            </v-tab>
            <v-tabs-items touchless>
                <v-tab-item
                    v-for="tab in tabs"
                    :key="tab.status"
                >
                    <v-data-table
                        :headers="headers"
                        :items="statusEvents(tab.status)"
                        hide-actions
                        class="elevation-1"
                    >
                        <template v-slot:items="props">
                            <td>
                                {{ props.index + 1 }}
                            </td>
                            <td>
                                {{ props.item.service.description }}
                            </td>
                            <td>
                                {{ props.item.client_name }}
                            </td>
                            <td>
                                {{ props.item.client_phone | phone}}
                            </td>
                            <td>
                                <v-avatar
                                    size="36px"
                                    :title="props.item.performer.full_name"
                                >
                                    <img :src="basePath + props.item.performer.avatar" alt="Фото" v-if="props.item.performer.avatar">
                                    <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
                                </v-avatar>
                            </td>
                            <td>
                                {{ props.item.date | moment('D MMMM YYYY г. HH:mm') }}
                            </td>
                        </template>
                        <template v-slot:no-data>
                            <span class="red--text text-md-center">Нет записей</span>
                        </template>
                    </v-data-table>
                </v-tab-item>
            </v-tabs-items>
        </v-tabs>
    </v-flex>
</template>
<script>
    export default {
        name: 'EventsArchive',
        data: () => ({
            currentIndex: 0,
            tabs: [
                {title: 'Отмененные', status: 'cancelled', color: 'red', icon: 'event_busy'},
                {title: 'Завершенные', status: 'completed', color: 'green', icon: 'event_available'}
            ],
            headers: [
                {text: '#', value: null},
                {text: 'Услуга', value: 'service_id'},
                {text: 'Клиент', value: 'client_name'},
                {text: 'Телефон', value: 'client_phone'},
                {text: 'Исполнитель', value: 'performer_id'},
                {text: 'Дата/Время', value: 'date'},
            ]
        }),
        computed: {
            sliderColor () {
                return {0: 'red', 1: 'green'}[this.currentIndex]
            },
            basePath () {
                return this.$store.state.basePath
            },
            events () {
                return this.$store.state.appointment.appointments
            }
        },
        methods: {
            setCurrentIndex (val) {
                this.currentIndex = val
            },
            statusEvents (status) {
                return this.events && this.events.filter(event => event.status === status)
            }
        }
    }
</script>
