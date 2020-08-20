<template>
    <v-sheet
        class="p-0 mb-1 round-corner"
        elevation="2"
        :color="color"
    >
        <span
            class="pl-2 text-center body-2"
        >
            Дополнительные коды телефонии
        </span>
        <v-btn
            small
            icon
            title="Добавить код телефонии"
        >
            <v-icon
                color="green"
                @click="addMode = true"
            >
                add
            </v-icon>
        </v-btn>
        <v-data-table
            :items="additionalTelephonyCodes"
            :headers="headers"
            hide-actions
        >
            <template v-slot:headers="{ headers }">
                <tr
                        :style="{backgroundColor: `${$store.getters.colorValue(color)}!important`}"
                >
                    <th
                            v-for="(header, index) in headers"
                            :key="index"
                    >
                        {{ header.text }}
                    </th>
                </tr>
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет дополнительных телефонных кодов</span>
            </template>
        </v-data-table>
        <v-dialog
            v-model="addMode"
            max-width="700px"
        >
            <v-card
                class="round-corner"
            >
                <v-card-title
                    class="light-blue darken-3"
                >
                    <v-icon
                        color="white"
                        class="mr-2"
                    >
                        add_ic_call
                    </v-icon>
                    <span
                        class="title white--text"
                    >
                        Добавить телефонный код
                    </span>
                    <v-spacer/>
                    <v-icon
                        class="clickable"
                        color="white"
                        title="Закрыть"
                        @click="addMode = false"
                    >
                        close
                    </v-icon>
                </v-card-title>
                <v-card-text>
                    <v-container
                        grid-list-md
                        class="p-0 m-0"
                    >
                        <v-layout wrap>
                            <v-flex
                                    xs12 sm6 md6
                            >
                                <v-text-field
                                        v-model="newTelCode.value"
                                />
                            </v-flex>
                            <v-flex
                                    xs12 sm6 md6
                            >
                                <v-text-field
                                        v-model="newTelCode.description"
                                />
                            </v-flex>
                        </v-layout>
                    </v-container>

                </v-card-text>

            </v-card>

        </v-dialog>
    </v-sheet>
</template>

<script>
    export default {
        name: 'AdditionalTelephonyCodesControl',
        props: {
            island_id: Number
        },
        data: () => ({
            newTelCode: {value: '', description: ''},
            addMode: false,
            color: 'teal lighten-5',
            island: null,
            headers: [
                {text: 'Код', value: null, sortable: false},
                {text: 'Примечание', value: null, sortable: false},
                {text: 'Действия', value: null, sortable: false},
            ]
        }),
        computed: {
            additionalTelephonyCodes: {
                get () {
                    const value = () => this.island.options.additionalTelephonyCodes || []
                    return this.island && this.island.options && value() || []
                },
                set (val) {
                    this.$store.dispatch('setIslandOption', {
                        island_id: this.island.id,
                        key: 'additionalTelephonyCodes',
                        value: val
                    })
                        .finally(() => this.setIsland())
                }
            }
        },
        methods: {
            setIsland () {
                this.island = this.$store.state.islands.find(item => +item.id === +this.island_id)
            }
        },
        created () {
            this.setIsland()
        },
        watch: {
            addMode (val) {
                !val ? this.newTelCode = {value: '', description: ''} : null
            }
        }
    }
</script>

<style scoped>

</style>
