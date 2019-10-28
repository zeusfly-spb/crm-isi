<template>
    <div>
        <v-alert
            :value="true"
            color="warning"
            v-if="nowLeads.length"
        >
            <span class="title">Ожидают связи:</span>
            &nbsp;
            <span v-for="(lead, index) in nowLeads" :key="index">
                <span
                    class="headline"
                >
                    {{ lead.name }}
                </span>
                <caller :phone="lead.phone" :lead="lead" blinked/>
            </span>
        </v-alert>
    </div>
</template>
<script>
    import Caller from './Caller'
    export default {
        name: 'CallReminder',
        computed: {
            mustScroll () {
                return true
            },
            nowLeads () {
                const limit = 0.01
                let base = this.todayLeads.filter(item => (new Date(item.last_postpone.date) - new Date()) / 60000 < limit)
                return base.filter(item => !item.last_call || item.last_call && new Date(item.last_call.timestamp) < new Date(item.last_postpone.date))
            },
            todayLeads () {
                return this.leads.filter(item => item.status === 'process' && item.last_postpone && item.last_postpone.date.split(' ')[0] === this.$store.state.realDate)
            },
            active () {
                return true
            },
            leads () {
                return this.$store.state.loader.leads
            }
        },
        methods: {
            toTop () {
                this.$vuetify.goTo(0)
            }
        },
        watch: {
            nowLeads (val) {
                if (val && val.length && this.mustScroll) {
                    this.toTop()
                }
            }
        },
        components: {
            Caller
        }
    }
</script>
