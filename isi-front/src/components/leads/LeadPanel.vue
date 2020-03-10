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
        <island-switcher
            v-if="isSuperadmin"
        />
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
        <lead-remover/>
        <lead-event-adder/>
    </v-flex>
</template>
<script>
    import Lead from './Lead'
    import ViewModeSwitcher from './ViewModeSwitcher'
    import LeadRemover from './LeadRemover'
    import LeadEventAdder from './LeadEventAdder'
    import IslandSwitcher from '../IslandSwitcher'
    export default {
        name: 'LeadsPanel',
        data: () => ({
            currentViewMode: 'wait',
            snackbar: false,
            snackText: '',
            snackColor: 'green',
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
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            leads () {
                let base = JSON.parse(JSON.stringify(this.$store.state.loader.leads))
                    .sort(this.$store.state.lead.sortByPostpones)
                    .sort(this.$store.state.lead.sortByTimeInDay)
                    .sort(this.$store.state.lead.moveFutureDown)
                return this.currentViewMode === 'all' ? base : base.filter(item => item.status === this.currentViewMode)
            }
        },
        methods: {
            showSnack ({color, text}) {
                this.snackColor = color
                this.snackText = text
                this.snackbar = true
            }
        },
        watch: {
            '$store.state.lead.message': function (val) {
                if (val) {
                    this.showSnack({...val})
                }
            },
            currentViewMode () {
                this.$store.commit('SET_OPEN_LEAD_ID', null)
            }
        },
        components: {
            Lead,
            ViewModeSwitcher,
            LeadRemover,
            LeadEventAdder,
            IslandSwitcher
        }
    }
</script>

