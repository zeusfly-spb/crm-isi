<template>
    <v-layout align-center justify-center row fill-height>
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
            }
        },
        methods: {
            datePicked (val) {
                this.$store.dispatch('changeAccountingDate', val)
                this.menu = false
            }
        }
    }
</script>
