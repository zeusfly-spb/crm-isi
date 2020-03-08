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
                :title="(mode === 'done' || mode === 'all') && !doneMode ? 'Чтобы узнать количество завершенных заявок, переключите режим' : ''"
            >
                {{ {wait: 'Ожидают', process: 'В работе', done: 'Завершенные', moderate: 'На модерации', all: 'Все'}[mode] }}
                (
                <span v-if="mode === 'all'">{{ doneMode && counts && counts.all || '*' }}</span>
                <span v-if="mode === 'wait'">{{ counts.wait }}</span>
                <span v-if="mode === 'process'">{{ counts.process }}</span>
                <span v-if="mode === 'moderate'">{{ counts.moderate }}</span>
                <span v-if="mode === 'done'">{{ doneMode && counts && counts.done || '*' }}</span>
                )
            </v-btn>
            <new-lead-dialog @updated="showSuccess" style="display: inline"/>
        </v-flex>
        <v-data-table
            :headers="headers"
            :items="leads"
            hide-actions
            class="elevation-1"
        >
            <template v-slot:items="props">
                <lead
                        :props="props"
                        :interactionsOpenIdProp="interactionsOpenId"
                        :menuOpenIdProp="menuOpenId"
                        :openLeadId="openLeadId"
                        :leadCommentsIdProp="leadCommentsId"
                        @set-lead-comments-id="setLeadCommentsId"
                        @open-menu="openMenu"
                        @show-success="showSuccess"
                        @show-lead="showLead"
                        @show-iterations="showInteractions"
                        @set-interactions-open-id="setInteractionsOpenId"
                        @confirm-to-delete="confirmToDelete"
                        @set-menu-open-id="setMenuOpenId"
                />
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет заявок</span>
            </template>
        </v-data-table>

        <v-dialog v-model="confirm"
                  max-width="600"
        >
            <v-card class="round-corner">
                <v-card-title class="red darken-3">
                    <span class="title white--text">Подтверждение</span>
                </v-card-title>
                <v-card-text>
                    <span class="title">Удалить заявку с номера <span v-if="confirmText[0] !== '+'">{{ confirmText  | phone}}</span> <span v-else>{{ confirmText | externalPhone}}</span>?</span>
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
    import LeadComments from './LeadComments'
    import LeadStatus from './LeadStatus'
    import NewLeadDialog from './NewLeadDialog'
    import LeadPostpones from './LeadPostpones'
    import InteractionsCard from '../customers/InteractionsCard'
    import Lead from './Lead'

    export default {
        name: 'LeadsPanel',
        data: () => ({
            menuOpenId: null,
            interactionsOpenId: null,
            leadCommentsId: null,
            openLeadId: null,
            currentViewMode: 'wait',
            viewModes: ['wait', 'process', 'moderate', 'done', 'all'],
            snackbar: false,
            snackText: '',
            snackColor: 'green',
            confirmText: '',
            confirm: false,
            leadToDelete: null,
            headers: [
                {text: '', value: null, sortable: false},
                {text: '#', value: 'id', sortable: false},
                {text: 'Имя', value: 'name', sortable: false},
                {text: 'Телефон', value: 'phone', sortable: false},
                {text: 'Дата перезвона', value: 'phone', sortable: false},
                {text: 'Источник', value: 'site', sortable: false},
                {text: 'Комментарии', value: null, sortable: false},
                {text: 'Дата/Время', value: 'created_at', sortable: false},
                {text: 'Действия', value: null, sortable: false}
            ]
        }),
        computed: {
            leadMessage () {
                return this.$store.state.lead.message
            },
            contextMenu: {
                get () {
                    return !!this.menuOpenId
                },
                set (val) {
                    if (!val) {
                        this.menuOpenId = null
                    }
                }
            },
            doneMode () {
                return this.$store.state.loader.withDone
            },
            accountingDate () {
                return this.$store.state.accountingDate
            },
            basePath () {
                return this.$store.state.basePath
            },
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
                const sortByPostpones = (a, b) => {
                    if (!!a.last_postpone && !!b.last_postpone) {
                        let timeA = parseFloat(new Date(a.last_postpone.date))
                        let timeB = parseFloat(new Date(b.last_postpone.date))
                        return timeA === timeB ? 0 : timeA < timeB ? 1 : -1
                    }
                    if (!a.last_postpone) {
                        if (!b.last_postpone) {
                            return 0
                        } else {
                            return -1
                        }
                    }
                    if (!b.last_postpone) {
                        if (!a.last_postpone) {
                            return 0
                        } else {
                            return 1
                        }
                    }
                }
                const moveFutureDown = (a, b) => {
                    if (!a.last_postpone || !b.last_postpone) {
                        return 0
                    }
                    let timeA = a.last_postpone.date.split(' ')[0]
                    let timeB = b.last_postpone.date.split(' ')[0]
                    return timeA === timeB ? 0 : timeA < timeB ? -1 : 1
                }
                const sortByTimeInDay = (a, b) => {
                    if (!a.last_postpone || !b.last_postpone) {
                        return 0
                    }
                    if (!a.last_postpone.date.split(' ')[0] !== !b.last_postpone.date.split(' ')[0]) {
                        return 0
                    }
                    let timeA = a.last_postpone.date.split(' ')[1]
                    let timeB = b.last_postpone.date.split(' ')[1]
                    return timeA === timeB ? 0 : timeA < timeB ? -1 : 1
                }
                base.sort(sortByPostpones)
                base.sort(sortByTimeInDay)
                base.sort(moveFutureDown)
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
            setMenuOpenId (id) {
                if (!id) {
                    this.menuOpenId = null
                } else {
                    this.menuOpenId = id
                }
            },
            setInteractionsOpenId (val) {
                this.interactionsOpenId = val
            },
            showSnack ({color, text}) {
                this.snackColor = color
                this.snackText = text
                this.snackbar = true
            },
            setLeadCommentsId (val) {
                this.leadCommentsId = val
            },
            openMenu (lead) {
                this.menuOpenId = lead.id
            },
            showInteractions (id) {
                this.interactionsOpenId = id
            },
            isLost (dateTime) {
                let rawDate = parseFloat(new Date(dateTime))
                let nowDate = parseFloat(new Date(this.accountingDate))
                return rawDate < nowDate
            },
            showLead (id) {
                this.openLeadId = id
            },
            setViewMode (mode) {
                this.openLeadId = null
                this.currentViewMode = mode
                this.$store.dispatch('setDoneMode', mode === 'done' || mode === 'all')
            },
            showSuccess (text, color) {
                this.snackText = text
                this.snackColor = color
                this.snackbar = true
            },
            deleteLead () {
                this.$store.dispatch('deleteLead', {lead_id: this.leadToDelete.id})
                    .then(() => {
                        this.showSuccess(`Заявка с номера ${this.$options.filters.phone(this.leadToDelete.phone)} удалена`, 'green')
                        this.confirm = false
                    })
            },
            confirmToDelete (lead) {
                this.leadToDelete = lead
                this.confirmText = `${lead.phone}`
                this.confirm = true
            }
        },
        watch: {
            leadMessage (val) {
                if (val) {
                    this.showSnack({...val})
                }
            }
        },
        components: {
            Caller,
            LeadComments,
            LeadStatus,
            NewLeadDialog,
            LeadPostpones,
            InteractionsCard,
            Lead
        }
    }
</script>

