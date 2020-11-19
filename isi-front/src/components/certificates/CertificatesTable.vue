<template>
    <v-flex>
        <certificate-mode-switcher/>
        <v-data-table
                :pagination.sync="defSorting"
                :headers="headers"
                :items="certificates"
                hide-actions
        >
            <template
                    v-slot:items="props"
            >
                <certificate
                        :index="props.index"
                        :certificate="props.item"
                />
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет оформленных сертификатов</span>
            </template>
        </v-data-table>
    </v-flex>
</template>

<script>
    import CertificateModeSwitcher from './CertificateModeSwitcher'
    import Certificate from './Certificate'
    export default {
        name: 'CertificatesTable',
        data: () => ({
            defSorting: {'sortBy': 'start_date', 'ascending': false, 'rowsPerPage': -1},
            headers: [
                {text: '#', value: null, sortable: false},
                {text: 'Заказчик', value: 'customer_id'},
                {text: 'Оформил', value: 'user_id'},
                {text: 'Начало периода', value: 'start_date'},
                {text: 'Срок действия (дн.)', value: 'duration'},
                {text: 'Окончание периода', value: 'finish_date'},
                {text: 'Списания', value: null, sortable: false},
                {text: 'Комментарии', value: null, sortable: false}
            ]
        }),
        computed: {
            certificates () {
                return this.$store.state.subscribes.certificates
            }
        },
        created() {
            this.$store.dispatch('setCertificates')
        },
        components: {
            CertificateModeSwitcher,
            Certificate
        }
    }
</script>

<style scoped>

</style>
