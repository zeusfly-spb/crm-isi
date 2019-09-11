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
            max-width="1000px"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">{{ `Пакет документов сотрудника ${user.full_name}` }}</span>
                </v-card-title>
                <v-card-text>

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
            active: false
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
