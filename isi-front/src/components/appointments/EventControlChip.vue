<template>
    <v-chip>
        <v-speed-dial
            v-model="fab"
            open-on-hover
            transition="slide-y-reverse-transition"
        >
            <template v-slot:activator>
                <v-icon
                    style="margin-top: 3px"
                    size="20"
                    class="clickable"
                    title="Сменить статус записи"
                    :color="fabStyle.color"
                >
                    {{ fabStyle.icon }}
                </v-icon>
            </template>
            <v-btn
                v-for="(item, index) in statsButtons"
                fab
                dark
                small
                :key="index"
                :color="item.color"
                :title="item.title"
                style="z-index: 1000"
                @click="performAction(item.status)"
            >
                <v-icon>
                    {{ item.icon }}
                </v-icon>
            </v-btn>
        </v-speed-dial>
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
        props: {
            event: Object,
            top: Boolean,
            bottom: Boolean
        },
        data: () => ({
            fab: false,
            statsRaw: [
                {status: 'active', color: 'blue', icon: 'event', title: 'Сменить статус на "Активно"'},
                {status: 'completed', color: 'green', icon: 'event_available', title: 'Сменить статус на "Выполнено"'},
                {status: 'cancelled', color: 'red', icon: 'event_busy', title: 'Сменить статус на "Отменено"'},
            ]
        }),
        computed: {
            statsButtons () {
                return this.statsRaw.filter(item => item.status !== this.event.status)
            },
            fabStyle () {
                return {
                    color: {active: 'blue', completed: 'green', cancelled: 'red'}[this.event.status],
                    icon: {active: 'event', completed: 'event_available', cancelled: 'event_busy'}[this.event.status]
                }
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            }
        },
        methods: {
            performAction (status) {
                this.$store.dispatch('changeEventStatus', {
                    event_id: this.event.id,
                    status: status
                })
                    .then(() => {
                        this.visible = false
                        let text = `Статус записи изменен на ${{completed: 'Выполнено', cancelled: 'Отменено', active: 'Активно'}[status]}`
                        this.$store.dispatch('pushMessage', {color: 'green', text: text})
                    })
            }
        }
    }
</script>
