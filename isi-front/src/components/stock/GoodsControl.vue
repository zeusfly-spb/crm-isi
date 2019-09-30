<template>
    <span>
        <v-btn icon
               title="Редактирование списка наименований товаров и цен"
        >
            <v-icon
                color="green"
                class="clickable"
                @click="activate"
            >
                edit
            </v-icon>
        </v-btn>

        <v-dialog
            v-model="active"
            persistent
            max-width="1000px"
        >
            <v-card class="round-corner">
                <v-card-title class="light-blue darken-3">
                    <span class="title white--text">Товары и цены</span>
                </v-card-title>
                <v-card-text>
                    <v-btn icon
                           title="Добавить наименование товара"
                           @click="showAddDialog"
                    >
                        <v-icon
                            color="green"
                            class="clickable"
                        >
                            add_circle
                        </v-icon>
                    </v-btn>
                    <v-data-table
                        :items="goods"
                        :headers="headers"
                        hide-actions
                    >
                        <template v-slot:items="props">
                            <td>{{ props.index + 1 }}</td>
                            <td>{{ props.item.name }}</td>
                            <td>{{ props.item.price }}</td>
                            <td
                                align="right"
                            >
                                <v-icon
                                    small
                                    class="mr-2 green--text"
                                    @click="openEditDialog(props.item)"
                                    title="Редактировать"
                                >
                                    edit
                                </v-icon>
                                <v-icon
                                    class="mr-2 red--text"
                                    small
                                    @click="showDeleteConfirm(props.item)"
                                    title="Удалить"
                                >
                                    delete
                                </v-icon>
                            </td>
                        </template>
                    </v-data-table>

                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="darken-1" flat @click="active=false">Закрыть</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialog"
            max-width="800"
        >
            <v-card class="round-corner">
                <v-card-title class="light-blue darken-3">
                    <span class="title white--text">{{ editDialogHeader }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md8>
                                <v-text-field v-model="editGood.name"
                                              v-if="dialog"
                                              label="Наименование"
                                              data-vv-as="Наименование"
                                              data-vv-name="name"
                                              :error-messages="errors.collect('name')"
                                              v-validate="'required'"
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="editGood.price"
                                              v-if="dialog"
                                              label="Цена"
                                              data-vv-as="Цена"
                                              data-vv-name="price"
                                              :error-messages="errors.collect('price')"
                                              v-validate="'required|numeric'"
                                />
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="darken-1" flat @click="cancel">Отмена</v-btn>
                    <v-btn color="green darken-1"
                           v-if="edit"
                           flat
                           @click="makeAction"
                           :disabled="JSON.stringify(backupGood) === JSON.stringify(editGood)"
                    >
                        Сохранить
                    </v-btn>
                    <v-btn color="green darken-1"
                           v-if="adding"
                           flat
                           @click="makeAction"
                           :disabled="JSON.stringify(backupGood) === JSON.stringify(editGood)"
                    >
                        Добавить
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
                    <span class="title white--text">Подтверждение</span>
                </v-card-title>
                <v-card-text>
                    Удалить наименование {{ goodToDelete && goodToDelete.name || ''}}?
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="darken-1" flat @click="confirm=false">Отмена</v-btn>
                    <v-btn color="red darken-1" flat @click="deleteGood">Удалить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </span>
</template>
<script>
    export default {
        name: 'GoodsControl',
        data: () => ({
            goodToDelete: null,
            dialog: false,
            newGood: {name: '', price: ''},
            adding: false,
            confirm: false,
            editDialogHeader: '',
            editGood: {name: '', price: ''},
            backupGood: null,
            edit: false,
            active: false,
            headers: [
                {text: '#', value: null, sortable: false},
                {text: 'Наименование', value: 'name'},
                {text: 'Цена', value: 'price'},
                {text: 'Действия', value: null, sortable: false, align: 'right'}
            ]
        }),
        computed: {
            goods () {
                let base = this.$store.state.stock.options.products
                return base && base.filter(item => item.description === 'good') || []
            }
        },
        methods: {
            deleteGood () {
                this.$store.dispatch('deleteProduct', this.goodToDelete.id)
                    .then(() => {
                        this.confirm = false
                        this.$emit('updated', `Наименование '${this.goodToDelete.name}' удалено`, 'green')
                    })
            },
            showDeleteConfirm (good) {
                this.goodToDelete = good
                this.confirm = true
            },
            cancel () {
                [this.dialog, this.adding, this.edit] = [false, false, false]
            },
            showAddDialog () {
                this.editDialogHeader = 'Новый товар'
                this.editGood = JSON.parse(JSON.stringify({name: '', price: ''}))
                this.backupGood = JSON.parse(JSON.stringify(this.editGood))
                this.adding = true
                this.dialog = true
            },
            makeAction () {
                if (this.adding) {
                    this.addNewGood()
                } else {
                    this.saveGood()
                }
            },
            addNewGood () {
                this.$validator.validate()
                    .then(res => {
                        if (!res) return
                        this.$store.dispatch('addGood', this.editGood)
                            .then(() => {
                                this.adding = false
                                this.dialog = false
                                this.$emit('updated', `Добавлен новый товар '${this.editGood.name}'`, 'green')
                            })
                    })
            },
            saveGood () {
                this.$validator.validate()
                    .then(res => {
                        if (!res) return
                        this.$store.dispatch('updateProduct', this.editGood)
                            .then(() => {
                                this.edit = false
                                this.dialog = false
                                this.$emit('updated', `Товар '${this.editGood.name}' отредактирован`, 'green')
                            })
                    })
            },
            openEditDialog (good) {
                this.editDialogHeader = good.name
                this.editGood = JSON.parse(JSON.stringify(good))
                this.backupGood = JSON.parse(JSON.stringify(this.editGood))
                this.edit = true
                this.dialog = true
            },
            activate () {
                this.active = true
            }
        },
        watch: {
            adding (val) {
                if (val) {
                    this.newGood = {name: '', price: ''}
                }
            }
        }
    }
</script>
<style scoped>
    .round-corner {
        border-radius: 5px;
    }
</style>
