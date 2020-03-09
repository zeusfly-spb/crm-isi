<template>
    <v-dialog v-model="confirm"
              max-width="600"
    >
        <v-card class="round-corner">
            <v-card-title class="red darken-3">
                <span class="title white--text">Подтверждение</span>
            </v-card-title>
            <v-card-text>
                <span class="title">Удалить заявку с номера <span v-if="confirmText[0] !== '+'">{{ confirmText  | phone}}</span> <span v-else>{{ confirmText | externalPhone}}</span>?</span>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    flat="flat"
                    @click="confirm = false"
                >
                    Отмена
                </v-btn>
                <v-btn
                    color="red darken-1"
                    flat="flat"
                    @click="deleteLead"
                >
                    Удалить
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        name: 'LeadRemover',
        computed: {
            confirmText () {
                return this.leadToDelete && this.leadToDelete.phone || ''
            },
            confirm: {
                get () {
                    return !!this.leadToDelete
                },
                set (val) {
                    if (!val) {
                        this.leadToDelete = null
                    }
                }
            },
            leadToDelete: {
                get () {
                    return this.$store.state.lead.leadToDelete
                },
                set (val) {
                    this.$store.commit('SET_LEAD_TO_DELETE', val)
                }
            }
        },
        methods: {
            deleteLead () {
                this.$store.dispatch('deleteLead', {lead_id: this.leadToDelete.id})
                    .then(() => {
                        this.$store.commit('SEND_LEAD_MESSAGE', {
                            text: `Заявка с номера ${this.$options.filters.phone(this.leadToDelete.phone)} удалена`,
                            color: 'green'
                        })
                        this.leadToDelete = null
                    })
            }
        }
    }
</script>
