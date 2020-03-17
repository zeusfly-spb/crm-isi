<template>
    <v-flex>
        <v-dialog
            :value="active"
            max-width="1000px"
            :persistent="$store.state.layout.customerEditing"
        >
            <v-card class="round-corner">
                <interactions-title
                    :lead="lead"
                    :customer="customer"
                    @close="active = false"
                />
                <v-card-text>
                    <lead-row
                        :lead="lead"
                    />
                    <events-row
                        :events="events"
                    />
                    <comments-row
                        :comments="comments"
                    />
                    <calls-row
                        :calls="calls"
                    />
                    <customer-row
                        :customer="customer"
                    />
                    <deals-row
                        :deals="deals"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script>
    import CustomerEditor from './CustomerEditor'
    import EventsRow from './EventsRow'
    import CommentsRow from './CommentsRow'
    import LeadRow from './LeadRow'
    import CallsRow from './CallsRow'
    import CustomerRow from './CustomerRow'
    import DealsRow from './DealsRow'
    import InteractionsTitle from './InteractionsTitle'
    export default {
        name: 'InteractionsCard',
        props: ['lead', 'customer'],
        data: () => ({
            active: true
        }),
        computed: {
            events () {
                if (!this.lead || !this.lead.appointments || !this.lead.appointments.length) {
                    return []
                }
                return JSON.parse(this.lead.appointments) || []
            },
            users () {
                return this.$store.state.users
            },
            comments () {
                return this.lead && this.lead.comments && this.lead.comments.reverse() || []
            },
            leads () {
                return this.lead ? [this.lead] : []
            },
            calls () {
                let base = this.lead && this.lead.calls || []
                base = base.map(item => ({...item, user: this.users.find(user => +user.id === +item.user_id) || null}))
                return base.reverse()
            },
            deals () {
                let base = this.customer && this.customer.deals || []
                base = base.map(item => ({...item, user: this.users.find(user => +user.id === +item.user_id) || null}))
                return  base.reverse() || []
            }
        },
        methods: {
            showSnack (text, color) {
                this.snackText = text
                this.snackColor = color
                this.snackbar = true
            }
        },
        watch: {
            active (val) {
                if (!val) {
                    this.$emit('close')
                }
            }
        },
        components: {
            CustomerEditor,
            EventsRow,
            CommentsRow,
            LeadRow,
            CallsRow,
            CustomerRow,
            DealsRow,
            InteractionsTitle
        }
    }
</script>
<style>
.round-corner {
    border-radius: 5px;
}
.clickable {
    cursor: pointer;
    opacity: .8;
}
.clickable:hover {
    opacity: 1;
}
</style>
