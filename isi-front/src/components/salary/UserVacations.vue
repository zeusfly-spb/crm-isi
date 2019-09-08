<template>
    <v-flex>
        <strong
            @click="dialog = true"
            class="clickable"
            v-if="canUpdate"
        >
            {{ +totalVacationsAmount.toFixed(2) | pretty }}
        </strong>
        <strong v-else>{{ +totalVacationsAmount.toFixed(2) | pretty }}</strong>
        <v-dialog
            v-model="dialog"
            max-width="700px"
            persistent
        >
            <v-card>
                <v-card-title>
                    <span class="headline">
                        {{ `Отпускные сотрудника ${user.full_name}`}}
                    </span>
                </v-card-title>
                <v-card-text>
                    <v-container
                        grid-list-md
                        style="padding: 0!important; margin: 0!important;"
                    >
                        <v-flex>
                            <v-data-table
                                :items="vacations"
                                :headers="headers"
                                hide-actions
                            >
                                <template v-slot:items="props">
                                    <td>
                                        <v-icon
                                            class="red--text clickable"
                                            :title="`Удалить отпускные сотрудника ${user.full_name} на сумму ${props.item.amount} ${props.item.comment}`"
                                            @click="showPrompt(props.item)"
                                        >
                                            clear
                                        </v-icon>
                                    </td>
                                    <td>{{ props.item.created_at | moment('DD MMMM YYYY г.') }}</td>
                                    <td>{{ props.item.amount }}</td>
                                    <td>{{ props.item.comment }}</td>
                                </template>
                                <template v-slot:no-data>
                                    <span class="red--text">Нет отпускных</span>
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
                                    @click="addVacation"
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
                        Добавить отпускной
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="prompt"
            max-width="500px"
            v-if="vacationToDelete"
        >
            <v-card>
                <v-card-title><span class="headline">Подтвержение</span></v-card-title>
                <v-card-text>
                    <v-layout grid-list-md>
                        {{`Удалить отпускной сотрудника ${user.full_name} от ${$store.state.hDate(vacationToDelete.created_at)} на сумму ${vacationToDelete.amount} р. ${vacationToDelete.comment}?`}}
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="prompt = false">Закрыть</v-btn>
                    <v-btn
                        color="red darken-1"
                        flat
                        @click="deleteVacation"
                    >
                        Удалить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
    export default {
        name: 'UserVacations',
        props: ['user'],
        data: () => ({
            vacationToDelete: null,
            prompt: false,
            dialog: false,
            adding: false,
            amount: 0,
            comment: '',
            headers: [
                {text: 'Действие', value: null, align: 'center'},
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
            vacations () {
                return this.user.monthVacations || []
            },
            totalVacationsAmount () {
                const add = (a, b) => a + +b.amount
                return this.vacations.reduce(add, 0)
            }
        },
        methods: {
            showPrompt (vacation) {
                this.vacationToDelete = vacation
                this.prompt = true
            },
            addVacation () {
                if (!this.amount) return
                this.$store.dispatch('addUserVacation', {
                    user_id: this.user.id,
                    amount: this.amount,
                    comment: this.comment
                })
                    .then(() => this.adding = false)
                    .finally(() => this.$emit('update'))
            },
            deleteVacation () {
                this.$store.dispatch('deleteUserVacation', {id: this.vacationToDelete.id})
                    .then(() => this.prompt = false)
                    .finally(() => this.$emit('update'))
            }
        },
        watch: {
            dialog (value) {
                if (value) {
                    [this.amount, this.comment, this.adding] = [0, '', false]
                }
            },
            adding (value) {
                if (value) {
                    [this.amount, this.comment] = [0, '']
                }
            }
        }
    }
</script>
<style scoped>
    TD {
        text-align: center;
    }
    .clickable {
        cursor: pointer;
    }
</style>
