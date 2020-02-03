<template>
    <v-card class="round-corner" width="1000px">
        <v-card-title class="light-blue darken-3">
            <span class="subheading white--text" style="font-weight: bold">
                Добавить запись на {{ date | moment('DD MMM YYYY г.')}}
            </span>
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
                                        Время записи на {{ editedAppointment.date | moment('DD MMM YYYY г.')}}
                                    </span>
                                </v-card-title>
                                <v-card-text>
                                    <v-time-picker v-model="time" format="24hr"/>
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
                    <v-flex xs12 sm6 md4>
                        <sub>Комментарий</sub>
                        <v-text-field
                            v-model="editedAppointment.comment"
                            label="Комментарий"
                        />
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
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
</template>
<script>
    export default {
        name: 'CalendarRecordAdder',
        props: ['date'],
        data: () => ({
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
                comment: null
            }
        }),
        computed: {
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
                    client_name: null,
                    comment: null
                }
            }
        },
        methods: {
            saveAppointment () {
                this.$validator.validate()
                    .then(res => {
                        if (!res) return
                        this.$store.dispatch('createAppointment', this.editedAppointment)
                            .then(res => {
                                let text = `Запись на ${res.data.created_at} добавлена`
                                this.$emit('message', {text: text, color: 'green'})
                                this.reset()
                            })
                    })
            },
            reset () {
                this.$emit('reset')
            }
        },
        mounted () {
            if (this.singleService) {
                this.editedAppointment.service_id = this.services[0].id
            }
            this.editedAppointment.user_id = this.$store.state.authUser.id
            this.editedAppointment.island_id = this.workingIslandId
            this.editedAppointment.date = this.date
        },
        watch: {
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
                this.editedAppointment.date += ` ${val}`
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
                this.editedAppointment.island_id === val
            }
        }
    }
</script>