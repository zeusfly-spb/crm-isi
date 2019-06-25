<template>
    <v-flex align-center>
        Склад
    </v-flex>
</template>
<script>
    export default {
        name: 'StockPanel',
        computed: {
            insoles () {
                return this.$store.state.insoles
            }
        }
    }
</script>
