<template>
    <v-card class="round-corner">
        <v-snackbar
            v-model="snackbar"
            auto-height
            top
            :timeout="3000"
            :color="snackColor"
        >
            <span>{{ snackText }}</span>
        </v-snackbar>
        <v-card-title class="light-blue darken-3"
                      style="height: 2em; margin: 0; padding: 0"
        >
            <span class="subheading white--text"
                  style="margin: 0 1em"
            >
                Настройки показа страницы зарплаты
            </span>
        </v-card-title>
        <v-card-text>
            <v-layout>
                <v-switch v-model="visible" label="Показывать страницу зарплаты"/>
            </v-layout>
        </v-card-text>

    </v-card>
</template>
<script>
    export default {
        name: 'SalarySettings',
        data: () => ({
            snackColor: 'green',
            snackText: '',
            snackbar: false
        }),
        computed: {
            base () {
                return this.$store.state.settings.data
            },
            visible: {
                get () {
                    return this.base.salaryPage.visible
                },
                set (val) {
                    let allData = {...this.base, salaryPage: {...this.base.salaryPage, visible: val}}
                    this.$store.dispatch('updateSetting', {data: allData})
                        .then(() => this.showSnack('Изменена видимость страницы зарплаты для сотрудников', 'green'))
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
