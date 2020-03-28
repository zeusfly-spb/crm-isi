<template>
    <span>
        <v-select
                v-if="active"
                autofocus
                :items="customers"
                v-model="selectedCustomerId"
                height="1em"
                style="width: 25em"
                item-text="full_name"
                item-value="id"
                single-line
                @focus="focused"
                @blur="blur"
                @change="customerSelected"
        >
            <template v-slot:item="data">
                <span :class="{'red--text': data.item.id === null, 'green--text': data.item.id === 0}">
                    {{ data.item.full_name }}
                </span>
            </template>
        </v-select>
        <span
            v-else
            :title="canUpdate ? 'Чтобы изменить клиента - клик мышкой' : ''"
            :class="{clickable: canUpdate}"
            @click="active = true"
        >
            {{ deal.customer.full_name }}
        </span>
    </span>
</template>
<script>
    export default {
        name: 'CustomerUpdater',
        props: ['deal'],
        data: () => ({
            active: false,
            selectedCustomerId: null
        }),
        computed: {
            realDate () {
                return this.$store.state.realDate
            },
            isToday () {
                return this.$store.state.accountingDate === this.realDate
            },
            isTotal () {
                return this.deal.id === null
            },
            authUser () {
                return this.$store.state.authUser
            },
            canUpdate () {
                if (this.isTotal) {
                    return false
                }
                return this.isSuperadmin ? true :  this.deal.user_id === this.authUser.id && this.isToday
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            },
            customers () {
                return [
                    {id: null, full_name: 'Аноним'},
                    {id: 0, full_name: 'Новый клиент'},
                    ...this.$store.state.customers
                ]
            },
            visible: {
                get () {
                    return this.value
                },
                set (val) {
                    this.$emit('input', val)
                }
            }
        },
        methods: {
            customerSelected () {
                switch (this.selectedCustomerId) {
                    case 0:
                        this.$emit('new')
                        break
                    default:
                        // this.deal.customer_id = this.selectedCustomerId
                        // const restore = (deal) => ({...deal, size_id: deal.size && deal.size.id || null})
                        this.$store.dispatch('updateDealCustomerId', {
                            deal_id: this.deal.id,
                            customer_id: this.selectedCustomerId
                        })
                            .then(() => {
                                this.blur()
                                this.$store.dispatch('pushMessage', {
                                    text: 'Значение "Клиент" изменено',
                                    color: 'green'
                                })
                            })
                        break
                }
            },
            blur () {
                this.hide()
                this.$store.commit('SET_SCAN_MODE', {...this.$store.state.scanMode, deals: true})
            },
            focused () {
                this.$store.commit('SET_SCAN_MODE', {...this.$store.state.scanMode, deals: false})
            },
            show () {
                this.active = true
            },
            hide () {
                this.active = false
            }
        }
    }
</script>
<style scoped>
    .clickable {
        cursor: pointer;
    }
    .delete {
        cursor: pointer;
        opacity: .6;
    }
    .delete:hover {
        opacity: 1;
    }
    .total {
        border-top:solid 2px rgb(200,200,200);
    }
</style>