<template>
    <v-layout column>
        <v-layout justify-center>
            <v-flex
                    v-if="extended"
            >
                <span class="text-center body-2">
                    Показывать на странице Зарплата
                </span>
                <v-radio-group
                    column
                    v-model="salaryDisplay"
                >
                    <v-radio
                        v-for="(item, index) in salaryDisplayOptions"
                        :key="index"
                        :label="item.description"
                        :value="item.value"
                    />
                </v-radio-group>
                <div
                    class="teal lighten-5"
                    v-if="salaryDisplay === 'selected'"
                >
                    <v-checkbox
                        v-for="user in users"
                        :key="user.id"
                        :label="user.full_name"
                        v-model="user.accepted"
                        @change="submitUsersList"
                    />
                </div>

            </v-flex>
        </v-layout>
        <v-layout justify-center>
            <span
                v-if="extended"
                class="caption blue--text clickable"
                @click="expand"
            >
                Базовые настройки
            </span>
        </v-layout>
    </v-layout>
</template>
<script>
    export default {
        name: 'IslandOptions',
        props: ['island', 'extended'],
        data: () => ({
            salaryDisplayOptions: [
                {value: 'attach', description: 'Всех, с доступом к островку'},
                {value: 'time', description: 'С рабочими днями на островке' },
                {value: 'attach_time', description: 'С доступом и рабочими днями'},
                {value: 'selected', description: 'Только выбранных'}
            ]
        }),
        computed: {
            users () {
                let base = this.island && this.island.users
                return base.map(item => ({... item, accepted: this.selectedUserIds.length && this.selectedUserIds.includes(item.id) || false}))
            },
            options () {
                return this.island && this.island.options
            },
            salaryDisplay: {
                get () {
                    return this.options && this.options.salary_display || 'attach'
                },
                set (val) {
                    let result = {... this.options, salary_display: val}
                    this.$emit('change', result)
                }
            },
            selectedUserIds: {
                get () {
                    return this.options && this.options.selected_user_ids || []
                },
                set (val) {
                    let result = {... this.options, selected_user_ids: val}
                    this.$emit('change', result)
                }
            }
        },
        methods: {
            submitUsersList () {
                this.selectedUserIds = this.users.filter(item => item.accepted).map(item => item.id)
            },
            expand () {
                this.$emit('expand')
            }
        }
    }
</script>
