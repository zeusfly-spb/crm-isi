<template>
    <v-flex>
        <span class="title">Заявки</span>
        <v-data-table
            :headers="headers"
            :items="leads"
            hide-actions
            class="elevation-1"
        >
            <template v-slot:items="props">
                <td>
                    <v-icon
                        class="red--text delete"
                        :title="`Удалить заявку на номер ${props.item.phone}`"
                        @click="confirmToDelete(props.item)"
                        v-if="isSuperadmin"
                    >
                        clear
                    </v-icon>
                </td>
                <td>{{ props.index + 1 }}</td>
                <td>{{ props.item.name }}</td>
                <td>
                    {{ props.item.phone }}
                    <caller :phone="props.item.phone"/>
                </td>
                <td>{{ props.item.site }}</td>
                <td>{{ props.item.comment }}</td>
                <td>{{ props.item.created_at | moment('DD MMMM YYYY г. HH:mm:ss') }}</td>
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет заявок</span>
            </template>
        </v-data-table>
        <v-dialog v-model="confirm"
                  max-width="400"
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
                        @click=""
                    >
                        Удалить
                    </v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
    </v-flex>
</template>
<script>
    import Caller from './Caller'
    export default {
        name: 'LeadsPanel',
        data: () => ({
            confirmText: '',
            confirm: false,
            leadToDelete: null,
            headers: [
                {text: '', value: null},
                {text: '#', value: 'id'},
                {text: 'Имя', value: 'name'},
                {text: 'Телефон', value: 'phone'},
                {text: 'Сайт', value: 'site'},
                {text: 'Комментарий', value: 'comment'},
                {text: 'Дата/Время', value: 'created_at'},
            ]
        }),
        computed: {
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            leads () {
                return this.$store.state.loader.leads
            }
        },
        methods: {
            confirmToDelete (lead) {
                this.leadToDelete = lead
                this.confirmText = `Удалить заявку с номера ${lead.phone}?`
                this.confirm = true
            }
        },
        components: {
            Caller
        }
    }
</script>
<style scoped>
    .delete {
        cursor: pointer;
        opacity: .6;
    }
    .delete:hover {
        opacity: 1;
    }
</style>
