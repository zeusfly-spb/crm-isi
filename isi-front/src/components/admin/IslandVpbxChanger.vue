<template>
    <v-flex>
        <span
            :class="{'blue-grey--text lighten-1': !vpbxExtension}"
            class="clickable"
            :title="vpbxExtension ? `Изменить манго код для островка ${island && island.name || ''}` : `Задать манго код для островка ${island && island.name || ''}`"
        >
            {{ vpbxExtension || 'Не задан'}}
        </span>
    </v-flex>
</template>
<script>
    export default {
        name: 'IslandVpbxChanger',
        props: ['island'],
        computed: {
            vpbxExtension () {
                return this.island && this.island.vpbx_extension
            }
        }
    }
</script>
<style>
    .clickable {
        cursor: pointer;
        opacity: .8;
    }
    .clickable:hover {
        opacity: 1;
    }
</style>
