<template>
    <v-flex>
        <v-data-table
                :headers="headers"
                :items="deals"
                hide-actions
                class="elevation-1"
        >
            <template v-slot:items="props">
                <tr>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.id }}</td>
                </tr>
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет сделок</span>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
                <v-btn color="primary" flat dark class="mb-2" @click="dialog = true">Новая сделка</v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">Новая сделка</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout row>
                            <v-flex xs12 sm12 md12>
                                <!--<sub>Клиент</sub>-->
                                <v-select
                                        label="Клиент"
                                        v-model="selectedCustomerId"
                                        :items="customers"
                                        item-text="full_name"
                                        item-value="id"
                                        single-line
                                        data-vv-name="customer"
                                        data-vv-as="Клиент"
                                        :error-messages="errors.collect('customer')"
                                        v-validate="'required'"
                                >
                                </v-select>
                            </v-flex>

                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" flat @click="dialog = false">Отмена</v-btn>
                    <v-btn color="green darken-1" flat @click="">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-flex>
</template>
<script>
    export default {
        name: 'DealsTable',
        data: () => ({
            selectedCustomerId: null,
            dialog: false,
            headers: [
                {text: '#', value: 'id'},
                {text: 'Клиент', value: 'customer_id'},
                {text: 'Услуга', value: 'insole_id'},
                {text: 'Стоимость', value: 'income'},
                {text: 'Расход', value: 'expense'},
                {text: 'Форма оплаты', value: 'is_cache'},
            ]
        }),
        computed: {
            customers () {
                return this.$store.state.customers
            },
            deals () {
                return this.$store.state.deals
            }
        }
    }
</script>