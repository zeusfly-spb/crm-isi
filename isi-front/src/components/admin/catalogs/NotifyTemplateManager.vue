<template>
    <v-dialog
            v-model="dialog"
            max-width="1000px"
            @update:returnValue="hideDialog"
    >
        <v-card
                class="round-corner"
        >
            <v-card-title
                    class="light-blue darken-3 title"
            >
                <v-icon
                        class="pl-1"
                        color="white"
                >
                    notification_important
                </v-icon>
                <span
                        class="white--text"
                >
                        Новый шаблон оповещения
                    </span>
                <v-spacer/>
                <v-icon
                        color="white"
                        class="clickable"
                        @click="hideDialog"
                >
                    clear
                </v-icon>
            </v-card-title>
            <v-card-text>
                <div style="width: 24em">
                    <v-text-field
                            v-if="dialog"
                            maxlength="30"
                            autofocus
                            v-model="editedTemplate.name"
                            label="Название"
                            data-vv-as="Название"
                            data-vv-name="name"
                            :error-messages="errors.collect('name')"
                            v-validate="'required'"
                    />
                </div>
                <div>
                    <v-textarea
                            flat
                            outline
                            class="pb-0 mb-0"
                            v-model="editedTemplate.text"
                            label="Текст"
                            data-vv-as="Текст"
                            data-vv-name="text"
                            :error-messages="errors.collect('text')"
                            :messages="textAreaMessages"
                            v-validate="'required'"
                    />
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn color="darken-1" flat @click="hideDialog">Отмена</v-btn>
                <v-btn color="green darken-1" flat @click="save">Сохранить</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'NotifyTemplateManager',
        data: () => ({
            perSms: 70,
            dialog: false,
            editedTemplate: null,
            blankTemplate: {
                name: '',
                text: ''
            }
        }),
        computed: {
            editedNotifyTemplate: {
                get () {
                    return this.$store.state.catalog.editedNotifyTemplate
                },
                set (val) {
                    this.$store.commit('SET_EDITED_NOTIFY_TEMPLATE', val)
                }
            },
            textAreaMessages () {
                return this.charCount ? `${this.charCount}/${this.smsCount}` : ''
            },
            charCount () {
                let entered = this.editedTemplate.text.length || 0
                return entered <= this.perSms ? entered : entered % this.perSms
            },
            smsCount () {
                let entered = this.editedTemplate.text.length || 0
                return Math.ceil(entered / this.perSms)
            },
            attemptToAdd () {
                return this.$store.state.catalog.attemptToAddNotifyTemplate
            }
        },
        methods: {
            prepareToEdit () {
                this.editedTemplate = JSON.parse(JSON.stringify(this.editedNotifyTemplate))
                this.showDialog()
            },
            save () {
                const save = () => this.$store.dispatch('createNotifyTemplate', this.editedTemplate)
                const update = () => this.$store.dispatch('updateNotifyTemplate', this.editedTemplate)
                this.$validator.validate()
                    .then(res => {
                        if (!res) {
                            return
                        }
                        this.editedNotifyTemplate ? update() : save()
                    })
                    .finally(() => this.hideDialog())
            },
            prepareToAdd () {
                this.resetEditedTemplate()
                this.showDialog()
            },
            resetEditedTemplate () {
                this.editedTemplate = JSON.parse(JSON.stringify(this.blankTemplate))
            },
            showDialog () {
                this.dialog = true
            },
            hideDialog () {
                this.dialog = false
                this.attemptToAdd ? this.$store.commit('SET_ATTEMPT_TO_ADD_NOTIFY_TEMPLATE', false) : null
                this.editedNotifyTemplate ? this.editedNotifyTemplate = null : null
            }
        },
        created () {
            this.resetEditedTemplate()
        },
        watch: {
            dialog (val) {
                this.$validator.pause()
                this.$nextTick(() => {
                    this.$validator.errors.clear()
                    this.$validator.fields.items.forEach(field => field.reset())
                    this.$validator.fields.items.forEach(field => this.errors.remove(field))
                    this.$validator.resume()
                })
                val && !this.editedNotifyTemplate ? this.resetEditedTemplate() : null
            },
            attemptToAdd (val) {
                val ? this.prepareToAdd() : null
            },
            editedNotifyTemplate (val) {
                val ? this.prepareToEdit() : null
            }
        }
    }
</script>

<style scoped>
    .v-input {
        text-align: right!important;
    }
</style>
