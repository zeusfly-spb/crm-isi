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
        <view-mode-switcher
                v-model="currentViewMode"
        />
        <v-data-table
            :headers="headers"
            :items="leads"
            hide-actions
            class="elevation-1"
        >
            <template v-slot:items="props">
                <lead :props="props" />
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
    import Lead from './Lead'
    import ViewModeSwitcher from './ViewModeSwitcher'
    export default {
        name: 'LeadsPanel',
        data: () => ({
            currentViewMode: 'wait',
            snackbar: false,
            snackText: '',
            snackColor: 'green',
            confirmText: '',
            headers: [
                {text: '', value: null, sortable: false, width: '5px'},
                {text: '#', value: 'id', sortable: false, width: '5px'},
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
            confirm: {
                get () {
                    return !!this.leadToDelete
                },
                set (val) {
                    if (!val) {
                        this.leadToDelete = null
                    }
                }
            },
            leadToDelete: {
                get () {
                    return this.$store.state.lead.leadToDelete
                },
                set (val) {
                    this.$store.commit('SET_LEAD_TO_DELETE', val)
                }
            },
            leadCommentsId: {
                get () {
                    return this.$store.state.lead.leadCommentsId
                },
                set (val) {
                    this.$store.commit('SET_LEAD_COMMENTS_ID', val)
                }
            },
            openLeadId: {
                get () {
                    return this.$store.state.lead.openLeadId
                },
                set (val) {
                    this.$store.commit('SET_OPEN_LEAD_ID', val)
                }
            },
            interactionsOpenId: {
                get () {
                    return this.$store.state.lead.interactionsOpenId
                },
                set (val) {
                    this.$store.commit('SET_INTERACTIONS_OPEN_ID', val)
                }
            },
            menuOpenId: {
                get () {
                    return this.$store.state.lead.menuOpenId
                },
                set (val) {
                    this.$store.commit('SET_LEAD_MENU_OPEN_ID', val)
                }
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
            accountingDate () {
                return this.$store.state.accountingDate
            },
            canClose () {
                return this.isSuperadmin
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            leads () {
                let base = this.$store.state.loader.leads
                    .sort(this.$store.state.lead.sortByPostpones)
                    .sort(this.$store.state.lead.sortByTimeInDay)
                    .sort(this.$store.state.lead.moveFutureDown)
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
            deleteLead () {
                this.$store.dispatch('deleteLead', {lead_id: this.leadToDelete.id})
                    .then(() => {
                        this.$store.commit('SEND_LEAD_MESSAGE', {
                            text: `Заявка с номера ${this.$options.filters.phone(this.leadToDelete.phone)} удалена`,
                            color: 'green'
                        })
                        this.leadToDelete = null
                    })
            }
        },
        watch: {
            leadToDelete (val) {
                if (val) {
                    this.confirmText = `${val.phone}`
                }
            },
            '$store.state.lead.message': function (val) {
                if (val) {
                    this.showSnack({...val})
                }
            },
            currentViewMode () {
                this.openLeadId = null
            }
        },
        components: {
            Lead,
            ViewModeSwitcher
        }
    }
</script>

