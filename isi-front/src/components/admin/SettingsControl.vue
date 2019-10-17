<template>
    <v-container grid-list-md>
        <v-layout wrap>
            <v-flex xs12 sm6 md4>
                <v-card class="round-corner">
                    <v-card-title class="light-blue darken-3"
                                  style="height: 2em; margin: 0; padding: 0"
                    >
                        <span class="subheading white--text"
                              style="margin: 0 1em"
                        >
                            Переключатель островков
                        </span>
                    </v-card-title>
                    <v-card-text>
                        <span>
                            <span>
                                Максимальное количество аватаров
                            </span>
                               <v-select
                                   v-model="maxAvaCount"
                                   :items="avaCountValues"
                                   single-line
                                   style="width: 2em; display: inline-flex"
                               />
                        </span>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    export default {
        name: 'SettingsControl',
        data: () => ({
            avaCountValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }),
        computed: {
            maxAvaCount: {
                get () {
                    return this.$store.state.settings.data.switcherPanel.maxAvaCount
                },
                set (val) {

                }
            }
        }
    }
</script>
<style scoped>
    .round-corner{
        border-radius: 5px;
    }
</style>
