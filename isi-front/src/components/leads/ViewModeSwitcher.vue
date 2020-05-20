<template>
    <v-layout>
        <v-btn
                v-if="!todayPostpones"
                small
                v-for="(mode, index) in viewModes"
                @click="currentViewMode = mode"
                :disabled="['done', 'all'].includes(mode)"
                :key="index"
                :depressed="mode === currentViewMode"
                :color="mode === currentViewMode ? 'grey lighten-1' : null"
                :title="(mode === 'done' || mode === 'all') && !doneMode ? 'Чтобы узнать количество завершенных заявок, переключите режим' : ''"
        >
            <span class="pl-1 pr-1">
                    {{ {wait: 'Ожидают', process: 'В работе', done: 'Завершенные', moderate: 'На модерации', all: 'Все'}[mode] }}
            (
            <span v-if="mode === 'all'">{{ doneMode && counts && counts.all || '*' }}</span>
            <span v-if="mode === 'wait'">{{ counts.wait }}</span>
            <span v-if="mode === 'process'">{{ counts.process }}</span>
            <span v-if="mode === 'moderate'">{{ counts.moderate }}</span>
            <span v-if="mode === 'done'">{{ doneMode && counts && counts.done || '*' }}</span>
            )
            </span>
        </v-btn>
        <new-lead-dialog
                v-if="!todayPostpones"
                style="display: inline"
        />
        <v-spacer/>
        <v-btn
            flat
            small
            @click="todayPostpones = !todayPostpones"
        >
            {{ todayPostpones ? '   Общий список   ' : '   Перезвоны на сегодня   ' }}
        </v-btn>
    </v-layout>
</template>
<script>
    import NewLeadDialog from './NewLeadDialog'
    export default {
        name: 'ViewModeSwitcher',
        props: ['value'],
        data: () => ({
            viewModes: ['wait', 'process', 'moderate', 'done', 'all'],
        }),
        computed: {
            todayPostpones: {
                get () {
                    return this.$store.state.loader.showTodayPostpones
                },
                set (val) {
                    this.$store.commit('SET_TODAY_POSTPONES', val)
                }
            },
            counts () {
                return this.$store.state.loader.counts || {all: 0, wait: 0, process: 0, moderate: 0, done: 0}
            },
            doneMode () {
                return this.$store.state.loader.withDone
            },
            currentViewMode: {
                get () {
                    return this.value
                },
                set (val) {
                    this.$emit('input', val)
                }
            }
        },
        watch: {
            currentViewMode (val) {
                this.$store.dispatch('changeLeadStatus', val)
                this.$store.dispatch('setDoneMode', ['all', 'done'].includes(val))
            }
        },
        components: {
            NewLeadDialog
        }
    }
</script>
