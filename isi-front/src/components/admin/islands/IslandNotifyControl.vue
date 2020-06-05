<template>
    <v-flex
        class="p-0 m-0"
    >
         <span
             class="text-center body-2"
         >
            Оповещения
        </span>
        <v-layout
            class="option-layout p-0 m-0"
        >
            <div
                class="left option-label"
            >
                Напоминание о записи
            </div>
            <v-select
                v-model="eventReminder"
                :items="eventReminderOptions"
                :disabled="!notifyTemplates.length"
                style="max-width: 12em"
                item-text="title"
                item-value="value"
                class="p-0 m-0 reminder-select"
                single-line
            />
            <span
                v-if="eventReminder"
                class="pl-1"
            >
                Шаблон:
            </span>
            <v-select
                v-if="eventReminder"
                v-model="eventReminderTemplateId"
                :items="notifyTemplates"
                style="max-width: 15em"
                item-text="name_short"
                item-value="id"
                class="p-0 m-0 reminder-select"
                single-line
            />

        </v-layout>
    </v-flex>
</template>

<script>
    export default {
        name: 'IslandNotifyControl',
        props: {
            island_id: Number
        },
        data: () => ({
            island: null
        }),
        computed: {
            notifyTemplates () {
                let base = JSON.parse(JSON.stringify(this.$store.state.catalog.notifyTemplates))
                return base.map(item => ({
                    ... item,
                    name_short: this.$store.getters.truncate(item.name, 15)
                }))
            },
            eventReminderOptions () {
                return this.$store.state.informer.eventReminderOptions
            },
            eventReminder: {
                get () {
                    return this.island && this.island.options && this.island.options.EventReminder || null
                },
                set (val) {
                    this.$store.dispatch('setIslandOption', {
                        island_id: this.island.id,
                        key: 'EventReminder',
                        value: val
                    })
                        .finally(() => this.setIsland())
                }
            },
            eventReminderTemplateId: {
                get () {
                    return this.island && this.island.options && this.island.options.EventReminderTemplateId || null
                },
                set (val) {
                    this.$store.dispatch('setIslandOption', {
                        island_id: this.island.id,
                        key: 'EventReminderTemplateId',
                        value: val
                    })
                        .finally(() => this.setIsland())
                }
            }
        },
        methods: {
            setIsland () {
                this.island = this.$store.state.islands.find(item => +item.id === +this.island_id)
            }
        },
        created () {
            this.setIsland()
        },
        watch: {
            eventReminder (val) {
                if (!!val && !this.eventReminderTemplateId) {
                    console.log('Setting first value template id')
                    this.eventReminderTemplateId = this.notifyTemplates[0].id || null
                }
            }
        }
    }
</script>

<style scoped>
    .reminder-select {
        padding-left: 1em;
    }
    .option-layout {
        margin-top: 0!important;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .option-label {
        padding-right: 1em;
        color: rgba(0, 0, 0, 0.54);
    }

</style>
