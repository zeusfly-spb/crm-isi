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
            <new-lead-dialog @updated="showSuccess" style="display: inline"/>
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
                        title="Удалить заявку?"
                        @click="confirmToDelete(props.item)"
                        v-if="isSuperadmin"
                    >
                        clear
                    </v-icon>
                </td>
                <td>{{ props.index + 1 }}</td>
                <td>{{ props.item.name | upFirst }}</td>
                <td nowrap>
                    <span v-if="props.item.phone[0] == '+'">{{ props.item.phone | externalPhone }}</span>
                    <span v-else>{{ props.item.phone | phone }}</span>
                    <caller :phone="props.item.phone"/>
                </td>
                <td>
                    <template v-if="props.item.id === openLeadId">
                        <lead-postpones
                            :lead="props.item"
                            @message="showSuccess"
                            :open="props.item.id === openLeadId"
                            @closed="openLeadId = null"
                        />
                    </template>
                    <template v-else>
                            <span
                                v-if="props.item.last_postpone"
                                class="clickable"
                                @click="showLead(props.item.id)"
                                :class="{'today': props.item.last_postpone.date.split(' ')[0] === accountingDate, lost: isLost(props.item.date)}"
                            >
                        {{ props.item.last_postpone.date | moment('DD MMMM YYYY г. HH:mm')}}
                    </span>
                        <v-icon
                            v-else
                            class="clickable"
                            title="Добавить дату перезвона по заявке"
                            @click="showLead(props.item.id)"
                        >
                            phone_forwarded
                        </v-icon>
                    </template>
                </td>
                <td>
                    <span v-if="props.item.site">{{ props.item.site }}</span>
                    <v-avatar
                        v-else
                        size="36px"
                        :title="props.item.user && props.item.user.full_name || ''"
                    >
                        <img :src="basePath + props.item.user.avatar" alt="Фото" v-if="props.item.user && props.item.user.avatar">
                        <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-if="props.item.user && !props.item.user.avatar">
                    </v-avatar>
                </td>
                <td>
                    <template v-if="leadCommentsId === props.item.id">
                        <lead-comments
                            :lead="props.item"
                            @updated="showSuccess"
                            @close="leadCommentsId = null"
                        />
                    </template>
                    <template v-else>
                        <span v-if="props.item.last_comment"
                              @click="leadCommentsId = props.item.id"
                              class="clickable"
                        >
                            {{ props.item.last_comment.text }}
                            <span class="green--text accent-4"
                                  v-if="props.item.comments.length > 1"
                            >
                                <strong>({{ props.item.comments.length }})</strong>
                            </span>
                        </span>
                        <v-icon
                            v-else
                            color="green"
                            title="Добавить комментарий к заявке"
                            class="clickable"
                            @click="leadCommentsId = props.item.id"
                        >
                            add_circle
                        </v-icon>
                    </template>
                </td>
                <td>{{ props.item.created_at | moment('DD MMMM YYYY г. HH:mm') }}</td>
                <td>
                    <lead-status :lead="props.item"></lead-status>
                </td>
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

    export default {
        name: 'LeadsPanel',
        data: () => ({
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
                    if (!!a.last_postpone && !!b.laspostpone) {
                        let timeA = parseFloat(new Date(a.last_postpone.date))
                        let timeB = parseFloat(new Date(b.last_postpone.date))
                        return timeA === timeB ? 0 : timeA < timeB ? 1 : -1
                    }
                    if (!a.last_postpone) {
                        if (!b.last_postpone) {
                            return 0
                        } else {
                            return 1
                        }
                    }
                    if (!b.last_postpone) {
                        if (!a.last_postpone) {
                            return 0
                        } else {
                            return -1
                        }
                    }
                }
                const moveUpToday = (a, b) => {
                    if (!!a.last_postpone && !!b.last_postpone) {
                        let dayA = a.last_postpone.date.split(' ')[0]
                        let dayB = b.last_postpone.date.split(' ')[0]
                        if (dayA === this.accountingDate) {
                            if (dayB === this.accountingDate) {
                                return 0
                            }
                            return -1
                        }
                        if (dayB === this.accountingDate) {
                            if (dayA === this.accountingDate) {
                                return 0
                            }
                            return 1
                        }

                    } else {
                        return 0
                    }
                }
                base.sort(sortByPostpones)
                base.sort(moveUpToday)
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
                this.confirmText = `${lead.phone}`
                this.confirm = true
            }
        },
        components: {
            Caller,
            LeadComments,
            LeadStatus,
            NewLeadDialog,
            LeadPostpones
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
        color: #E65100;
        font-weight: bold;
    }
</style>
