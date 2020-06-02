<template>
    <v-container
        grid-list-md
    >
        <v-layout wrap>
            <services-catalog/>
            <subscriptions-catalog/>
            <notifications-control/>
        </v-layout>
    </v-container>
</template>
<script>
    import ServicesCatalog from './catalogs/ServicesCatalog'
    import SubscriptionsCatalog from './catalogs/SubscriptionsCatalog'
    import NotificationsControl from './catalogs/NotificationsControl'
    export default {
        name: 'CatalogControl',
        components: {
            ServicesCatalog,
            SubscriptionsCatalog,
            NotificationsControl
        }
    }
</script>
