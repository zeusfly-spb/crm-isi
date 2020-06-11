<template>
    <v-flex
        v-blur="smsReportsLoading"
    >
        <v-data-table
            :headers="headers"
            :items="smsReports"
            hide-actions
        >
            <template v-slot:no-data>
                <span class="red--text">Нет оповещений от {{ eventsDate | moment('D MMMM YYYY г.') }}</span>
            </template>
        </v-data-table>
    </v-flex>
</template>

<script>
    export default {
        name: 'NotificationTable',
        data: () => ({
            headers: [
                {text: '#', value: null},
                {text: 'Отправитель', value: 'user_id'},
                {text: 'Номер', value: 'number'},
                {text: 'Текст', value: 'text'},
                {text: 'Время', value: 'created_at'}
            ]
        }),
        computed: {
            eventsDate () {
                return this.$store.getters.eventsDate
            },
            smsReportsLoading () {
                return this.$store.state.informer.smsReportsLoading
            },
            smsReports () {
                return this.$store.state.informer.smsReports
            }
        },
        methods: {
            setSmsReports () {
                this.$store.dispatch('setSmsReports')
            }
        },
        created () {
            this.setSmsReports()
        },
        watch: {
            eventsDate (val, oldVal) {
                if (!oldVal) {
                    return
                }
                this.setSmsReports()
            }
        }
    }
</script>

<style scoped>

</style>
