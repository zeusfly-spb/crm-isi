<template>
    <v-flex>
        <v-dialog
            v-model="dialog"
            max-width="600px"
        >
            <template v-slot:activator="{ on }">
                <v-btn color="black" flat dark class="mb-2" @click="">Добавить расход</v-btn>
            </template>

        </v-dialog>
    </v-flex>
</template>
<script>
    export default {
        name: 'ExpensesTable',
        data: () => ({
            dialog: false
        })
    }
</script>
