<template>
    <div>
        <v-btn
            flat
            color="primary"
            @click="show"
        >
            Добавить абонемент
        </v-btn>
        <v-dialog
            v-model="active"
            max-width="1000"
        >
            <v-card
                class="round-corner"
            >
                <v-card-title
                    class="light-blue darken-3"
                >
                    <span
                        class="white--text title"
                    >
                        Новый абонемент
                    </span>
                    <v-spacer/>
                    <v-icon
                        class="clickable"
                        color="white"
                        @click="hide"
                    >
                        close
                    </v-icon>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md4>
                                <sub>Название</sub>
                                <v-text-field
                                    v-if="active"
                                    autofocus
                                    v-model="newSubscription.name"
                                    data-vv-as="Название"
                                    data-vv-name="name"
                                    :error-messages="errors.collect('name')"
                                    v-validate="'required|max:20'"
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <sub>Услуга</sub>
                                <v-select
                                    v-model="newSubscription.service_id"
                                    :items="services"
                                    item-text="description"
                                    item-value="id"
                                    single-line
                                    data-vv-name="service"
                                    data-vv-as="Услуга"
                                    :error-messages="errors.collect('service')"
                                    v-validate="'required'"
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <sub>Количество дней</sub>
                                <v-text-field
                                    v-model="newSubscription.number_days"
                                    type="number"
                                    data-vv-as="Количество дней"
                                    data-vv-name="number_days"
                                    :error-messages="errors.collect('number_days')"
                                    v-validate="'required'"
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <sub>Количество приемов</sub>
                                <v-text-field
                                    v-model="newSubscription.supply_amount"
                                    type="number"
                                    data-vv-as="Количество приемов"
                                    data-vv-name="supply_amount"
                                    :error-messages="errors.collect('supply_amount')"
                                    v-validate="'required'"
                                />
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="hide">Отмена</v-btn>
                    <v-btn color="green darken-1" flat @click="save">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: 'SubscriptionAdder',
        data: () => ({
            active: false,
            newSubscription: {
                name: '',
                service_id: null,
                number_days: null,
                supply_amount: null,
                base_price: null,
                changeable_price: false,
            }
        }),
        computed: {
            services () {
                return this.$store.state.catalog.services
            }
        },
        methods: {
            save () {
                this.$validator.validate()
                    .then(res => {
                        if (!res) {
                            return
                        }
                        console.log('Saving new subscription')
                    })
            },
            setFirstService () {
                if (!this.services.length) {
                    return
                }
                this.newSubscription.service_id = this.services[0].id || null
            },
            show () {
                this.active = true
            },
            hide () {
                this.active = false
            }
        },
        mounted () {
            this.setFirstService()
        },
        watch: {
            services (val, oldVal) {
                if (!oldVal.length && val.length) {
                    this.setFirstService()
                }
            }
        }
    }
</script>
