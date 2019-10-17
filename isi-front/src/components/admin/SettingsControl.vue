<template>
    <v-container grid-list-md>
        <v-snackbar
            v-model="snackbar"
            auto-height
            top
            :timeout="3000"
            :color="snackColor"
        >
            <span>{{ snackText }}</span>
        </v-snackbar>
        <v-layout wrap>
            <v-flex xs12 sm6 md4>
                <v-card class="round-corner">
                    <v-card-title class="light-blue darken-3"
                                  style="height: 2em; margin: 0; padding: 0"
                    >
                        <span class="subheading white--text"
                              style="margin: 0 1em"
                        >
                            Панель выбора островка
                        </span>
                    </v-card-title>
                    <v-card-text class="text-xs-center">
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
            avaCountValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            snackbar: false,
            snackColor: 'green',
            snackText: ''
        }),
        computed: {
            maxAvaCount: {
                get () {
                    return this.$store.state.settings.data.switcherPanel.maxAvaCount
                },
                set (val) {
                    let allData = {...this.$store.state.settings.data, switcherPanel: {maxAvaCount: val}}
                    this.$store.dispatch('updateSetting', {data: allData})
                        .then(() => this.showSnack('Количество аватаров сотрудников на панели выбора островка изменено', 'green'))
                }
            }
        },
        methods: {
            showSnack (text, color) {
                this.snackColor = color
                this.snackText = text
                this.snackbar = true
            }
        }
    }
</script>
<style scoped>
    .round-corner{
        border-radius: 5px;
    }
</style>
