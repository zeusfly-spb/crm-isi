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
            hide-default-footer
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
                        <v-btn flat small icon
                               title="Редактировать"
                        >
                            <v-icon
                                small
                                color="green"
                                @click="openEditDialog(props.item)"
                            >
                                edit
                            </v-icon>
                        </v-btn>
                        <v-btn flat small icon
                               @click="showDeleteConfirm(props.item)"
                               title="Удалить"
                        >
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
            max-width="800px"
        >
            <v-card class="round-corner">
                <v-card-title class="light-blue darken-3">
                    <span class="title white--text">
                        {{ `${ {add: 'Добавить', edit: 'Редактировать'}[dialog]} кабинет на остров${{add: 'ок', edit: 'ке'}[dialog]} "${island.name}"` }}
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
        <v-dialog
            v-model="confirm"
            max-width="500px"
        >
            <v-card class="round-corner">
                <v-card-title class="light-blue darken-3">
                    <span class="title white--text">Подтвержение</span>
                </v-card-title>
                <v-card-text>
                    <span class="subheading">
                        Удалить кабинет <strong>"{{ cabinetToDelete && cabinetToDelete.name }}"</strong>
                        островка <strong>"{{ island && island.name }}"</strong>?
                    </span>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn
                        flat
                        @click="confirm=false"
                    >
                        Отмена
                    </v-btn>
                    <v-btn
                        color="red darken-1"
                        flat
                        @click="deleteCabinet"
                    >
                        Удалить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script>
    export default {
        name: 'CabinetControl',
        props: ['islandId'],
        data: () => ({
            currentAction: null,
            cabinetToDelete: null,
            confirm: false,
            dialog: null,
            editedCabinet: null,
            blankCabinet: {
                name: null,
                description: null
            }
        }),
        computed: {
            island () {
                return this.$store.state.islands.find(island => +island.id === +this.islandId)
            },
            options () {
                return this.island && this.island.options
            },
            cabinets: {
                get () {
                    return this.island && this.island.cabinets || []
                },
                set (val) {
                    let updatedOptions = {... this.options, cabinets: val}
                    this.$store.dispatch('updateIsland', {...this.island, options: updatedOptions})
                        .then(() => {
                            let targetCabinet
                            switch (this.currentAction) {
                                case 'add': targetCabinet = this.editedCabinet
                                    break
                                case 'edit': targetCabinet = this.editedCabinet
                                    break
                                case 'delete': targetCabinet = this.cabinetToDelete
                                    break
                            }
                            let successText = `Кабинет "${targetCabinet.name}" ${{add: 'добавлен', delete: 'удален', edit: 'изменен'}[this.currentAction]} в островке "${this.island.name}"`
                            this.$emit('success', successText)
                            this.closeDialog()
                        })
                }
            }
        },
        methods: {
            openEditDialog (cabinet) {
                this.editedCabinet = JSON.parse(JSON.stringify(cabinet))
                this.currentAction = 'edit'
                this.openDialog('edit')
            },
            deleteCabinet () {
                this.currentAction = 'delete'
                let cabinets = this.cabinets
                cabinets = cabinets.filter(item => item.id !== this.cabinetToDelete.id)
                this.cabinets = cabinets
                this.confirm = false
            },
            showDeleteConfirm (cabinet) {
                this.cabinetToDelete = cabinet
                this.confirm = true
            },
            saveCabinet () {
                this.$validator.validate()
                    .then(res => {
                        if (!res) return
                        let cabinets = this.cabinets
                        switch (this.currentAction) {
                            case 'add':
                                cabinets.push({
                                    id: this.$store.state.appointment.uniqID('cab'),
                                    ... this.editedCabinet
                                })
                                break
                            case 'edit':
                                cabinets = cabinets.map(cabinet => cabinet.id === this.editedCabinet.id ? this.editedCabinet : cabinet)
                                break
                        }
                        this.cabinets = cabinets
                    })
            },
            openAddDialog () {
                this.editedCabinet = JSON.parse(JSON.stringify(this.blankCabinet))
                this.currentAction = 'add'
                this.openDialog('add')
            },
            openDialog (mode) {
                this.dialog = mode
            },
            closeDialog () {
                this.currentAction = null
                this.dialog = null
            }
        },
        created () {
            this.editedCabinet = JSON.parse(JSON.stringify(this.blankCabinet))
        }
    }
</script>
