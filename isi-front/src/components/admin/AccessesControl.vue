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
            hide-actions
            class="elevation-1"
            :headers="headers"
            :items="accessRequests"
        >
            <template v-slot:items="props">
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.created_at | moment('DD MMMM YYYY г.')}}</td>
                <td>{{ props.item.device_id }}</td>
                <td>{{ userName(props.item.user_id) }}</td>
                <td>{{ props.item.comment }}</td>
                <td>{{ props.item.island && props.item.island.name || 'без островка' }}</td>
                <td :class="{'blue--text': props.item.status === 'requested', 'green--text': props.item.status === 'allowed', 'red--text': props.item.status === 'denied'}">
                        {{ {requested: 'Ожидает', allowed: 'Разрешен', denied: 'Запрещен'}[props.item.status] }}
                </td>
                <td class="justify-center layout px-0">
                    <v-icon
                        small
                        class="mr-2 green--text"
                        @click="setStatus(props.item, 'allowed')"
                        title="Разрешить"
                        v-if="props.item.status !== 'allowed'"
                    >
                        check_circle
                    </v-icon>
                    <v-icon
                        small
                        class="mr-2 red--text"
                        @click="setStatus(props.item, 'denied')"
                        title="Запретить"
                        v-if="props.item.status !== 'denied'"
                    >
                        cancel
                    </v-icon>
                    <v-icon
                        small
                        class="mr-2 amber--text"
                        @click="setStatus(props.item, 'requested')"
                        title="На ожидание"
                        v-if="props.item.status !== 'requested'"
                    >
                        hourglass_empty
                    </v-icon>

                    <v-icon
                        small
                        class="mr-2 red--text"
                        @click="showDeleteConfirm(props.item)"
                        title="Удалить"
                    >
                        delete_forever
                    </v-icon>

                </td>
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет запросов на доступ</span>
            </template>

        </v-data-table>

        <v-dialog v-model="confirm"
                  max-width="500"
        >
            <v-card>
                <v-card-title class="subheading">
                    Выберите островок для привязки устройства
                </v-card-title>

                <v-card-text>
                    <v-select
                        v-model="selectedIslandId"
                        :items="islands"
                        item-text="name"
                        item-value="id"
                        single-line
                    >
                    </v-select>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        flat="flat"
                        @click="confirm = false"
                    >
                        Отмена
                    </v-btn>
                    <v-btn
                        color="green darken-1"
                        flat="flat"
                        @click="setAccessToIsland"
                    >
                        Сохранить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="deleteConfirm"
                  max-width="500"
        >
            <v-card>
                <v-card-title class="subheading">
                    Удалить выбранный доступ "<strong>{{ accessToDelete && accessToDelete.comment || '' }}</strong>"
                </v-card-title>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        flat="flat"
                        @click="deleteConfirm = false"
                    >
                        Отмена
                    </v-btn>
                    <v-btn
                        color="red darken-1"
                        flat="flat"
                        @click="deleteAccess"
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
        name: 'AccessesControl',
        data: () => ({
            deleteConfirm: false,
            accessToDelete: null,
            currentAccessId: null,
            selectedIslandId: null,
            confirm: false,
            snackbar: false,
            snackColor: 'green',
            snackText: '',
            headers: [
                {text: '#', value: 'id'},
                {text: 'Дата', value: 'created_at'},
                {text: 'Идентификатор утройства', value: 'device_id'},
                {text: 'Отправитель', value: 'user_id'},
                {text: 'Комментарий', value: 'comment'},
                {text: 'Островок привязки', value: null},
                {text: 'Статус', value: 'status'},
                {text: 'Действия', align: 'center', value: null}
            ]
        }),
        computed: {
            islands () {
                return [...this.$store.state.islands, {id: null, name: 'Без островка'}]
            },
            users () {
                return this.$store.state.users
            },
            accessRequests () {
                return this.$store.state.accessRequests
            }
        },
        methods: {
            deleteAccess () {
                this.$store.dispatch('deleteAccess', this.accessToDelete.id)
                    .then(() => {
                        this.deleteConfirm = false
                        this.showSuccess('Доступ удален')
                    })
            },
            showDeleteConfirm (access) {
                this.accessToDelete = access
                this.deleteConfirm = true
            },
            showSuccess (text) {
                this.snackColor = 'green'
                this.snackText = text
                this.snackbar = true
            },
            setAccessToIsland () {
                this.axios.post('/api/set_access_status', {
                    access_id: this.currentAccessId,
                    status: 'allowed',
                    island_id: this.selectedIslandId
                })
                    .then(() => {
                        this.$store.dispatch('setAccessRequests')
                        let island = this.islands.find(island => +island.id === +this.selectedIslandId)
                        let islandName = island && island.name || ''
                        this.showSuccess(`Статус доступа изменент на Разрешен с привязкой к сотровку "${islandName}"`)
                        this.confirm = false
                    })

            },
            setStatus (access, val) {
                if (val === 'allowed') {
                    this.currentAccessId = access.id
                    this.confirm = true
                    return
                }
                this.axios.post('/api/set_access_status', {
                    access_id: access.id,
                    status: val
                })
                    .then(() => {
                        this.$store.dispatch('setAccessRequests')
                            .then(() => this.showSuccess(`Статус доступа изменен на ${{allowed: 'Разрешен', denied: 'Запрещен', requested: 'На ожидании'}[val]}`))

                    })

            },
            userName (id) {
                let user = this.users.find(item => item.id === id)
                return user && user.full_name || ''
            }
        }
    }
</script>
