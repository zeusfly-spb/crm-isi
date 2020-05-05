<template>
    <v-flex>
        <v-dialog
            v-model="dialog"
            max-width="600"
        >
            <v-card
                class="round-corner"
            >
                <v-card-title
                    class="red"
                >
                    <span
                        class="white--text title"
                    >
                        Удаление абонемента
                    </span>
                </v-card-title>
                <v-card-text>
                    Подтвердите удаление абнемента <strong>{{ toDelete && toDelete.name || '' }}</strong>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="darken-1" flat @click="hide">Отмена</v-btn>
                    <v-btn color="red darken-1" flat @click="">Удалить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
    export default {
        name: 'SubscriptionRemover',
        data: () => ({
            dialog: false
        }),
        computed: {
            toDelete () {
                return this.$store.state.catalog.subscriptionToDelete
            }
        },
        methods: {
            delete () {
                this.$store.dispatch()
            },
            show () {
                this.dialog = true
            },
            hide () {
                this.$store.commit('UNSET_SUBSCRIPTION_TO_DELETE')
                this.dialog = false
            }
        },
        watch: {
            toDelete (val) {
                val ? this.show() : this.hide()
            }
        }
    }
</script>

<style scoped>

</style>
