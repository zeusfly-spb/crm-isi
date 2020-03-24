<template>
    <v-chip
        disabled
        class="pl-1 pr-1"
    >
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
                    ref="activator"
                    :color="fabStyle.color"
                >
                    {{ fabStyle.icon }}
                </v-icon>
            </template>
            <v-layout
                column
                :style="{'top': layoutTop, 'position': event.first ? 'fixed' : 'absolute'}"
            >
                <v-btn
                    v-for="(item, index) in statsButtons"
                    icon
                    dark
                    style="margin: .15em!important; padding: 0!important;"
                    :style="{'width': event.first ? 20 : 15}"
                    :key="index"
                    :color="item.color"
                    :title="item.title"
                    @click="performAction(item.status)"
                >
                    <v-icon
                        small
                    >
                        {{ item.icon }}
                    </v-icon>
                </v-btn>
            </v-layout>
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
            event: Object
        },
        data: () => ({
            fabRect: null,
            fab: false,
            statsRaw: [
                {status: 'active', color: 'blue', icon: 'event', title: 'Сменить статус на "Активно"'},
                {status: 'completed', color: 'green', icon: 'event_available', title: 'Сменить статус на "Выполнено"'},
                {status: 'cancelled', color: 'red', icon: 'event_busy', title: 'Сменить статус на "Отменено"'},
            ],
            layoutTop: null
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
        mounted () {
            let padding = 80
            if (this.event.first) {
                this.layoutTop = this.$refs.activator.$el.getBoundingClientRect().top + document.body.scrollTop - padding + 'px'
            } else {
                this.layoutTop = window.pageYOffset - padding + 5 + 'px'
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


