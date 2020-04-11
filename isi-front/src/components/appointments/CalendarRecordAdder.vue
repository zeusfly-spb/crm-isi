<template>
    <v-dialog
        value="true"
        max-width="1000"
        @update:returnValue="deliverClose"
    >
    <v-card class="round-corner" width="1000px">
        <v-card-title class="light-blue darken-3">
            <span class="subheading white--text" style="font-weight: bold">
                Добавить запись {{ this.date ? 'на' : ''}}
                {{ date | moment('DD MMM YYYY г.')}}
            </span>
            <v-spacer/>
            <v-icon
                class="clickable"
                @click="reset"
                color="white"
                title="Закрыть"
            >
                close
            </v-icon>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                        <sub>Услуга</sub>
                        <v-select
                            v-model="editedAppointment.service_id"
                            :items="services"
                            item-text="description"
                            item-value="id"
                            single-line
                            data-vv-name="service"
                            data-vv-as="Услуга"
                            :readonly="singleService"
                            :error-messages="errors.collect('service')"
                            v-validate="'required'"
                        />
                    </v-flex>
                    <v-flex xs12 sm6 md4
                            v-if="hasCabinets"
                    >
                        <sub>Кабинет</sub>
                        <v-select
                            v-model="editedAppointment.cabinet_id"
                            :items="cabinets"
                            item-text="name"
                            item-value="id"
                            single-line
                            data-vv-name="cabinet"
                            data-vv-as="Кабинет"
                            :readonly="singleCabinet || !!presetCabinet"
                            :error-messages="errors.collect('cabinet')"
                            v-validate="hasCabinets ? 'required' : null"
                        />
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                        <sub>Исполнитель</sub>
                        <v-select
                            v-model="editedAppointment.performer_id"
                            :items="users"
                            item-text="full_name"
                            item-value="id"
                            single-line
                            data-vv-name="performer"
                            data-vv-as="Исполнитель"
                            :error-messages="errors.collect('performer')"
                            v-validate="'required'"
                        />
                    </v-flex>
                    <v-flex xs12 sm6 md4
                            v-if="!dateProp && leadDate"
                    >
                        <sub>Дата</sub>
                        <v-menu
                            :close-on-content-click="false"
                            :nudge-right="40"
                            lazy
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px"
                            v-model="menu"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                    :label="inputDate | moment('D MMMM YYYY г.')"
                                    prepend-inner-icon="event"
                                    readonly
                                    v-on="on"
                                />
                            </template>
                            <v-date-picker
                                no-title
                                scrollable
                                v-model="inputDate"
                                @change="datePicked"
                                locale="ru"
                                first-day-of-week="1"
                            />
                        </v-menu>

                    </v-flex>
                    <v-flex xs12 sm6 md4>
                        <sub>Время</sub>
                        <v-menu
                            v-model="timeMenu"
                            :close-on-content-click="false"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                    v-on="on"
                                    v-model="time"
                                    readonly
                                    data-vv-name="time"
                                    data-vv-as="Время"
                                    :error-messages="errors.collect('time')"
                                    v-validate="'required'"
                                />
                            </template>
                            <v-card>
                                <v-card-title class="light-blue darken-3">
                                    <span class="subheading white--text" style="font-weight: bold">
                                        Время записи на {{ editedAppointment.date | moment('DD MMM YYYY г.') }}
                                    </span>
                                </v-card-title>
                                <v-card-text>
                                    <v-time-picker
                                        v-model="time"
                                        format="24hr"
                                        :max="presetHour ? `${presetHour}:59` : '22:59'"
                                        :min="presetHour ? `${presetHour}:00` : '08:00'"
                                        @click:hour="setHour"
                                    />
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer/>
                                    <v-btn
                                        flat="flat"
                                        @click="time = null; timeMenu = false"
                                    >
                                        Отмена
                                    </v-btn>
                                    <v-btn
                                        color="green darken-1"
                                        flat="flat"
                                        @click="timeMenu = false"
                                        :disabled="!time"
                                    >
                                        Назначить
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-menu>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                        <sub>Клиент</sub>
                        <v-text-field
                            v-model="editedAppointment.client_name"
                            label="Имя"
                            data-vv-as="Имя клиента"
                            data-vv-name="client_name"
                            :error-messages="errors.collect('client_name')"
                            v-validate="'required'"
                        />
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                        <sub>Телефон</sub>
                        <v-text-field
                            v-model="editedAppointment.client_phone"
                            label="Номер телефона"
                            data-vv-as="Номер телефона клиента"
                            data-vv-name="client_phone"
                            :error-messages="errors.collect('client_phone')"
                            v-validate="'required|digits:10'"
                            mask="(###) ### - ####"
                        />
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer/>
            <v-btn
                flat="flat"
                @click="reset"
            >
                Отмена
            </v-btn>
            <v-btn
                color="green darken-1"
                flat="flat"
                @click="saveAppointment"
                :disabled="!services || !services.length"
            >
                Сохранить
            </v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>
