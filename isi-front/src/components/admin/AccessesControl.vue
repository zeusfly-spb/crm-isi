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

                </td>
            </template>

        </v-data-table>

    </v-flex>
</template>
<script>
    export default {
        name: 'AccessesControl',
        data: () => ({
            snackbar: false,
            snackColor: 'green',
            snackText: '',
            headers: [
                {text: '#', value: 'id'},
                {text: 'Дата', value: 'created_at'},
                {text: 'Идентификатор утройства', value: 'device_id'},
                {text: 'Отправитель', value: 'user_id'},
                {text: 'Комментарий', value: 'comment'},
                {text: 'Статус', value: 'status'},
                {text: 'Дествия', align: 'center'}
            ]
        }),
        computed: {
            users () {
                return this.$store.state.users
            },
            accessRequests () {
                return this.$store.state.accessRequests
            }
        },
        methods: {
            showSuccess (text) {
                this.snackColor = 'green'
                this.snackText = text
                this.snackbar = true
            },
            setStatus (access, val) {
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
