<template>
    <v-flex>
        <v-data-table
            v-blur="subscribesLoading"
            :headers="headers"
            :items="subscribes"
            hide-actions
        >
            <template
                v-slot:items="props"
            >
                <subscribe
                    :index="props.index"
                    :subscribe="props.item"
                />
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет оформленных абонементов</span>
            </template>
        </v-data-table>
        <subscribe-comments/>
        <subscribe-events/>
    </v-flex>
</template>
<script>
    import Subscribe from './Subscribe'
    import SubscribeComments from './SubscribeComments'
    import SubscribeEvents from './SubscribeEvents'
    export default {
        name: 'SubscribesTable',
        data: () => ({
            headers: [
                {text: '#', value: null, sortable: false},
                {text: 'Заказчик', value: 'customer_id'},
                {text: 'Оформил', value: 'user_id'},
                {text: 'Абонемент', value: 'subscription_id'},
                {text: 'Начало периода', value: 'start_date'},
                {text: 'Окончание периода', value: 'finish_date'},
                {text: 'Записи', value: 'rate'},
                {text: 'Комментарии', value: null, sortable: false}
            ]
        }),
        computed: {
            subscribesLoading () {
                return this.$store.state.subscribes.subscribesLoading
            },
            subscribes () {
                return this.$store.state.subscribes.subscribes
            }
        },
        created () {
            this.$store.dispatch('setSubscribes')
        },
        components: {
            Subscribe,
            SubscribeComments,
            SubscribeEvents
        }
    }
</script>

<style scoped>
    tr:hover {
        background-color: transparent !important;
    }
    td:hover {
        background-color: transparent !important;
    }
</style>
