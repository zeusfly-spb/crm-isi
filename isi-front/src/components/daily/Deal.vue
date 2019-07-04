<template>
    <tr>
        <td>
            <v-avatar
                size="36px"
            >
                <img :src="basePath + deal.user.avatar" alt="Фото" v-if="deal.user.avatar">
                <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
            </v-avatar>
        </td>
        <td>{{ deal.customer.full_name }}</td>
        <td>{{ deal.insole.name }}</td>
        <td>
            <span
                @dblclick="switchEditMode('income')"
            >
                <span v-if="!editMode.income">{{ deal.income }}</span>
                <v-text-field
                    autofocus
                    v-else
                    v-model="deal.income"
                    single-line
                    maxlength="5"
                    style="width: 3em"
                    height="1em"
                    @focus="focused"
                    @blur="blur('income')"
                    @keyup.esc="blur('income')"
                    @keyup.enter="updateDeal('income')"
                    id="income"
                    :title="canUpdate ? 'Чтобы изменить цену - двойной клик' : ''"
                />
            </span>
        </td>
        <td>
            <span
                @dblclick="switchEditMode('expense')"
            >
                <span v-if="!editMode.expense">{{ deal.expense }}</span>
                <v-text-field
                    autofocus
                    v-else
                    v-model="deal.expense"
                    single-line
                    maxlength="5"
                    style="width: 3em"
                    height="1em"
                    @focus="focused('expense')"
                    @blur="blur('expense')"
                    @keyup.esc="blur('expense')"
                    @keyup.enter="updateDeal('expense')"
                    id="expense"
                    :title="canUpdate ? 'Чтобы изменить себестоимость - двойной клик' : ''"

                />
            </span>
        </td>
        <td>
            <span
                @dblclick="switchEditMode('is_cache')"
            >
                {{ deal.is_cache ? 'Наличные' : 'Безнал' }}
            </span>
        </td>
    </tr>
</template>
<script>
    export default {
        name: 'Deal',
        props: ['deal'],
        data: () => ({
            editMode: {
                income: false,
                expense: false,
                is_cache: false
            }
        }),
        computed: {
            canUpdate () {
                return this.deal.user_id === this.authUser.id || this.isSuperadmin
            },
            basePath () {
                return this.$store.state.basePath
            },
            authUser () {
                return this.$store.state.authUser
            },
            isSuperadmin () {
                return this.$store.getters.isSuperAdmin
            }
        },
        methods: {
            updateDeal (mode) {
                this.$validator.validate()
                    .then(valid => {
                        if (!valid) return
                        this.$store.dispatch('updateDeal', this.deal)
                            .then(() => {
                                this.blur(mode)
                                this.$emit('snack', `Значение "${{income: 'Цена', expense: 'Себестоимость', is_cache: 'Форма оплаты'}[mode]}" изменено.`, 'green')
                            })
                            .catch(e => console.error(e))
                    })
            },
            blur (mode) {
                this.editMode[mode] = false
                this.$store.commit('SET_SCAN_MODE', {...this.$store.state.scanMode, deals: true})
            },
            focused () {
                this.$store.commit('SET_SCAN_MODE', {...this.$store.state.scanMode, deals: false})
            },
            switchEditMode (mode) {
                if (!this.canUpdate) return
                for(let key in this.editMode) {
                    this.editMode[key] = false
                }
                this.editMode[mode] = true
            }
        }
    }
</script>
