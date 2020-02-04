<template>
    <v-flex class="m-0 p-0">
        <span
            class="text-center body-2"
        >
            Кабинеты
        </span>
        <div
            class="p-0 m-0"
        >
            <v-btn color="primary"
                   flat
                   dark
                   small
                   @click="openAddDialog"
            >
                Добавить кабинет
            </v-btn>
        </div>
        <v-data-table
            :items="cabinets"
            hide-headers
            hide-actions
        >
            <template v-slot:items="props">
                <tr style="height: 1em!important;">
                    <td>{{ props.index + 1 }}</td>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.description }}</td>
                    <td
                        align="right"
                        style="margin: 0; padding: 0"
                    >
                        <v-btn flat small icon>
                            <v-icon
                                small
                                color="green"
                            >
                                edit
                            </v-icon>
                        </v-btn>
                        <v-btn flat small icon>
                            <v-icon
                                small
                                color="red"
                            >
                                delete
                            </v-icon>
                        </v-btn>
                    </td>
                </tr>
            </template>
            <template v-slot:no-data>
                <span class="red--text">
                    У островка отсутствуют кабинеты
                </span>
            </template>
        </v-data-table>
        <v-dialog
            :value="!!dialog"
            max-width="600px"
        >
            <v-card class="round-corner">
                <v-card-title class="light-blue darken-3">
                    <span class="title white--text">
                        {{ `${ {add: 'Добавить', edit: 'Редактировать'}[dialog]} кабинет на островок "${island.name}"` }}
                    </span>
                    <v-spacer/>
                     <v-icon
                         class="clickable"
                         @click="closeDialog"
                         color="white"
                         title="Закрыть"
                     >
                        close
                     </v-icon>
                </v-card-title>
                <v-card-text>
                    <v-container
                        grid-list-md
                        class="p-0 m-0"
                    >
                        <v-layout wrap>
                            <v-flex xs12 sm6 md6>
                                <v-text-field
                                    v-if="!!dialog"
                                    autofocus
                                    v-model="editedCabinet.name"
                                    label="Название"
                                    data-vv-as="Название"
                                    data-vv-name="name"
                                    :error-messages="errors.collect('name')"
                                    v-validate="'required'"
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field
                                    v-model="editedCabinet.description"
                                    label="Описание"
                                />
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn
                        flat="flat"
                        @click="closeDialog"
                    >
                        Отмена
                    </v-btn>
                    <v-btn
                        color="green darken-1"
                        flat="flat"
                        @click="saveCabinet"
                    >
                        Сохранить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script>
    export default {
        name: 'CabinetControl',
        props: ['island'],
        data: () => ({
            dialog: null,
            editedCabinet: null,
            blankCabinet: {
                name: null,
                description: null
            }
        }),
        computed: {
            options () {
                return this.island && this.island.options
            },
            cabinets: {
                get () {
                    return this.options && this.options['cabinets'] || []
                },
                set (val) {
                    let updatedOptions = {... this.options, cabinets: val}
                    this.$store.dispatch('updateIsland', {...this.island, options: updatedOptions})
                        .then(() => {
                            console.log('Все нормально!')
                            this.closeDialog()
                        })
                }
            }
        },
        methods: {
            saveCabinet () {
                this.$validator.validate()
                    .then(res => {
                        if (!res) return
                        let cabinets = this.cabinets
                        cabinets.push({
                            id: this.$store.state.appointment.uniqID('cab'),
                            ... this.editedCabinet
                        })
                        this.cabinets = cabinets
                    })
            },
            openAddDialog () {
                this.editedCabinet = JSON.parse(JSON.stringify(this.blankCabinet))
                this.openDialog('add')
            },
            openDialog (mode) {
                this.dialog = mode
            },
            closeDialog () {
                this.dialog = null
            }
        },
        created () {
            this.editedCabinet = JSON.parse(JSON.stringify(this.blankCabinet))
        }
    }
</script>
