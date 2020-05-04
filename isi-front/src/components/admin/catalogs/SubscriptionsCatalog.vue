<template>
    <v-flex xs12 sm6 md6>
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
                    <v-btn
                        flat
                        color="primary"
                        @click=""
                    >
                        Добавить абонемент
                    </v-btn>
                </v-flex>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
    export default {
        name: 'SubscriptionsCatalog'
    }
</script>
