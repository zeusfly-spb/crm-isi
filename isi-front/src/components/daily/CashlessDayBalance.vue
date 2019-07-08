<template>
    <v-flex xs12 md4 offset-md4 justify-center class="md2"
            v-if="cashlessDeals.length"
    >
        <p class="text-xs-center teal--text darken-3">Безналичные платежи</p>
    </v-flex>
</template>
<script>
    export default {
        name: 'CashlessDayBalance',
        computed: {
            deals () {
                return this.$store.state.deals
            },
            cashlessDeals () {
                return this.deals.filter(item => !item.is_cache)
            }
        }
    }
</script>
