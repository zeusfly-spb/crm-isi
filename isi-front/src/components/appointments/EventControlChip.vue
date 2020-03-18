<template>
    <v-chip>
        <v-icon
            size="20"
            color="green"
            class="clickable"
            title="Редактировать запись"
            @click="$store.commit('SET_EDITED_EVENT', event)"
        >
            edit
        </v-icon>
        <v-icon
            size="20"
            color="red"
            class="clickable"
            title="Удалить запись"
            v-if="isSuperadmin"
            @click="$store.commit('ATTEMPT_TO_DELETE_EVENT', event)"
        >
            delete
        </v-icon>
    </v-chip>
</template>
<script>
    export default {
        name: 'EventControlChip',
        props: ['event'],
        computed: {
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            }
        }
    }
</script>
