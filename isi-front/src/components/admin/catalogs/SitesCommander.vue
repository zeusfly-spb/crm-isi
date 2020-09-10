<template>
    <v-flex>
        <v-btn
            flat
            color="primary"
            title="Добавить сайт"
            @click="mode = 'add'"

        >
            Добавить сайт
        </v-btn>
        <v-dialog
            max-width="1000px"
            v-model="dialog"
            @update:returnValue="hideDialog"
        >
            <v-card
                class="round-corner"
            >
                <v-card-text
                    class="light-blue darken-3"
                >
                    <span class="white--text title" v-if="addMode">Добавить сайт</span>
                </v-card-text>
                <v-card-text>
                    <v-container
                            grid-list-md
                            class="p-0 m-0"
                    >
                        <v-layout wrap>
                            <v-flex xs12 sm6 md6>
                                <v-text-field
                                    v-model="editedSite && editedSite.url"
                                    label="Url"
                                    data-vv-as="Url"
                                    data-vv-name="url"
                                    :error-messages="errors.collect('url')"
                                    v-validate="'url|required'"
                                />
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field
                                    v-model="editedSite && editedSite.description"
                                    label="Описание"
                                />
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="darken-1" flat @click="addMode = false">Отмена</v-btn>
                    <v-btn color="green darken-1" flat @click="addSite">Добавить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-flex>
</template>

<script>
    export default {
        name: 'SitesCommander',
        data: () => ({
            dialog: false,
            mode: null,
            editedSite: null,
            blankSite: {url: '', description: ''}
        }),
        computed: {
            deleteMode: {
                get () {
                    return !!this.siteToDelete
                },
                set (val) {
                    this.$store.commit('SET_SITE_TO_DELETE', val)
                }
            },
            siteToDelete () {
                return this.$store.state.catalog.siteToDelete
            },
            addMode: {
                get () {
                    return this.mode === 'add'
                },
                set (val) {
                    val ? this.mode = 'add' :  this.mode = null
                }
            },
            editMode: {
                get () {
                    return this.mode === 'edit'
                },
                set (val) {
                    val ? this.mode = 'edit' : this.mode = null
                }
            }
        },
        methods: {
            addSite () {
                const action = () => this.$store.dispatch('addSite', {...this.editedSite}).then(this.hideDialog())
                this.$validator.validate().then(res => res ? action() : null)
            },
            showDialog () {
                this.dialog = true
            },
            hideDialog () {
                this.dialog = false
            }
        },
        watch: {
            addMode (val) {
                if (val) {
                    this.editedSite = this.blankSite
                    this.showDialog()
                } else {
                    this.editedSite = null
                    this.hideDialog()
                }
            }
        }
    }
</script>

<style scoped>


</style>
