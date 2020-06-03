<template>
    <v-flex>
        <v-btn
            flat
            color="primary"
            @click="$store.commit('SET_ATTEMPT_TO_ADD_NOTIFY_TEMPLATE', true)"
        >
            Добавить шаблон
        </v-btn>
        <v-data-table
            :items="templates"
            :headers="tableHeaders"
            hide-actions
        >
            <template v-slot:items="props">
                <tr>
                    <td
                        class="index"
                    >
                        {{ props.index + 1 }}
                    </td>
                    <td
                        class="name"
                    >
                        {{ props.item.name }}
                    </td>
                    <td
                        class="text"
                    >
                        {{ $store.getters.truncate(props.item.text, 30) }}
                    </td>
                </tr>
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет шаблонов</span>
            </template>
        </v-data-table>
        <notify-template-manager/>
    </v-flex>
</template>

<script>
    import NotifyTemplateManager from './NotifyTemplateManager'
    export default {
        name: 'NotifyTemplates',
        data: () => ({
            tableHeaders: [
                {text: '#', sortable: false},
                {text: 'Название', sortable: false},
                {text: 'Текст', sortable: false},
            ]
        }),
        computed: {
            templates () {
                return this.$store.state.catalog.notifyTemplates
            }
        },
        components: {
            NotifyTemplateManager
        }
    }
</script>

<style scoped>
    .index {
        width: 2em;
    }
    .name {
        width: 24em;
    }
    .text {

    }

</style>
