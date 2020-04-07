<template>
    <v-flex>
        <v-btn
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
        <new-lead-dialog style="display: inline"/>
    </v-flex>
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
            counts () {
                let base = this.$store.state.loader.leads
                return {
                    all: base.length,
                    wait: base.filter(item => item.status === 'wait').length,
                    process: base.filter(item => item.status === 'process').length,
                    done: base.filter(item => item.status === 'done').length,
                    moderate: base.filter(item => item.status === 'moderate').length
                }
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
                this.$store.dispatch('setDoneMode', ['all', 'done'].includes(val))
            }
        },
        components: {
            NewLeadDialog
        }
    }
</script>
