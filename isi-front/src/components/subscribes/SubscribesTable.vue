<template>
    <v-flex>
        <v-data-table
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
    </v-flex>
</template>
<script>
    import Subscribe from './Subscribe'
    export default {
        name: 'SubscribesTable',
        data: () => ({
            headers: [
                {text: '#', value: null},
                {text: 'Заказчик', value: 'customer_id'},
                {text: 'Оформил', value: 'user_id'},
                {text: 'Абонемент', value: 'subscription_id'},
                {text: 'Начало периода', value: 'start_date'},
                {text: 'Окончание периода', value: 'finish_date'}
            ]
        }),
        computed: {
            subscribes () {
                return this.$store.state.subscribes.subscribes
            }
        },
        created () {
            this.$store.dispatch('setSubscribes')
        },
        components: {
            Subscribe
        }
    }
</script>

<style scoped>

</style>
