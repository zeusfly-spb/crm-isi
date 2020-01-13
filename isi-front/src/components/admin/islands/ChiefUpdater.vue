<template>
    <td nowrap>
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
        <div
            v-if="!active"
        >
          <span class="clickable"
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
            <span class="text-xs-right">
                <v-icon
                   class="clickable"
                   v-if="island.chiefs"
                   :title="`Посмотреть историю назначения руководителей на островок ${island.name}`"
                >
                    list
                </v-icon>
            </span>
        </div>
    </td>
</template>
<script>
    export default {
        name: 'ChiefUpdater',
        props: ['island'],
        data: () => ({
            active: false
        }),
        computed: {
            accountingDate () {
                return this.$store.state.accountingDate
            },
            selectedChiefId: {
                get () {
                    return this.island && this.chiefId || null
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
            chiefId () {
                if (!this.island.chiefs) {
                    return null
                }
                let chiefs = this.island.chiefs
                if (!chiefs.length) {
                    return null
                }
                chiefs.sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
                let target = chiefs.find(chief => chief.date === this.accountingDate || chief.date < this.accountingDate)
                return target && target.user_id || null
            },
            users () {
                let users = this.$store.state.users.filter(item => !item.fired_at && !item.is_superadmin)
                return [{id: null, full_name: 'Нет'}, ... users]
            },
            chiefName () {
                let target = this.island && this.users && this.users.find(user => +user.id === +this.chiefId) || null
                return target && target.full_name || 'Нет'
            },
            chiefAvatar () {
                let target = this.island && this.users && this.users.find(user => +user.id === +this.chiefId) || null
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
