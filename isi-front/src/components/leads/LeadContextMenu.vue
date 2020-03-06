<template>
    <v-menu
        v-if="lead"
        v-model="visible"
        :close-on-content-click="false"
        transition="scale-transition"
        :attach="selector"
        :nudge-right="40"
        :nudge-bottom="20"
        lazy
        offset-y
        full-width
        min-width="290px"
    >
        <div
            class="context-menu"
        >
            {{ lead.name }}
        </div>
    </v-menu>
</template>
<script>
    export default {
        name: 'LeadContextMenu',
        props: ['value', 'lead'],
        computed: {
            selector () {
                return `#lead${this.lead.id}`
            },
            visible: {
                get () {
                    return this.value
                },
                set (val) {
                    this.$emit('input', val)
                }
            }
        }
    }
</script>
<style>
    .context-menu {
        cursor: default;
    }
</style>
