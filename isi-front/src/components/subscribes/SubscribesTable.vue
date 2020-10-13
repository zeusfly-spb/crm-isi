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
                const getters = this.$store.getters
                const attachProperties = events => {
                    return events.map(event => ({
                        ... event,
                        performer: getters.allUsers.find(user => +user.id === +event.performer_id) || {full_name: 'Неизвестный исполнитель'},
                        service: getters.workingIsland.services.find(service => +service.id === +event.service_id) || {description: 'Неизвестная услуга'},
                        island: getters.allIslands.find(island => +island.id === +event.island_id) || {name: 'Неизвестный остров'}
                    }))
                }
                return this.$store.state.subscribes.subscribes.map(item => ({...item, events: attachProperties(item.events)}))
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
