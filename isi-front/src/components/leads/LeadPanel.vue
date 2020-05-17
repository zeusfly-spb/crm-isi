<template>
    <v-flex>
        <island-switcher
            v-if="isSuperadmin"
        />
        <view-mode-switcher
                v-model="currentViewMode"
        />
        <div class="mb-2">
            <v-text-field
                    class="right"
                    style="width: 23em"
                    v-model="searchString"
                    append-icon="search"
                    label="Начните вводить данные для поиска..."
                    single-line
                    hide-details
                    @input="lazyQuerySelection"
            />
        </div>
        <v-data-table
            class="elevation-1"
            :loading="$store.state.paginator.loading"
            :headers="headers"
            :items="leads"
            :total-items="$store.state.paginator.total"
            :rows-per-page-items="rowOptions"
            rows-per-page-text="Заявок на странице"
            @update:pagination="updatePagination"
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
    import Lodash from 'lodash'
    import Lead from './Lead'
    import ViewModeSwitcher from './ViewModeSwitcher'
    import LeadRemover from './LeadRemover'
    import LeadEventAdder from './LeadEventAdder'
    import IslandSwitcher from '../IslandSwitcher'
    export default {
        name: 'LeadsPanel',
        data: () => ({
            searchString: '',
            rowOptions: [
                10,
                25,
                50,
                { text: "Все", value: -1 }
            ],
            currentViewMode: 'wait',
            snackbar: false,
            snackText: '',
            snackColor: 'green',
            headers: [
                {text: '', value: null, sortable: false, width: '5px'},
                {text: '#', value: 'id', sortable: false, width: '5px'},
                {text: 'Имя', value: 'name', sortable: false},
                {text: 'Телефон', value: 'phone', sortable: false},
                {text: 'Запись', value: null, sortable: false},
                {text: 'Дата перезвона', value: 'phone', sortable: false},
                {text: 'Источник', value: 'site', sortable: false},
                {text: 'Комментарии', value: null, sortable: false},
                {text: 'Дата/Время', value: 'created_at', sortable: false},
                {text: 'Действия', value: null, sortable: false}
            ]
        }),
        computed: {
            lazyQuerySelection () {
                return Lodash.debounce(this.setLeadName, 300)
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            leads () {
                let base = JSON.parse(JSON.stringify(this.$store.state.loader.leads))
                    .map(item => ({
                        ...item,
                        last_postpone: item.postpones && item.postpones.length && item.postpones[0] || null
                    }))
                    .sort(this.$store.state.lead.sortByPostpones)
                    .sort(this.$store.state.lead.sortByTimeInDay)
                    .sort(this.$store.state.lead.moveFutureDown)
                base = base.map(item => ({
                    ...item,
                    hasEvents: item.appointments && item.appointments.length > 0,
                    lastEvent: item.appointments && item.appointments.length > 0 && item.appointments[item.appointments.length - 1] || null
                }))
                return base
            }
        },
        methods: {
            setLeadName () {
                this.$store.dispatch('setLeadName', this.searchString)
            },
            updatePagination (data) {
                this.$store.dispatch('updatePagination', data)
            }
        },
        watch: {
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

