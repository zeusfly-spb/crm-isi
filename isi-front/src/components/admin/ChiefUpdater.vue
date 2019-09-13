<template>
    <v-flex>
        <v-select
            v-model="selectedChiefId"
            :items="users"
            item-text="full_name"
            item-value="id"
            single-line
            v-if="active"
            autofocus
            @blur="deactivate"
        />
        <span class="clickable"
              v-else
              @click="activate"
              :title="`Назначить руководителя на островок ${island && island.name || ''}`"
        >
            {{ chiefName }}
        </span>
    </v-flex>
</template>
<script>
    export default {
        name: 'ChiefUpdater',
        props: ['island'],
        data: () => ({
            active: false
        }),
        computed: {
            selectedChiefId: {
                get () {
                    return this.island && this.island.chief_id || null
                },
                set (val) {
                    this.$store.dispatch('updateIslandChiefId', {
                        island_id: this.island.id,
                        chief_id: val
                    })
                        .then(() => {
                            this.deactivate()
                            let hint = this.chiefName === 'Нет' ? `С островка ${this.island.name} сняли руководителя`
                                : `Сотрудник ${this.chiefName} назначен руководителем островка ${this.island.name}`
                            this.$emit('updated', hint)
                        })
                }
            },
            users () {
                return [{id: null, full_name: 'Нет'}, ...this.$store.state.users]
            },
            chiefName () {
                let target = this.island && this.island.chief_id && this.users && this.users.find(user => +user.id === +this.island.chief_id) || null
                return target && target.full_name || 'Нет'
            }
        },
        methods: {
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
    .clickable {
        cursor: pointer;
    }
    .clickable:hover {
        font-weight: bold;
    }
</style>
