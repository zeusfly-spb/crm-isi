<template>
    <v-container grid-list-md>
        <services-catalog/>
    </v-container>
</template>
<script>
    import ServicesCatalog from './catalogs/ServicesCatalog'
    export default {
        name: 'CatalogControl',
        components: {
            ServicesCatalog
        }
    }
</script>
