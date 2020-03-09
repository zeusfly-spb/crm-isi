<template>
    <div class="context-menu">
        <v-list
                dense
                class="list-style"
        >
            <v-list-tile
                    class="teal lighten-5 main-list-tile"
            >
                <v-list-tile-title>
                    <v-icon
                            class="mr-2"
                            :color="{process: 'blue', moderate: 'red', done: 'green'}[lead.status]"
                    >
                        {{ {process: 'assignment', done: 'assignment_turned_in', moderate: 'assignment_late'}[lead.status] }}
                    </v-icon>
                    <span
                            class="green--text body-2 mr-1"
                    >
                                <strong>{{ lead.created_at | moment('DD MMM YYYY г. HH:mm')}}</strong>
                            </span>
                    <span
                        class="body-2"
                    >
                        <strong>
                            {{ lead.name }}
                        </strong>
                    </span>
                </v-list-tile-title>
            </v-list-tile>
            <v-divider/>
            <v-list-tile
                v-for="(item, index) in items"
                :key="index"
                @click="performAction(item.action)"
            >
                <v-list-tile-title>
                     <span
                         class="body-2 right"
                     >
                         {{ item.title }}
                     </span>
                    <v-icon
                        :color="item.color"
                    >
                        {{ item.icon }}
                    </v-icon>
                </v-list-tile-title>
            </v-list-tile>
        </v-list>
    </div>
</template>
<script>
    export default {
        name: 'LeadContextMenuEntry',
        props: ['lead'],
        data: () => ({
            itemsRaw: [
                {title: 'Добавить запись по заявке', action: 'add_record', icon: 'event', color: 'blue'}
            ]
        }),
        computed: {
            items () {
                return this.itemsRaw
            }
        },
        methods: {
            performAction (action) {
                console.log(`Performing action "${action}"`)
                this.$emit('done')
            }
        }
    }
</script>
<style scoped>
    .main-list-tile {
        margin: 0!important;
        padding: 0!important;
    }
    .context-menu {
        background-color: white!important;
        cursor: default;
    }
    .list-style {
        margin: 0!important;
        padding: 0!important;
    }
</style>
