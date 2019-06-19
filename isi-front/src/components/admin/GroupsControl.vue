<template>
    <v-flex aling-center>
        <v-snackbar
            v-model="snackbar"
            auto-height
            top
            :timeout="3000"
            :color="snackColor"
        >
            <span>{{ snackText }}</span>
        </v-snackbar>

        <v-data-table
            :headers="headers"
            :items="groups"
            hide-actions
            class="elevation-1"
        >
            <template v-slot:items="props">
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.description }}</td>
                <td>Сотрудники</td>
                <td class="justify-center layout px-0">
                    <v-icon
                        small
                        class="mr-2 green--text"
                        @click=""
                        title="Редактировать"
                    >
                        edit
                    </v-icon>
                    <v-icon
                        class="red--text"
                        small
                        @click=""
                        title="Удалить"
                    >
                        delete
                    </v-icon>
                </td>
            </template>

        </v-data-table>



    </v-flex>
</template>

<script>
    export default {
        name: 'GroupsControl',
        data: () => ({
            snackbar: false,
            snackColor: 'green',
            snackText: '',
            headers: [
                {text: '#', value: 'id'},
                {text: 'Название', value: 'name'},
                {text: 'Описание', value: 'description', sortable: false},
                {text: 'Сотрудники', sortable: false},
                {text: 'Действия', sortable: false, align: 'center'}
            ]
        }),
        computed: {
            groups () {
                return this.$store.state.groups
            }
        }
    }
</script>
