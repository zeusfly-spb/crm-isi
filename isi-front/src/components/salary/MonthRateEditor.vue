<template>
    <v-flex>
        <v-snackbar
            v-model="snackbar"
            auto-height
            top
            :timeout="3000"
            :color="snackColor"
        >
            <span>{{ snackText }}</span>
        </v-snackbar>
        <strong
            v-if="!active"
            @click="activate"
            class="changeable"
            :title="`Изменить ${targetCaption} для сотрудника ${user.full_name}`"
        >
            {{ +user[targetFieldName] | pretty }}
        </strong>
        <v-text-field
            type="number"
            v-else
            v-model="targetField"
            style="width: 3em"
            height="1em"
            align="right"
            autofocus
            right
            single-line
            @blur="deactivate"
            @keyup.esc="deactivate"
            @keyup.enter="updateRate"
        />
    </v-flex>
</template>
<script>
    export default {
        name: 'MonthRateEditor',
        props: ['user', 'type'],
        data: () => ({
            active: false,
            snackbar: false,
            snackText: '',
            snackColor: 'green'
        }),
        computed: {
            rates () {
                return this.user && this.user.rates
            },
            currentMonth () {
                return this.$store.state.accountingDate && this.$store.state.accountingDate.split('-').slice(0, 2).join('-') || null
            },
            targetCaption () {
                switch (this.type) {
                    case 'hours': return 'часовую ставку'
                    case 'sales': return 'ставку на оборот'
                }
            },
            targetField: {
                get: function () {
                    return +this.user[this.targetFieldName]
                } ,
                set: function (value) {
                    this.user[this.targetFieldName] = +value
                }
            },
            targetFieldName () {
                switch (this.type) {
                    case 'hours': return 'hour_rate'
                    case 'sales': return 'sales_rate'
                }
            }
        },
        methods: {
            showSnack (text, color) {
                this.snackText = text
                this.snackColor = color
                this.snackbar = true
            },
            updateRate () {
                let value = +this.user[this.targetFieldName]
                let exists = this.rates && this.rates.find(item => item.month === this.currentMonth && item.type === this.type) || null
                let updated
                if (exists) {
                    updated = this.rates.map(item => item.month === this.currentMonth && item.type === this.type ? {... item, value: value} : item)
                } else {
                    if (this.rates) {
                        this.rates.push({type: this.type, month: this.currentMonth, value: value})
                        updated = this.rates
                    } else {
                        updated = [{type: this.type, month: this.currentMonth, value: value}]
                    }
                }
                this.$store.dispatch('updateUserRates', {
                    user_id: this.user.id,
                    rates: updated
                })
                    .then(() => {
                        let text = `Изменена ${{hours: 'часовая ставка', sales: 'ставка на оборот'}[this.type]} для сотрудника ${this.user.full_name} за ${this.$moment(this.currentMonth + '-01').format('MMMM YYYY')} г.`
                        this.deactivate()
                        this.showSnack(text, 'green')
                    })
            },
            activate () {
                this.active = true
            },
            deactivate () {
                this.active = false
            }
        }
    }
</script>
<style scoped>
    .changeable {
        cursor: pointer;
    }
</style>
