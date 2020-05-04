<template>
    <v-flex xs12 sm12 md12>
        <v-card
            class="round-corner"
        >
            <v-card-title class="light-blue darken-3"
                          style="height: 2em; margin: 0; padding: 0"
            >
                    <span class="subheading white--text"
                          style="margin: 0 1em"
                    >
                        Абонементы
                    </span>
            </v-card-title>
            <v-card-text>
                <v-flex>
                    <subscription-adder/>
                    <subscriptions-table/>
                </v-flex>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
    import SubscriptionAdder from './SubscriptionAdder'
    import SubscriptionsTable from './SubscriptionsTable'
    export default {
        name: 'SubscriptionsCatalog',
        components: {
            SubscriptionsTable,
            SubscriptionAdder
        }
    }
</script>
