<template>
    <v-flex
        align-center
    >
        <v-tabs
            v-if="isSuperadmin"
            fixed-tabs
            centered
            slider-color="green"
            height="70"
            @change="setCurrentIslandId"
            hide-slider
        >
            <v-tab
                v-for="tab in tabs"
                :key="tab.id"
                @click="changeCurrentIslandId(tab.id)"
            >
                <v-card
                    :class="{'blue lighten-3': tab.id === workingIslandId}"
                    height="65"
                >
                    <v-card-text style="padding: 10px!important;">
                        <v-avatar
                            size="30px"
                            v-for="user in tab.users"
                            :key="user.id"
                            style="margin-right: .1em; margin-left: .1em"
                        >
                            <img :src="`${basePath}${user.avatar ? user.avatar : '/img/default.jpg'}`"
                                 alt="Фото"
                                 :title="user.full_name"
                            />
                        </v-avatar>

                        <v-card-actions class="m-0 p-0" style="padding: 5px!important;"
                                        :class="{'mt-2': (tab.users && !tab.users.length) && tab.id !== 0}"
                        >
                            <div class="text-center">{{ tab.name }}</div>
                        </v-card-actions>

                    </v-card-text>
                </v-card>
            </v-tab>
        </v-tabs>

        <v-layout v-if="dates && dates.length < 12">
            <v-data-table
                :items="['', ...users]"
                :headers="headers"
                hide-actions
                class="elevation-1"
            >
                <template v-slot:items="props">
                    <component
                        :is="props.index === 0 ? 'total-data-row' : 'user-row'"
                        :user="props.item"
                        :dates="dates"
                    />
                </template>
            </v-data-table>
        </v-layout>

        <div
            v-else
            style="width: 100%; overflow: hidden"
            id="long-list"
            onselect="return false"
            @mousedown="listMouseDown"
            @mouseup="listMouseUp"
            @mousemove="listMouseMove"
        >
            <v-data-table
                :items="['', ...users]"
                :headers="headers"
                hide-actions
                class="elevation-1"
            >
                <template v-slot:items="props">
                    <component
                        :is="props.index === 0 ? 'total-data-row' : 'user-row'"
                        :user="props.item"
                        :dates="dates"
                    />
                </template>
            </v-data-table>

        </div>


    </v-flex>
</template>
<script>
    import TotalDataRow from './TotalDataRow'
    import UserRow from './UserRow'

    export default {
        name: 'SalaryPanel',
        data: () => ({
            dragMode: false
        }),
        computed: {
            headers () {
                let dates = this.dates && this.dates.map(item => ({
                    text: this.hDate(item),
                    value: item,
                    sortable: false,
                    align: 'center'
                })) || []
                return [{
                    text: '',
                    value: null,
                    sortable: false,
                    align: 'center',
                    width: '370px'
                }, ... dates]
            },
            dates () {
                let today = new Date(this.$store.state.realDate)
                let tomorrow = today.setDate(today.getDate() + 1)
                return this.monthData && this.monthData.dates.filter(item => new Date(item) < tomorrow)
            },
            users () {
                let base =  this.monthData && this.monthData.users || []
                const add = (a, b) => a + +b.income
                base = base.map(item => ({... item, totalIncome: item.monthDeals.reduce(add, 0)}))
                const sortByTotalIncome = (a, b) => {
                    return b.totalIncome - a.totalIncome
                }
                return base.sort(sortByTotalIncome)
            },
            monthData () {
                return this.$store.state.salary.monthData
            },
            basePath () {
                return this.$store.state.basePath
            },
            workingIslandId () {
                return this.$store.state.workingIslandId
            },
            islands () {
                return this.$store.state.islands
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            tabs () {
                return [{id: 0, name: 'Все островки', users: [{avatar: '/img/logo.png'}]}, ...this.islands]
            }
        },
        methods: {
            listMouseMove () {
                if (!dragMode) {
                    document.body.style.cursor = 'default'
                }
            },
            listMouseUp () {
                this.dragMode = false
                document.body.style.cursor = 'default'
            },
            listMouseDown (e) {
                this.dragMode = true
                let centerX = document.body.clientWidth / 2
                document.body.style.cursor = e.clientX < centerX ? 'w-resize' : 'e-resize'
            },
            hDate (textDate) {
                let date = new Date(textDate)
                let options = {month: 'short', day: 'numeric'}
                return date.toLocaleDateString('ru-RU', options)
            },
            setCurrentIslandId (index) {
                this.$store.dispatch('setWorkingIslandId', this.tabs[index].id)
            },
            changeCurrentIslandId (id) {
                this.$store.dispatch('setWorkingIslandId', id)
            }
        },
        watch: {
            dates (val) {
                this.bottomPanel = val.length > 10
            }
        },
        components: {
            UserRow,
            TotalDataRow
        }
    }
</script>
<style>
    ::selection {
        background: transparent;
    }
    ::-moz-selection {
        background: transparent;
    }
</style>
