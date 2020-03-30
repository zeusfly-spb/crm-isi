<template>
    <span>
        <v-icon
            v-if="!noActivator"
            style="user-select: none; display: inline"
            class="clickable"
            title="Показать историю взаимодействия"
            :color="iconColor"
            @click="active=true"
        >
            contacts
        </v-icon>
        <v-dialog
            v-model="active"
            max-width="1000px"
            :persistent="$store.state.layout.customerEditing"
            @update:returnValue="close"
        >
            <v-card class="round-corner">
                <interactions-title
                    :lead="lead"
                    :customer="customer"
                    @close="close"
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
    </span>
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
        props: {
            lead: Object,
            customer: Object,
            value: {
                type: Boolean,
                default: true
            },
            noActivator: {
                type: Boolean
            }
        },
        computed: {
            iconColor () {
                return this.customer ? 'green' : 'yellow darken-3'
            },
            active: {
                get () {
                    return this.value
                },
                set (val) {
                    this.$emit('input', val)
                }
            },
            events () {
                return this.lead && this.lead.appointments || []
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
                base = base.map(item => ({
                    ...item,
                    user: this.users.find(user => +user.id === +item.user_id) || null
                }))
                return base.reverse()
            },
            deals () {
                let base = this.customer && this.customer.deals || []
                base = base.map(item => ({...item, user: this.users.find(user => +user.id === +item.user_id) || null}))
                return  base.reverse() || []
            }
        },
        methods: {
            extendCustomer: async function () {
                let customer = await this.$store.dispatch('extendCustomer', this.customer.id)
                this.$emit('extendCustomer', customer)
            },
            close () {
                this.active = false
                this.$emit('close')
            }
        },
        watch: {
            active (val) {
                if (val && this.customer) {
                    this.extendCustomer()
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
