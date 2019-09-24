<template>
    <v-flex>
        <span
            v-if="lastPostpone"
            @click="activate"
            class="clickable last-postpone"
            title="Открыть календарь переноса звонков по заявке"
        >
            {{ lastPostpone.date | moment('DD MMMM YYYY г. HH:mm:ss') }}
        </span>
        <v-icon
            v-else
            @click="activate"
            class="clickable"
            title="Добавить дату перезвона по заявке"
        >
            phone_forwarded
        </v-icon>
        <v-dialog
            v-model="active"
            max-width="700"
            persistent
        >
            <v-card>
                <v-card-title
                    class="light-blue darken-3"
                >
                    <span
                        class="title white--text"
                    >
                        Календарь переноса звонков по заявке с номера {{ lead.phone | phone }}
                    </span>
                </v-card-title>
                <v-card-text>
                    <v-calendar
                        type="month"
                        locale="ru"
                        :weekdays="[1,2,3,4,5,6,0]"
                        ref="calendar"
                        v-model="newDate"
                    >
                        <template v-slot:day="{ date }">

                        </template>
                    </v-calendar>
                    <v-layout>
                        <v-btn
                            icon
                            title="Предыдущий месяц"
                            @click="calendar.prev()"
                        >
                            <v-icon>
                                keyboard_arrow_left
                            </v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                            icon
                            title="Следующий месяц"
                            @click="calendar.next()"
                        >
                            <v-icon>
                                keyboard_arrow_right
                            </v-icon>
                        </v-btn>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="active = false">Закрыть</v-btn>
                    <v-btn color="green darken-1"
                           flat
                           v-if="adding"
                           @click="addPostpone"
                    >
                        Добавить
                    </v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
    </v-flex>
</template>
<script>
    export default {
        name: 'LeadPostpones',
        props: ['lead'],
        data: () => ({
            active: false,
            newDate: null,
            adding: false,
            calendar: null
        }),
        computed: {
            lastPostpone () {
                return this.lead.last_postpone
            },
            postpones () {
                let base = this.lead.postpones
                return base.map(item => ({...item, date: item.date.split(' ')[0]}))
            },
            postponesMap () {
                const map = {}
                this.postpones.forEach(e => (map[e.date] = map[e.date] || []).push(e))
                return map
            }
        },
        methods: {
            activate () {
                this.active = true
                if (!this.lastPostpone) {
                    this.adding = false
                }
            },
            addPostpone () {

            }
        },
        mounted () {
            this.calendar = this.$refs.calendar
        }
    }
</script>
<style scoped>
    .clickable {
        opacity: .8;
    }
    .clickable:hover {
        opacity: 1;
    }
    .last-postpone {
        cursor: pointer;
    }
    .last-postpone:hover {
        font-weight: bold;
    }
</style>
