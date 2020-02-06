<template>
    <v-flex
        class="light-green white--text"
    >
        <table>
            
        </table>
    </v-flex>
</template>
<script>
    export default {
        name: 'CabinetsModeHeader',
        props: ['cabinets'],
        computed: {
            names () {
                return this.cabinets.map(item => item.name)
            }
        }
    }
</script>
