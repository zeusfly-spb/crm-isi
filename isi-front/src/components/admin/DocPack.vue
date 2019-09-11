<template>
    <v-flex>
        <v-icon
            class="clickable"
            :title="`Пакет документов сотрудника ${user.full_name}`"
            @click="active = true"
        >
            insert_drive_file
        </v-icon>
        <v-dialog
            persistent
            v-model="active"
            max-width="700px"
        >
            <v-card>
                <v-card-title
                    class="light-blue lighten-3"
                >
                    <span class="title">{{ `Документы сотрудника ${user.full_name}` }}</span>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                        :headers="headers"
                        :items="docs"
                        hide-actions
                        hide-headers
                        class="elevation-1"
                    >
                        <template v-slot:items="props">
                            <td>{{ props.item.title }}</td>
                            <td>
                                <v-icon>remove_red_eye</v-icon>

                            </td>
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="active = false">Закрыть</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script>
    export default {
        name: 'DocPack',
        props: ['user'],
        data: () => ({
            active: false,
            headers: [
                {
                    text: 'Наименование',
                    sortable: false,
                    value: null,
                    align: 'center'
                },
                {
                    text: 'Действия',
                    sortable: false,
                    value: null,
                    align: 'center'
                }
            ],
            docs: [
                {field: 'passport', title: 'Паспорт'},
                {field: 'inn', title: 'ИНН'},
                {field: 'snils', title: 'СНИЛС'},
                {field: 'contract', title: 'Трудовой договор'},
                {field: 'secret', title: 'Коммерческая тайна'},
            ]
        })
    }
</script>
<style scoped>
    .clickable {
        cursor: pointer;
        opacity: .6;
    }
    .clickable:hover {
        opacity: 1;
    }
</style>
