<template>
    <div
        class="cabinet-switcher text-md-center"
    >
        <v-btn
            v-for="(cabinet, index) in cabinets"
            :key="index"
        >
            {{ cabinet.name }}
        </v-btn>
    </div>
</template>

<script>
    export default {
        name: 'CabinetSwitcher',
        computed: {
            cabinets () {
                return this.workingIsland && this.workingIsland.cabinets
            },
            workingIsland () {
                return this.$store.getters.workingIsland
            },
        }
    }
</script>

<style scoped>
    .cabinet-switcher {
        width: 100%;
        height: 100%;
    }
</style>
