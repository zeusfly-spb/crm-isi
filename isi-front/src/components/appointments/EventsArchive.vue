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
                                <phone-viewer
                                        :phone="props.item.client_phone"
                                />
                                <caller
                                        :phone="props.item.client_phone"
                                />
                            </td>
                            <td>
                                <span
                                    v-if="props.item.last_comment"
                                    class="last-comment clickable"
                                    title="Открыть панель комментариев к записи"
                                    @click="openComments(props.item)"
                                >
                                    {{ props.item.last_comment }}
                                </span>
                            </td>
                            <td>
                                <user-avatar
                                        :user="props.item.performer"
                                />
                            </td>
                            <td>
                                {{ props.item.date | moment('D MMMM YYYY г. HH:mm') }}
                            </td>
                            <td>
                                <event-control-chip
                                    :event="props.item"
                                />
                            </td>
                        </template>
                        <template v-slot:no-data>
                            <span class="red--text text-md-center">Нет записей</span>
                        </template>
                    </v-data-table>
                </v-tab-item>
            </v-tabs-items>
        </v-tabs>
        <event-comments
            v-if="!!commentsOpenEvent"
        />
    </v-flex>
</template>
<script>
    import UserAvatar from "../main/UserAvatar";
    import PhoneViewer from "../main/PhoneViewer"
    import Caller from "../leads/Caller";
    import EventComments from "./EventComments";
    import EventControlChip from "./EventControlChip";
        export default {
        name: 'EventsArchive',
        data: () => ({
            currentIndex: 0,
            tabs: [
                {title: 'Отложенные', status: 'postponed', color: 'orange', icon: 'timelapse'},
                {title: 'На модерации', status: 'moderate', color: 'amber', icon: 'assignment_late'},
                {title: 'Отказ', status: 'cancelled', color: 'red', icon: 'event_busy'},
                {title: 'Завершенные', status: 'completed', color: 'green', icon: 'event_available'}
            ],
            headers: [
                {text: '#', value: null},
                {text: 'Услуга', value: 'service_id'},
                {text: 'Клиент', value: 'client_name'},
                {text: 'Телефон', value: 'client_phone'},
                {text: 'Комментарии', value: null},
                {text: 'Исполнитель', value: 'performer_id'},
                {text: 'Дата/Время', value: 'date'},
                {text: 'Действия', value: null}
            ]
        }),
        computed: {
            commentsOpenEvent () {
                return this.$store.getters.commentsOpenEvent
            },
            sliderColor () {
                return {0: 'orange', 1: 'amber', 2: 'red', 3: 'green'}[this.currentIndex]
            },
            basePath () {
                return this.$store.state.basePath
            },
            events () {
                return this.$store.state.appointment.appointments.reverse()
            }
        },
        methods: {
            openComments (event) {
                this.$store.commit('SET_ARCHIVE_COMMENTS_OPEN_ID', event.id)
            },
            setCurrentIndex (val) {
                this.currentIndex = val
            },
            statusEvents (status) {
                return this.events && this.events.filter(event => event.status === status)
            }
        },
        components: {
            PhoneViewer,
            UserAvatar,
            Caller,
            EventComments,
            EventControlChip
        }
    }
</script>

<style scoped>
    .last-comment:HOVER {
        color: #03A9F4;
    }
</style>
