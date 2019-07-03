<template>
    <v-layout justify-center>
        <v-dialog
            v-model="dialog"
            max-width="600px"
        >
            <template v-slot:activator="{ on }">
                <v-btn color="primary" flat dark class="mb-2" @click="">Добавить расход</v-btn>
            </template>

        </v-dialog>
    </v-layout>
</template>
<script>
    export default {
        name: 'ExpensesTable',
        data: () => ({
            dialog: false
        })
    }
</script>
