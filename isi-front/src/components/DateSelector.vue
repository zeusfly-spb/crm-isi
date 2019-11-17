<template>
    <v-layout align-center justify-center row fill-height>
        <v-btn
            icon
            title="Переключить на предыдущий день"
            @click="toPrev"
        >
            <v-icon>navigate_before</v-icon>
        </v-btn>
        <div>

            <v-menu
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                v-model="menu"
            >
                <template v-slot:activator="{ on }">
                    <v-text-field
                        :label="accountingDate | moment('DD MMMM YYYY г.')"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title scrollable
                               @change="datePicked"
                               locale="ru"
                               first-day-of-week="1"
                >
                </v-date-picker>
            </v-menu>
        </div>
        <v-btn
            icon
            title="Переключить на следующий день"
            @click="toNext"
        >
            <v-icon>navigate_next</v-icon>
        </v-btn>
    </v-layout>

</template>

<script>
    export default {
        data: () => ({
            date: '',
            menu: false
        }),
        computed: {
            accountingDate () {
                return this.$store.state.accountingDate
            },
            isToday () {
                return this.$store.getters.isToday
            }
        },
        methods: {
            toPrev () {
                let current = new Date(this.accountingDate + 'T12:00:00')
                let prev = new Date(this.accountingDate + 'T12:00:00')
                prev.setDate(current.getDate() - 1)
                this.datePicked(prev.toISOString().split('T')[0])
            },
            toNext () {
                let current = new Date(this.accountingDate + 'T12:00:00')
                let next = new Date(this.accountingDate + 'T12:00:00')
                next.setDate(current.getDate() + 1)
                this.datePicked(next.toISOString().split('T')[0])
            },
            datePicked (val) {
                this.$store.dispatch('changeAccountingDate', val)
                this.menu = false
            }
        }
    }
</script>
