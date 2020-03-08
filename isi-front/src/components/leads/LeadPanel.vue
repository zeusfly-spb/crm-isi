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
                        :lead="props.item"
                        :props="props"
                        :interactionsOpenId="interactionsOpenId"
                        :menuOpenId="menuOpenId"
                        :openLeadId="openLeadId"
                        :leadCommentsIdProp="leadCommentsId"
                        @set-lead-comments-id="setLeadCommentsId"
                        @open-menu="openMenu"
                        @show-success="showSuccess"
                        @show-lead="showLead"
                />
                <!--<tr>-->
                    <!--<td>-->
                        <!--<v-icon-->
                            <!--class="red&#45;&#45;text delete"-->
                            <!--title="Удалить заявку?"-->
                            <!--@click="confirmToDelete(props.item)"-->
                            <!--v-if="isSuperadmin"-->
                        <!--&gt;-->
                            <!--clear-->
                        <!--</v-icon>-->
                    <!--</td>-->
                    <!--<td>{{ props.index + 1 }}</td>-->
                    <!--<td-->
                        <!--:id="`lead${props.item.id}`"-->
                    <!--&gt;-->
                        <!--<v-icon-->
                            <!--class="clickable"-->
                            <!--title="Показать историю взаимодействия"-->
                            <!--:color="props.item.customer ? 'green' : 'yellow darken-3'"-->
                            <!--@click="showInteractions(props.item.id)"-->
                            <!--@contextmenu.prevent="openMenu(props.item)"-->
                        <!--&gt;-->
                            <!--contacts-->
                        <!--</v-icon>-->
                        <!--{{ props.item.name | upFirst }}-->
                        <!--<interactions-card-->
                            <!--v-if="+interactionsOpenId === +props.item.id"-->
                            <!--:lead="props.item"-->
                            <!--:customer="props.item.customer"-->
                            <!--@close="interactionsOpenId = null"-->
                        <!--/>-->
                        <!--<lead-context-menu-->
                            <!--v-if="+menuOpenId === +props.item.id"-->
                            <!--:lead="props.item"-->
                            <!--v-model="contextMenu"-->
                            <!--:selector="`#lead${props.item.id}`"-->
                        <!--/>-->
                    <!--</td>-->
                    <!--<td nowrap>-->
                        <!--<span v-if="props.item.phone[0] == '+'">{{ props.item.phone | externalPhone }}</span>-->
                        <!--<span v-else>{{ props.item.phone | phone }}</span>-->
                        <!--<caller :phone="props.item.phone" :lead="props.item"/>-->
                    <!--</td>-->
                    <!--<td>-->
                        <!--<template v-if="props.item.id === openLeadId">-->
                            <!--<lead-postpones-->
                                <!--:lead="props.item"-->
                                <!--@message="showSuccess"-->
                                <!--:open="props.item.id === openLeadId"-->
                                <!--@closed="openLeadId = null"-->
                            <!--/>-->
                        <!--</template>-->
                        <!--<template v-else>-->
                            <!--<span-->
                                <!--v-if="props.item.last_postpone"-->
                                <!--class="clickable"-->
                                <!--@click="showLead(props.item.id)"-->
                                <!--:class="{'today': props.item.last_postpone.date.split(' ')[0] === accountingDate, 'lost': props.item.last_postpone.date < accountingDate}"-->
                            <!--&gt;-->
                                <!--{{ props.item.last_postpone.date | moment('DD MMMM YYYY г. HH:mm')}}-->
                            <!--</span>-->
                            <!--<v-icon-->
                                <!--v-else-->
                                <!--class="clickable"-->
                                <!--title="Добавить дату перезвона по заявке"-->
                                <!--@click="showLead(props.item.id)"-->
                            <!--&gt;-->
                                <!--phone_forwarded-->
                            <!--</v-icon>-->
                        <!--</template>-->
                    <!--</td>-->
                    <!--<td>-->
                        <!--<span v-if="props.item.site">{{ props.item.site }}</span>-->
                        <!--<v-avatar-->
                            <!--v-else-->
                            <!--size="36px"-->
                            <!--:title="props.item.user && props.item.user.full_name || ''"-->
                        <!--&gt;-->
                            <!--<img :src="basePath + props.item.user.avatar" alt="Фото" v-if="props.item.user && props.item.user.avatar">-->
                            <!--<img :src="basePath + '/img/default.jpg'" alt="Без фото" v-if="props.item.user && !props.item.user.avatar">-->
                        <!--</v-avatar>-->
                    <!--</td>-->
                    <!--<td>-->
                        <!--<template v-if="leadCommentsId === props.item.id">-->
                            <!--<lead-comments-->
                                <!--:lead="props.item"-->
                                <!--@updated="showSuccess"-->
                                <!--@close="leadCommentsId = null"-->
                            <!--/>-->
                        <!--</template>-->
                        <!--<template v-else>-->
                        <!--<span v-if="props.item.last_comment"-->
                              <!--@click="leadCommentsId = props.item.id"-->
                              <!--class="clickable"-->
                        <!--&gt;-->
                            <!--{{ props.item.last_comment.text }}-->
                            <!--<span class="green&#45;&#45;text accent-4"-->
                                  <!--v-if="props.item.comments.length > 1"-->
                            <!--&gt;-->
                                <!--<strong>({{ props.item.comments.length }})</strong>-->
                            <!--</span>-->
                        <!--</span>-->
                            <!--<v-icon-->
                                <!--v-else-->
                                <!--color="green"-->
                                <!--title="Добавить комментарий к заявке"-->
                                <!--class="clickable"-->
                                <!--@click="leadCommentsId = props.item.id"-->
                            <!--&gt;-->
                                <!--add_circle-->
                            <!--</v-icon>-->
                        <!--</template>-->
                    <!--</td>-->
                    <!--<td>{{ props.item.created_at | moment('DD MMMM YYYY г. HH:mm') }}</td>-->
                    <!--<td>-->
                        <!--<lead-status :lead="props.item"/>-->
                    <!--</td>-->
                <!--</tr>-->
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет заявок</span>
            </template>
        </v-data-table>

        <v-dialog v-model="confirm"
                  max-width="600"
        >
            <v-card>
                <v-card-title class="light-blue darken-3">
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
    import LeadContextMenu from './LeadContextMenu'
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
            LeadContextMenu,
            Lead
        }
    }
</script>
<style scoped>
    .clickable {
        cursor: pointer;
        opacity: .8;
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
    .today {
        color: #2a9055;
        font-weight: bold;
    }
    .lost {
        color: red;
        font-weight: bold;
    }
</style>
