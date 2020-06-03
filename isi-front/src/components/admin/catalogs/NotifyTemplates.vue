<template>
    <v-flex>
        <v-btn
            flat
            color="primary"
            @click="showDialog"
        >
            Добавить шаблон
        </v-btn>
        <v-dialog
            v-model="dialog"
            max-width="1000px"
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
        <v-data-table
            :items="templates"
            hide-actions
        >
            <template v-slot:items="props">
                <td
                    class="index"
                >
                    {{ props.index + 1 }}
                </td>
                <td
                    class="name"
                >
                    {{ props.item.name }}
                </td>
                <td
                    class="text"
                >
                    {{ $store.getters.truncate(props.item.text, 15) }}
                </td>
            </template>
            <template v-slot:no-data>
                <span class="red--text">Нет шаблонов</span>
            </template>
        </v-data-table>
    </v-flex>
</template>

<script>

    export default {
        name: 'NotifyTemplates',
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
            textAreaMessages () {
                return `${this.charCount}/${this.smsCount}`
            },
            charCount () {
                let entered = this.editedTemplate.text.length || 0
                return entered <= this.perSms ? entered : entered % this.perSms
            },
            smsCount () {
                let entered = this.editedTemplate.text.length || 0
                return Math.ceil(entered / this.perSms)
            },
            templates () {
                return this.$store.state.catalog.notifyTemplates
            }
        },
        methods: {
            resetEditedTemplate () {
                this.editedTemplate = JSON.parse(JSON.stringify(this.blankTemplate))
            },
            hideDialog () {
                this.dialog = false
            },
            showDialog () {
                this.dialog = true
            },
            save () {
                const save = () => {
                    this.$store.dispatch('createNotifyTemplate', this.editedTemplate)
                        .then(() => this.hideDialog())
                }
                this.$validator.validate()
                    .then(res => {
                        if (!res) {
                            return
                        }
                        save()
                    })
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
                val ? this.resetEditedTemplate() : null
            }
        }
    }
</script>

<style scoped>
    .v-input {
        text-align: right!important;
    }
    .index {
        max-width: 3em;
    }
    .name {
        max-width: 30em;
    }
    .text {

    }

</style>
