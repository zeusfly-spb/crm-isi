<template>
    <v-flex>
        <span
            v-if="lastPostpone"
            @click="activate"
            class="clickable last-postpone"
            title="Открыть календарь переноса звонков по заявке"
        >
            {{ lastPostpone.date | moment('DD MMMM YYYY г. HH:mm') }}
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
            max-width="800"
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
                        @click:date="selectDate"
                    >
                        <template v-slot:day="{ date }">
                            <v-menu
                                :value="date === openDate"
                                :close-on-content-click="false"
                            >
                                <template v-slot:activator="{ on }">
                                    <div v-on="on"></div>
                                </template>
                                <v-card>
                                    <v-card-title class="light-blue darken-3">
                                        <span class="subheading white--text" style="font-weight: bold">
                                            Время перезвона на {{ openDate | moment('DD MMM YYYY г.')}}
                                        </span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-time-picker v-model="selectedTime" format="24hr"/>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            flat="flat"
                                            @click="resetSelected"
                                        >
                                            Отмена
                                        </v-btn>
                                        <v-btn
                                            color="green darken-1"
                                            flat="flat"
                                            @click="savePostpone"
                                        >
                                            Назначить
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-menu>
                            <template v-for="postpone in postponesMap[date]">
                                <v-sheet
                                    color="blue"
                                    class="white--text pa-1 mb-1"
                                    :title="`${postpone && postpone.user && postpone.user.full_name ? 'Добавлено пользователем ' + postpone.user.full_name : 'Добавлено системой'}`"
                                >
                                    {{ postpone.time.split(':').slice(0, 2).join(':') }}
                                </v-sheet>
                            </template>
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
            calendar: null,
            openDate: null,
            selectedTime: null
        }),
        computed: {
            lastPostpone () {
                return this.lead.last_postpone
            },
            postpones () {
                let base = this.lead.postpones
                return base.map(item => ({
                    created_at: item.created_at,
                    user: item.user,
                    date: item.date.split(' ')[0],
                    time: item.date.split(' ')[1],
                    open: false
                }))
            },
            postponesMap () {
                const map = {}
                this.postpones.forEach(e => (map[e.date] = map[e.date] || []).push(e))
                return map
            }
        },
        methods: {
            resetSelected () {
                this.openDate = null
                this.selectedTime = null
            },
            activate () {
                this.active = true
            },
            selectDate (data) {
                if (data.past) {
                    this.$emit('message', 'Невозможно назначить звонок на дату в прошлом!', 'red')
                    return
                }
                this.openDate = data.date
            },
            savePostpone () {
                if (!this.openDate) return
                let time = !!this.selectedTime ? this.selectedTime + ':00' : '00:00:00'
                this.$store.dispatch('addLeadPostpone', {
                    lead_id: this.lead.id,
                    date: this.openDate,
                    time: time
                })
                    .then(() => {
                        this.resetSelected()
                        this.$emit('message', 'Заявке назначен перезвон', 'green')
                    })
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
        opacity: .8;
    }
    .last-postpone:hover {
        opacity: 1;
        color: #263238;
    }
</style>
