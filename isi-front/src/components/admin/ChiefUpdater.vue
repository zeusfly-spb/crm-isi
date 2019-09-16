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
            <v-avatar
                size="30px"
                style="margin-bottom: .2em"
                v-if="chiefName !== 'Нет'"
            >
                <img :src="`${basePath}${chiefAvatar}`"
                     alt="Фото"
                     :title="chiefName"
                />
            </v-avatar>
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
                let users = this.$store.state.users.filter(item => !item.fired_at && !!item.island_id && !item.is_superadmin)
                return [{id: null, full_name: 'Нет'}, ... users]
            },
            chiefName () {
                let target = this.island && this.island.chief_id && this.users && this.users.find(user => +user.id === +this.island.chief_id) || null
                return target && target.full_name || 'Нет'
            },
            chiefAvatar () {
                let target = this.island && this.island.chief_id && this.users && this.users.find(user => +user.id === +this.island.chief_id) || null
                return target && target.avatar || '/img/default.jpg'
            },
            basePath () {
                return this.$store.state.basePath
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
