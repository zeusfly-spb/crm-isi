<template>
    <div
            class="controls m-0 p-0"
    >
        <v-icon
                small
                color="blue"
                class="clickable"
                :title="`Редактировать сайт ${site.url}`"
                @click="toEdit"
        >
            edit
        </v-icon>
        <v-icon
                small
                color="red"
                class="clickable"
                :title="`Удалить сайт ${site.url}`"
                @click="toDelete"
        >
            delete
        </v-icon>
    </div>

</template>

<script>
    export default {
        name: 'SitesCatalogControls',
        props: {
            site: Object
        },
        methods: {
            toDelete () {
                this.$store.commit('SET_SITE_TO_DELETE', this.site)
            },
            toEdit () {
                this.$store.commit('SET_SITE_TO_EDIT', this.site)
            }
        }
    }
</script>

<style scoped>
    .controls {
        display: inline-flex;
    }
</style>
