<template>
    <v-dialog
        persistent
        v-if="editedEvent"
        value="true"
        max-width="1000"
    >
        <v-card class="round-corner">
            <v-card-title class="light-blue darken-3">
                <span class="title white--text">
                    Редактирование записи
                </span>
                <v-spacer/>
                <v-icon
                    class="clickable"
                    color="white"
                    @click="cancel"
                    title="Отмена"
                >
                    close
                </v-icon>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12 sm6 md4>
                            <v-menu
                                v-model="menu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <sub>Дата</sub>
                                    <v-text-field
                                        style="width: 13em"
                                        :label="editedEvent.date | moment('DD MMMM YYYY г.')"
                                        readonly
                                        prepend-icon="event"
                                        v-on="on"
                                    />
                                </template>
                                <v-date-picker
                                    v-model="editedEvent.date" no-title scrollable
                                    @change="datePicked"
                                    locale="ru"
                                    first-day-of-week="1"
                                />
                            </v-menu>
                        </v-flex>
                        <v-flex xs12 sm6 md4
                                v-if="cabinets.length"
                        >
                            <sub>Кабинет</sub>
                            <v-select
                                v-model="editedEvent.cabinet_id"
                                :items="cabinets"
                                item-text="name"
                                item-value="id"
                                single-line
                                data-vv-name="cabinet"
                                data-vv-as="Кабинет"
                                :readonly="singleCabinet"
                                :error-messages="errors.collect('cabinet')"
                                v-validate="cabinets.length ? 'required' : null"
                            />
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn
                    flat="flat"
                    @click="cancel"
                >
                    Отмена
                </v-btn>
                <v-btn
                    color="green darken-1"
                    flat="flat"
                    @click=""
                    :disabled="!changed"
                >
                    Сохранить
                </v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>
<script>
    export default {
        name: 'EventEditor',
        props: ['event'],
        data: () => ({
            editedEvent: null,
            backupEvent: null,
            menu: false
        }),
        computed: {
            singleCabinet () {
                return this.cabinets.length === 1
            },
            cabinets () {
                return this.workingIsland && this.workingIsland.cabinets || []
            },
            workingIsland () {
                return this.$store.getters.workingIsland
            },
            changed () {
                return JSON.stringify(this.editedEvent) !== JSON.stringify(this.backupEvent)
            }
        },
        methods: {
            datePicked () {
                this.menu = false
            },
            deliverClose (data) {
                if (!data) {
                    this.cancel()
                }
            },
            cancel () {
                this.$emit('cancel')
            }
        },
        mounted () {
            this.editedEvent = JSON.parse(JSON.stringify(this.event))
            this.backupEvent = JSON.parse(JSON.stringify(this.event))
        }
    }
</script>