</template>
<script>
    export default {
        name: 'CalendarRecordAdder',
        props: ['dateProp', 'presetHour', 'presetCabinet', 'lead'],
        data: () => ({
            menu: false,
            inputDate: null,
            timeMenu: false,
            time: null,
            editedAppointment: {
                user_id: null,
                performer_id: null,
                service_id: null,
                lead_id: null,
                island_id: null,
                client_phone: null,
                date: null,
                client_name: null,
                cabinet_id: null
            }
        }),
        computed: {
            leadDate () {
                if (!this.lead) {
                    return null
                }
                let createdDate = this.lead && this.lead.created_at.split(' ')[0] || null
                let lastPostponeDate = this.lead && this.lead.last_postpone && this.lead.last_postpone.date.split(' ')[0] || null
                let lastCommentDate = this.lead && this.lead.last_comment && this.lead.last_comment.created_at.split(' ')[0] || null
                let realDate = this.$store.state.realDate || null
                let dates = [createdDate, lastPostponeDate, lastCommentDate, realDate].filter(item => !!item)
                return dates.sort((a, b) => a < b ? 1 : a > b ? -1 : 0)[0]
            },
            date () {
                return this.dateProp || null
            },
            cabinets () {
                return this.workingIsland && this.workingIsland.cabinets || []
            },
            singleCabinet () {
                return this.hasCabinets && this.cabinets.length === 1
            },
            hasCabinets () {
                return this.workingIsland && this.workingIsland.cabinets.length
            },
            users () {
                return this.workingIsland && this.workingIsland.users || []
            },
            singleService () {
                return this.services && this.services.length === 1
            },
            services () {
                return this.workingIsland && this.workingIsland.services || []
            },
            workingIsland () {
                return this.$store.getters.workingIsland
            },
            workingIslandId () {
                return this.$store.state.workingIslandId
            },
            authUser () {
                return this.$store.state.authUser
            },
            blankAppointment () {
                return {
                    performer_id: null,
                    service_id: null,
                    lead_id: null,
                    island_id: this.$store.state.workingIslandId,
                    client_phone: null,
                    date: null,
                    time: null,
                    client_name: null
                }
            }
        },
        methods: {
            setHour (hour) {
                this.$store.commit('SET_ADDING_HOUR', hour)
            },
            datePicked () {
                this.menu = false
            },
            deliverClose (data) {
                if (!data) {
                    this.reset()
                }
            },
            saveAppointment () {
                this.$validator.validate()
                    .then(res => {
                        if (!res) return
                        let data = this.lead ? {... this.editedAppointment, lead_id: this.lead.id} : this.editedAppointment
                        this.$store.dispatch('createAppointment', data)
                            .then(res => {
                                let text = `Запись на ${this.$moment(res.data.date).format('DD MMMM YYYY г.')} добавлена`
                                if (this.lead) {
                                    this.$store.commit('SEND_LEAD_MESSAGE', {text: text, color: 'green'})
                                } else {
                                    this.$store.commit('SEND_EVENT_MESSAGE', {text: text, color: 'green'})
                                }
                                this.reset()
                            })
                    })
            },
            reset () {
                this.$emit('reset')
            },
            sidePanelControl () {
                if (this.$store.getters.currentPage !== 'appointments') {
                    this.$store.commit('SET_SIDE_PANEL_STATUS', {
                        status: true,
                        mode: 'events'
                    })
                }
            }
        },
        mounted () {
            this.sidePanelControl()
            if (this.lead) {
                this.inputDate = this.leadDate
                this.editedAppointment.client_name = this.lead.name
                this.editedAppointment.client_phone = this.lead.phone
            }
            if (this.singleService) {
                this.editedAppointment.service_id = this.services[0].id
            }
            if (this.singleCabinet) {
                this.editedAppointment.cabinet_id = this.cabinets[0].id
            }
            if (this.presetCabinet) {
                this.editedAppointment.cabinet_id = this.presetCabinet.id
            }
            this.editedAppointment.user_id = this.$store.state.authUser.id
            this.editedAppointment.island_id = this.workingIslandId
            this.editedAppointment.date = this.date
        },
        destroyed () {
            if (this.$store.getters.currentPage !== 'appointments') {
                this.$store.commit('SET_SIDE_PANEL_STATUS', {
                    status: false,
                    mode: null
                })
            }
            this.$store.commit('UNSET_ADDING_HOUR')
            this.$store.commit('UNSET_ADDING_CABINET_ID')
        },
        watch: {
            'editedAppointment.cabinet_id': function (val) {
                val ? this.$store.commit('SET_ADDING_CABINET_ID', val) : null
            },
            inputDate (val) {
                if (!val) {
                    this.time = null
                    return
                }
                this.editedAppointment.date = val
                this.$store.commit('SET_ADDING_DATE', val)
            },
            services (val) {
                if (val && val.length === 1) {
                    this.editedAppointment.service_id = this.services[0].id
                }
            },
            singleService (val) {
                if (val) {
                    this.editedAppointment.service_id = this.services[0].id
                }
            },
            time (val) {
                if (!val || !this.editedAppointment.date) {
                    return
                }
                this.editedAppointment.date = this.editedAppointment.date.split(' ')[0] + ` ${val}`
            },
            date (val) {
                if (!val) {
                    this.time = null
                    return
                }
                this.editedAppointment.date = val
            },
            authUser (val) {
                if (!val) {
                    return
                }
                this.editedAppointment.user_id = val.id
            },
            workingIslandId (val) {
                this.reset()
                if (!val) {
                    return
                }
                this.editedAppointment.island_id = val
            }
        }
    }
</script>
