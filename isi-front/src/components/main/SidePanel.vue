<template>
    <v-navigation-drawer
        app
        fixed
        clipped
        :value="status"
    >
        test!!
    </v-navigation-drawer>

</template>
<script>
    export default {
        name: 'SidePanel',
        computed: {
            status () {
                return this.$store.state.layout.sidePanel
            }
        }
    }
</script>
