<template>
    <v-sheet dark height="100%">
        <v-flex
            class="subheading pt-1 text-xs-center"
        >
            <strong>Настройки отображения</strong>
        </v-flex>
        <v-switch
            v-model="miniMode"
            label='Режим "Мини"'
            :true-value="true"
            :false-value="false"
        />
    </v-sheet>
</template>
<script>
    export default {
        name: 'SideOptionsPanel',
        computed: {
            miniMode: {
                get () {
                    return this.$store.getters.miniMode
                },
                set (val) {
                    this.$store.commit('SET_MINI_MODE_VALUE', val)
                    this.$router.go(this.$route.path)
                }
            }
        }
    }
</script>