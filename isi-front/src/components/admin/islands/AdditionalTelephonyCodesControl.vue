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
    </v-sheet>
</template>

<script>
    export default {
        name: 'AdditionalTelephonyCodesControl',
        props: {
            island_id: Number
        },
        data: () => ({
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
        }
    }
</script>

<style scoped>

</style>
