<template>
    <v-flex>
        Таблица операций
    </v-flex>
</template>
<script>
    export default {
        name: 'StockActionsTable',
        computed: {
            actions () {
                return this.$store.state.stock.stockActions
            }
        }
    }
</script>
