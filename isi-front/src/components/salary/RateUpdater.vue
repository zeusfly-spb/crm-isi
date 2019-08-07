<template>
    <v-flex>
        <strong
            v-if="!active"
            @click="active = true"
            class="changeable"
            :title="`Изменить ${targetCaption} для сотрудника ${user.full_name}`"
        >
            {{ caption }}
        </strong>
        <v-text-field
            v-else
            v-model="targetField"
            style="width: 3em"
            height="1em"
            align="right"
            autofocus
            right
            single-line
            @blur="cancel"
            @keyup.esc="cancel"
            type="number"
        ></v-text-field>
    </v-flex>
</template>
<script>
    export default {
        name: 'RateUpdater',
        props: ['user', 'mode', 'caption'],
        data: () => ({
            active: false,
            backup: null
        }),
        computed: {
            targetCaption () {
                return this.mode === 'hours' ? 'часовую ставку' : 'ставку на оборот'
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
                return this.mode === 'hours' ? 'hour_rate' : 'sales_rate'
            }
        },
        methods: {
            activate () {
                this.backup = this.targetField
                this.active = true
            },
            cancel () {
                this.targetField = this.backup
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
