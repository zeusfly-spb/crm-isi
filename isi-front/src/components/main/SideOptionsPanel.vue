<template>
    <v-flex>
        <span
            class="title"
        >
            Настройки отображения
        </span>
        <v-switch
            v-model="miniMode"
            label='Режим "Мини"'
            :true-value="true"
            :false-value="false"
        />
    </v-flex>
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
                }
            }
        }
    }
</script>