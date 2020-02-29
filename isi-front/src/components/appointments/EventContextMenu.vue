<template>
    <v-menu
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
                                :color="{active: 'blue', cancelled: 'red', completed: 'green'}[event.status]"
                        >
                            {{ {active: 'event', completed: 'event_available', cancelled: 'event_busy'}[event.status] }}
                        </v-icon>
                        <span
                                class="green--text body-2 mr-1"
                        >
                                <strong>{{ event.date | moment('DD MMM YYYY г. HH:mm')}}</strong>
                            </span>
                        <span
                                class="body-2"
                        >
                                <strong>
                                    {{ event.client_name }}
                                </strong>
                            </span>
                    </v-list-tile-title>
                </v-list-tile>
                <v-divider/>
                <v-list-tile
                        v-for="(item, index) in contextMenuItems"
                        :key="index"
                        :title="can(item.action) ? '' : 'Невозможно выполнить операцию'"
                        @click="can(item.action) ? performAction(item.action) : null"
                >
                    <v-list-tile-title
                            :class="{disabled: !can(item.action) }"
                    >
                           <span class="body-2 right">
                                {{ item.title }}
                            </span>
                        <v-icon
                                :class="{disabled: !can(item.action) }"
                                :color="{active: 'blue', 'done': 'green', cancel: 'red'}[item.action]"
                        >
                            {{ `${ {active: 'event', done: 'event_available', cancel: 'event_busy'}[item.action] }`  }}
                        </v-icon>

                    </v-list-tile-title>
                </v-list-tile>
            </v-list>
        </div>
    </v-menu>
</template>
<script>
    export default {
        name: 'EventContextMenu',
        props: ['event', 'activator', 'selector'],
        data: () => ({
            contextMenuRaw: [
                {title: 'Сменить статус на "Выполнено"', action: 'done'},
                {title: 'Сменить статус на "Отменено"', action: 'cancel'},
                {title: 'Сменить статус на "Активно"', action: 'active'},
            ]
        }),
        computed: {
            contextMenuItems () {
                let toExcept = {active: 'active', cancelled: 'cancel', completed: 'done'}[this.event.status]
                return this.contextMenuRaw.filter(item => item.action !== toExcept)
            },
            visible: {
                get () {
                    return this.activator
                },
                set (val) {
                    this.$emit(val ? 'show' : 'hide')
                }
            }
        },
        methods: {
            dialogLockControl (val) {
                val ? this.$store.commit('LOCK_DIALOG') : this.$store.commit('UNLOCK_DIALOG')
            },
            performAction (action) {
                this.$store.dispatch('changeEventStatus', {
                    event_id: this.event.id,
                    status: `${{done: 'completed', cancel: 'cancelled', active: 'active'}[action]}`
                })
                    .then(() => {
                        this.visible = false
                        let text = `Статус записи изменен на ${{done: 'Выполнено', cancel: 'Отменено', active: 'Активно'}[action]}`
                        this.$store.commit('SEND_EVENT_MESSAGE', {color: 'green', text: text})
                    })
            },
            can (action) {
                switch (action) {
                    case 'done':
                        return this.event.status !== 'completed' || false
                    case 'cancel':
                        return this.event.status !== 'cancelled' || false
                    case 'active':
                        return this.event.status !== 'active' || false
                }
            }
        },
        mounted () {
            this.visible = this.activator
        },
        watch: {
            visible (val) {
                this.dialogLockControl(val)
            }
        }
    }
</script>
<style scoped>
    .main-list-tile {
        margin: 0!important;
        padding: 0!important;
    }
    .list-style {
        margin: 0!important;
        padding: 0!important;
    }
    .context-menu {
        cursor: default;
    }
</style>