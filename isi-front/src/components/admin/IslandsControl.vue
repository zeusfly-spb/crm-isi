<template>
    <v-flex align-center>
        <v-snackbar
                v-model="snackbar"
                auto-height
                top
                :timeout="3000"
                :color="snackColor"
        >
            <span>{{ snackText }}</span>
        </v-snackbar>

       <v-data-table
               :headers="headers"
               :items="islands"
               hide-actions
               class="elevation-1"
       >
           <template v-slot:items="props">
               <td>{{ props.item.id }}</td>
               <td>{{ props.item.name }}</td>
               <td>{{ props.item.description }}</td>
               <td>
                   <island-users-column :users="props.item.users"></island-users-column>
               </td>
               <td>
                   <chief-updater :island="props.item" @updated="showSuccess"/>
               </td>
               <td class="justify-center layout px-0">
                   <v-icon
                           small
                           class="mr-2 green--text"
                           @click="showEditDialog(props.item)"
                           title="Редактировать"
                   >
                       edit
                   </v-icon>
                   <v-icon
                           class="red--text"
                           small
                           @click="showDeleteConfirm(props.item)"
                           title="Удалить"
                   >
                       delete
                   </v-icon>
               </td>
           </template>

           <template v-slot:no-data>
               <span class="red--text">Нет островков</span>
           </template>
       </v-data-table>

        <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
                <v-btn flat color="primary" dark class="mb-2" @click="showAddDialog">
                    Добавить островок
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ {add: 'Добавить', edit: 'Редактировать'}[mode] }} островок</span>
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md6>
                                <v-text-field v-model="editedIsland.name"
                                              label="Название"
                                              data-vv-as="Название"
                                              data-vv-name="name"
                                              :error-messages="errors.collect('name')"
                                              v-validate="'required'"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field v-model="editedIsland.description"
                                              label="Описание"
                                ></v-text-field>
                            </v-flex>

                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="dialog = false">Отмена</v-btn>
                    <v-btn color="green darken-1" flat @click="submitForm">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="confirm"
                  max-width="290"
        >
            <v-card>
                <v-card-title class="subheading">
                    {{ confirmText }}
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            flat="flat"
                            @click="confirm = false"
                    >
                        Отмена
                    </v-btn>
                    <v-btn
                            color="red darken-1"
                            flat="flat"
                            @click="deleteIsland"
                    >
                        Удалить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>



    </v-flex>
</template>

<script>
    import IslandUsersColumn from './IslandUsersColumn'
    import ChiefUpdater from './ChiefUpdater'
    export default {
        name: 'IslandsControl',
        data: () => ({
            islandToDelete: null,
            confirm: false,
            confirmText: '',
            mode: null,
            dialog: false,
            snackbar: false,
            snackColor: 'green',
            snackText: '',
            editedIsland: null,
            defaultIsland: {
                name: '',
                description: ''
            },
            headers: [
                {text: '#', value: 'id'},
                {text: 'Название', value: 'name'},
                {text: 'Описание', value: 'description'},
                {text: 'Сотрудники', value: 'users'},
                {text: 'Руководитель', value: 'chief_id'},
                {text: 'Действия', align: 'center', value: null}
            ]
        }),
        computed: {
            islands () {
                return this.$store.state.islands
            }
        },
        methods: {
            showSuccess (text) {
                this.snackColor = 'green'
                this.snackText = text
                this.snackbar = true
            },
            deleteIsland () {
                this.$store.dispatch('deleteIsland', this.islandToDelete.id)
                    .then(() => {
                        this.confirm = false
                        this.showSuccess(`Островок "${this.islandToDelete.name}" удален`)
                    })
            },
            showDeleteConfirm (island) {
                this.islandToDelete = island
                this.confirmText = `Удалить островок "${island.name}"`
                this.confirm = true
            },
            showEditDialog (island) {
                this.mode = 'edit'
                this.editedIsland = JSON.parse(JSON.stringify(island))
                this.dialog = true
            },
            showAddDialog () {
                this.errors.clear()
                this.editedIsland = JSON.parse(JSON.stringify(this.defaultIsland))
                this.mode = 'add'
                this.dialog = true
            },
            submitForm () {
                if (this.mode === 'add') {
                    this.$store.dispatch('addIsland', this.editedIsland)
                        .then((res) => {
                            this.dialog = false
                            this.showSuccess(`Островок "${res.data.name}" добавлен`)

                        })
                }
            }
        },
        created () {
            this.editedIsland = JSON.parse(JSON.stringify(this.defaultIsland))
        },
        components: {
            IslandUsersColumn,
            ChiefUpdater
        }
    }
</script>
