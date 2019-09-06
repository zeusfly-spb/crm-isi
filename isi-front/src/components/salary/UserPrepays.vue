<template>
    <v-flex>
        <strong
            @click="dialog = true"
            class="clickable"
            v-if="canUpdate"
        >
            {{ +totalPrepaysAmount.toFixed(2) | pretty }}
        </strong>
        <strong v-else>{{ +totalPrepaysAmount.toFixed(2) | pretty }}</strong>
        <v-dialog
            v-model="dialog"
            max-width="700px"
        >
            <v-card>
                <v-card-title>
                <span class="headline">
                    {{ `Выплаты сотруднику ${user.full_name}`}}
                </span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md
                                 class="margin-less"
                    >
                        <v-flex>
                            <v-data-table
                                :items="prepays"
                                :headers="headers"
                                hide-actions
                            >
                                <template v-slot:items="props">
                                    <td>{{ props.item.created_at | moment('DD MMMM YYYY г.') }}</td>
                                    <td>{{ props.item.amount }}</td>
                                    <td>{{ props.item.comment }}</td>
                                </template>
                                <template v-slot:no-data>
                                    <span class="red--text">Нет выплат</span>
                                </template>
                            </v-data-table>
                        </v-flex>
                        <v-layout v-if="adding">
                            <v-flex xs4>
                                <v-text-field
                                    label="Сумма"
                                    type="number"
                                    style="width: 4em;"
                                    v-model="amount"
                                    maxlength="7"
                                    height="1em"
                                    autofocus
                                />
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field
                                    label="Комментарий"
                                    v-model="comment"
                                    height="1em"
                                />
                            </v-flex>
                            <v-flex>
                                <v-btn
                                    flat color="green"
                                    @click="addPrepay"
                                >
                                    Сохранить
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="dialog = false">Закрыть</v-btn>
                    <v-btn
                        color="green darken-1"
                        flat
                        @click="adding=true"
                        :disabled="adding"
                    >
                        Добавить выплату
                    </v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
    </v-flex>
</template>
<script>
    export default {
        name: 'UserPrepays',
        props: ['user'],
        data: () => ({
            dialog: false,
            adding: false,
            amount: '',
            comment: '',
            headers: [
                {text: 'Дата', value: 'created_at', align: 'center'},
                {text: 'Сумма', value: 'amount', align: 'center'},
                {text: 'Комментарий', value: 'comment', align: 'center'}
            ]
        }),
        computed: {
            canUpdate () {
                return this.isSuperadmin && this.isToday
            },
            isToday () {
                return this.$store.state.accountingDate === this.realDate
            },
            realDate () {
                return this.$store.state.realDate
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            prepays () {
                return this.user.monthPrepays || []
            },
            totalPrepaysAmount () {
                const add = (a, b) => a + +b.amount
                return this.prepays.reduce(add, 0)
            }
        },
        methods: {
            addPrepay () {
                this.$store.dispatch('addUserPrepay', {
                    user_id: this.user.id,
                    amount: this.amount,
                    comment: this.comment
                })
                    .then(() => this.adding = false)
                    .finally(() => this.$emit('update'))
            }
        },
        watch: {
            dialog (value) {
                if (value) {
                    [this.amount, this.comment, this.adding] = [0, '', false]
                }
            }
        }
    }
</script>
<style scoped>
    TD {
        text-align: center;
    }
    .margin-less {
        padding: 0!important;
        margin: 0!important;
    }
    .clickable {
        cursor: pointer;
    }
</style>