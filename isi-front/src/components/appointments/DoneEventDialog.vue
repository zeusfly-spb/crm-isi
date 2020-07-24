<template>
    <v-flex>
        <v-dialog
                v-model="confirm"
                max-width="1000px"
        >
            <v-card
                    class="round-corner"
            >
                <v-card-title class="light-blue darken-3">
                    <span class="title white--text">Изменение статуса записи на "Завершено"</span>
                </v-card-title>
                <v-card-text>
                    Завершить запись от <strong>{{ eventToDoneInfo.textDate }}</strong> клиента <strong>{{ eventToDoneInfo.clientName }}</strong>
                    по услуге <strong>{{ eventToDoneInfo.service }}</strong> сделкой:
                    <v-select
                            v-model="eventDoneDealId"
                            :items="currentDeals"
                            item-text="info"
                            item-value="id"
                            single-line
                            data-vv-name="deal"
                            data-vv-as="Сделка"
                            :error-messages="errors.collect('deal')"
                            v-validate="'required'"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="closeEventDoneConfirm">Отмена</v-btn>
                    <v-btn color="green darken-1"
                           flat
                           :disabled="!eventDoneDealId"
                           @click="doneEvent"
                    >
                        Изменить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
    export default {
        name: 'DoneEventDialog',
        data: () => ({
            eventDoneDealId: null
        }),
        computed: {
            currentDeals () {
                let base = this.$store.getters.currentDeals
                    .filter(deal => !deal.has_appointment)
                return base.map(deal => ({
                    ...deal,
                    info: `${deal.user.full_name} * ${deal.action.text} * ${deal.customer.full_name} * ${deal.insole.name}`
                }))
            },
            eventToDone () {
                return this.$store.state.appointment.eventToDone
            },
            eventToDoneInfo () {
                const eventDate = () => this.$moment(this.eventToDone.date).format('D MMMM YYYY г. H:m')
                const serviceName = () => this.eventToDone.service.description
                let textDate = this.eventToDone && this.eventToDone.date ? eventDate() : ''
                let clientName = this.eventToDone && this.eventToDone.client_name || ''
                let service = this.eventToDone && this.eventToDone.service && serviceName() || ''
                return {
                    textDate: textDate,
                    clientName: clientName,
                    service: service
                }
            },
            eventDoneConfirm () {
                return this.$store.state.appointment.eventDoneConfirm
            },
            confirm: {
                get () {
                    return this.eventDoneConfirm && !!this.eventToDone
                },
                set (val) {
                    if (!val) {
                        this.eventDoneDealId = null
                        this.$store.commit('SET_EVENT_TO_DONE', null)
                        this.$store.commit('SET_EVENT_DONE_CONFIRM', false)
                    }
                }
            },
        },
        methods: {
            doneEvent () {
                const makeAction = () => {
                    this.$store.dispatch('changeEventStatus', {
                        event_id: this.eventToDone.id,
                        status: 'completed',
                        deal_id: this.eventDoneDealId
                    })
                        .then(() => {
                            this.confirm = false
                            let text = `Статус записи изменен на "Завершена"`
                            this.$store.commit('SEND_EVENT_MESSAGE', {color: 'green', text: text})
                        })
                }
                this.$validator.validate()
                    .then(res => res ? makeAction() : null)
            },
            closeEventDoneConfirm () {
                this.eventDoneDealId = null
                this.$store.commit('SET_EVENT_TO_DONE', null)
                this.$store.commit('SET_EVENT_DONE_CONFIRM', false)
            }
        },
        watch: {
            confirm () {
                this.$validator.pause()
                this.$nextTick(() => {
                    this.$validator.errors.clear()
                    this.$validator.fields.items.forEach(field => field.reset())
                    this.$validator.fields.items.forEach(field => this.errors.remove(field))
                    this.$validator.resume()
                })
            },
        }
    }
</script>

