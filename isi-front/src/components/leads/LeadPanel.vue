<template>
    <v-flex>
        <v-snackbar
            v-model="snackbar"
            auto-height
            top
            :timeout="3000"
            :color="snackColor"
        >
            <span>{{ snackText }}</span>
        </v-snackbar>
        <v-flex>
            <v-btn
                small
                v-for="(mode, index) in viewModes"
                @click="setViewMode(mode)"
                :key="index"
                :depressed="mode === currentViewMode"
                :color="mode === currentViewMode ? 'grey lighten-1' : null"
            >
                {{ {wait: 'Ожидают', process: 'В работе', done: 'Завершенные', moderate: 'На модерации', all: 'Все'}[mode] }}
                (
                <span v-if="mode === 'all'">{{ counts.all }}</span>
                <span v-if="mode === 'wait'">{{ counts.wait }}</span>
                <span v-if="mode === 'process'">{{ counts.process }}</span>
                <span v-if="mode === 'moderate'">{{ counts.moderate }}</span>
                <span v-if="mode === 'done'">{{ counts.done }}</span>
                )
            </v-btn>
        </v-flex>
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
                <td>
<!--                    <lead-comment-updater :lead="props.item" @updated="showSuccess"/>-->
                    <lead-comments :lead="props.item"/>
                </td>
                <td>{{ props.item.created_at | moment('DD MMMM YYYY г. HH:mm:ss') }}</td>
                <td>
                    <v-icon
                        :title="`Присвоить статус 'В работе' для заявки с номера ${props.item.phone}`"
                        v-show="props.item.status !== 'process'"
                        class="green--text clickable"
                        @click="updateStatus({lead: props.item, status: 'process'})"
                    >
                        offline_pin
                    </v-icon>
                    <v-icon
                        :title="`Присвоить статус 'На модерации' для заявки с номера ${props.item.phone}`"
                        v-show="props.item.status !== 'moderate'"
                        class="blue--text clickable"
                        @click="updateStatus({lead: props.item, status: 'moderate'})"
                    >
                        offline_bolt
                    </v-icon>
                    <v-icon
                        :title="`Присвоить статус 'Завершено' для заявки с номера ${props.item.phone}`"
                        v-show="props.item.status !== 'done' && canClose"
                        class="red--text clickable"
                        @click="updateStatus({lead: props.item, status: 'done'})"
                    >
                        remove_circle
                    </v-icon>
                </td>
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
                        @click="deleteLead"
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
    import LeadCommentUpdater from './LeadCommentUpdater'
    import LeadComments from './LeadComments'

    export default {
        name: 'LeadsPanel',
        data: () => ({
            currentViewMode: 'wait',
            viewModes: ['wait', 'process', 'moderate', 'done', 'all'],
            snackbar: false,
            snackText: '',
            snackColor: 'green',
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
                {text: 'Действия', value: null}
            ]
        }),
        computed: {
            canClose () {
                return this.isSuperadmin
            },
            counts () {
                let base = this.$store.state.loader.leads
                return {
                    all: base.length,
                    wait: base.filter(item => item.status === 'wait').length,
                    process: base.filter(item => item.status === 'process').length,
                    done: base.filter(item => item.status === 'done').length,
                    moderate: base.filter(item => item.status === 'moderate').length
                }
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            leads () {
                let base = this.$store.state.loader.leads
                switch (this.currentViewMode) {
                    case 'all': return base
                    case 'wait': return base.filter(item => item.status === 'wait')
                    case 'process': return base.filter(item => item.status === 'process')
                    case 'moderate': return base.filter(item => item.status === 'moderate')
                    case 'done': return base.filter(item => item.status === 'done')
                }
            }
        },
        methods: {
            updateStatus ({lead, status}) {
                let hint = `Заявке с номера ${lead.phone} присвоен статус '${{process: 'В работе', moderate: 'На модерации', done: 'Завершена'}[status]}'`
                this.$store.dispatch('updateLeadStatus', {
                    lead_id: lead.id,
                    status: status
                })
                    .then(() => this.showSuccess(hint, 'green'))
            },
            setViewMode (mode) {
                this.currentViewMode = mode
            },
            showSuccess (text, color) {
                this.snackText = text
                this.snackColor = color
                this.snackbar = true
            },
            deleteLead () {
                this.$store.dispatch('deleteLead', {lead_id: this.leadToDelete.id})
                    .then(() => {
                        this.showSuccess(`Заявка с номера ${this.leadToDelete.phone} удалена`, 'green')
                        this.confirm = false
                    })
            },
            confirmToDelete (lead) {
                this.leadToDelete = lead
                this.confirmText = `Удалить заявку с номера ${lead.phone}?`
                this.confirm = true
            }
        },
        components: {
            Caller,
            LeadCommentUpdater,
            LeadComments
        }
    }
</script>
<style scoped>
    .clickable {
        cursor: pointer;
        opacity: .75;
    }
    .clickable:hover {
        opacity: 1;
    }
    .delete {
        cursor: pointer;
        opacity: .6;
    }
    .delete:hover {
        opacity: 1;
    }
</style>
