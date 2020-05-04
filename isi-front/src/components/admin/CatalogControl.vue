<template>
    <v-container
        grid-list-md
    >
        <v-layout wrap>
            <services-catalog/>
            <subscriptions-catalog/>
        </v-layout>
    </v-container>
</template>
<script>
    import ServicesCatalog from './catalogs/ServicesCatalog'
    import SubscriptionsCatalog from './catalogs/SubscriptionsCatalog'
    export default {
        name: 'CatalogControl',
        components: {
            ServicesCatalog,
            SubscriptionsCatalog
        }
    }
</script>
