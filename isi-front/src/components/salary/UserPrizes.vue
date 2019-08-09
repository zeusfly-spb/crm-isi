<template>
    <v-dialog
        v-model="dialog"
        max-width="700px"
    >
        <template v-slot:activator="{ on }">
            <strong
                @click="dialog = true"
                class="clickable"
            >
                {{ totalPrizesAmount.toFixed(2) | pretty }}
            </strong>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">
                    {{ `Премии сотрудника ${user.full_name}`}}
                </span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md
                             style="padding: 0!important; margin: 0!important;"
                >
                    <v-flex>
                        <v-data-table
                            :items="prizes"
                            :headers="headers"
                            hide-actions
                        >
                            <template v-slot:no-data>
                                <span class="red--text">Нет премий</span>
                            </template>
                        </v-data-table>

                    </v-flex>
                    <v-layout v-if="adding">
                        <v-flex xs6 sm6 md6>
                            <v-text-field
                                style="width: 3em"
                            />
                        </v-flex>
                        <v-flex xs6 sm6 md6>
                            <v-text-field
                                style="width: 3em"
                            />
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="darken-1" flat @click="dialog = false">Закрыть</v-btn>
                <v-btn color="green darken-1" flat @click="adding=true">Добавить премию</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        name: 'UserPrizes',
        props: ['user'],
        data: () => ({
            adding: false,
            dialog: false,
            headers: [
                {text: 'Дата', value: 'created_at', align: 'center'},
                {text: 'Сумма', value: 'amount', align: 'center'},
                {text: 'Комментарий', value: 'comment', align: 'center'}
            ]
        }),
        computed: {
            prizes () {
                return this.user.monthPrizes || []
            },
            totalPrizesAmount () {
                const add = (a, b) => a + +b.amount
                return this.prizes.reduce(add, 0)
            }
        },
        watch: {
            dialog (value) {
                if (value) {
                    this.adding = false
                }
            }
        }
    }
</script>
<style scoped>
    .clickable {
        cursor: pointer;
    }
</style>
