<template>
    <v-layout justify-center class="mt-1">
        <v-flex xs12 sm6 md4 justify-center>
            <v-data-table
                v-if="expenses.length"
                :items="expenses"
                :headers="headers"
                hide-actions
                hide-headers
            >
                <template v-slot:items="props">
                    <td align="center">
                        <v-icon class="red--text delete"
                                :title="`Удалить расход ${props.item.comment} ${props.item.amount}р.`"
                        >
                            clear
                        </v-icon>
                    </td>
                    <td align="center">
                        <v-avatar
                            size="36px"
                        >
                            <img :src="basePath + props.item.user.avatar" alt="Фото" v-if="props.item.user.avatar">
                            <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
                        </v-avatar>
                    </td>
                    <td align="center">{{ props.item.amount }}</td>
                    <td align="center">{{ props.item.comment }}</td>
                </template>
            </v-data-table>
            <div class="text-xs-center" v-if="isToday">
                <v-btn color="primary" flat dark class="mb-2" @click="showDialog">
                    Добавить расход
                </v-btn>
            </div>
            <v-dialog
                v-model="dialog"
                max-width="400px"
            >
                <v-card>
                    <v-card-title>
                        <span class="headline">Добавить расход</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field
                                        label="Сумма"
                                        autofocus
                                        maxlength="5"
                                        v-model="amount"
                                        data-vv-as="Сумма"
                                        data-vv-name="amount"
                                        :error-messages="errors.collect('amount')"
                                        v-validate="'required|integer'"
                                    />
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field
                                        label="Комментарий"
                                        v-model="comment"
                                        data-vv-as="Комментарий"
                                        data-vv-name="comment"
                                        :error-messages="errors.collect('comment')"
                                        v-validate="'required'"
                                    />
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" flat @click="dialog = false">Отмена</v-btn>
                        <v-btn color="green darken-1" flat @click="saveExpense">Сохранить</v-btn>
                    </v-card-actions>
                </v-card>

            </v-dialog>
        </v-flex>

    </v-layout>
</template>
<script>
    export default {
        name: 'ExpensesTable',
        data: () => ({
            comment: '',
            amount: '',
            dialog: false,
            headers: [
                {text: 'Действие'},
                {text: 'Фото'},
                {text: 'Сумма'},
                {text: 'Комментарий'}
            ]
        }),
        computed: {
            realDate () {
                return this.$store.state.realDate
            },
            isToday () {
                return this.$store.state.accountingDate === this.realDate
            },
            expenses () {
                return this.$store.state.expenses
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            basePath () {
                return this.$store.state.basePath
            },
            authUser () {
                return this.$store.state.authUser
            },
            isDayOpen () {
                return this.$store.getters.isDayOpen
            },
        },
        methods: {
            saveExpense () {
                this.$validator.validate()
                    .then(res => {
                        if (!res) return
                        this.$store.dispatch('addExpense', {
                            amount: this.amount,
                            comment: this.comment
                        })
                            .then(() => {
                                this.dialog = false
                                this.$emit('snack', `Расход на сумму ${this.amount} р, ${this.comment} добавлен`, 'green')
                            })
                            .catch(e => this.$emit('snack', e.data, 'red'))
                    })
            },
            showDialog () {
                if (!this.isDayOpen) {
                    this.$emit('snack', 'Чтобы добавить расход, начните рабочий день', 'red')
                    return
                }
                this.amount = ''
                this.comment = ''
                this.dialog = true
            }
        }
    }
</script>
<style scoped>
    .delete {
        cursor: pointer;
        opacity: .6;
    }
    .delete:hover {
        opacity: 1;
    }
</style>
