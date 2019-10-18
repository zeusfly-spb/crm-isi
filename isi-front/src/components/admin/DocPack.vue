<template>
    <v-flex>
        <v-icon
            class="clickable"
            :title="`Пакет документов сотрудника ${user.full_name}`"
            @click="active = true"
            :class="{'red--text': !user.document_pack.filled}"
        >
            insert_drive_file
        </v-icon>
        <input type="file"
               name="image"
               ref="imageInput"
               accept="image/*"
               @change="loadImage"
               style="display: none"
        />
        <v-dialog
            persistent
            v-model="active"
            max-width="700px"
        >
            <v-card style="border-radius: 5px">
                <v-card-title
                    class="light-blue darken-3"
                >
                    <v-icon color="white" class="mr-2">
                        folder
                    </v-icon>
                    <span class="title white--text">{{ `Документы сотрудника ${user.full_name}` }}</span>
                </v-card-title>
                <v-card-text>
                    <custom-doc-adder :user="user" @added="showSuccess"/>
                    <v-data-table
                        :headers="headers"
                        :items="docs"
                        hide-actions
                        hide-headers
                    >
                        <template v-slot:items="props">
                            <td>
                                <v-icon
                                    v-if="props.item.custom"
                                    :title="`Удалить наименование документа '${props.item.title}'`"
                                    color="red darken-4"
                                    class="clickable"
                                >
                                    close
                                </v-icon>
                                {{ props.item.title }}
                            </td>
                            <td align="right">
                                <v-icon
                                    class="mr-3 clickable"
                                    :title="`Посмотреть изображение документа '${props.item.title}'`"
                                    v-if="images[props.item.field] && !props.item.custom"
                                    color="teal darken-3"
                                    @click="showImage(props.item)"
                                >
                                    remove_red_eye
                                </v-icon>
                                <v-icon
                                    :class="{'mr-3': images[props.item.field]}"
                                    class="clickable"
                                    :title="`Загрузить изображение документа '${props.item.title}'`"
                                    color="light-blue darken-3"
                                    @click="showImageInput(props.item)"
                                >
                                    cloud_upload
                                </v-icon>
                                <v-icon
                                    v-if="images[props.item.field] && !props.item.custom"
                                    class="clickable"
                                    :title="`Удалить изображение документа '${props.item.title}'`"
                                    color="red darken-4"
                                    @click="showDeleteConfirm(props.item)"
                                >
                                    delete_forever
                                </v-icon>
                            </td>
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="active = false">Закрыть</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="preview"
            max-width="700"
        >
            <v-card>
                <v-card-title
                    class="light-blue darken-3"
                >
                    <span class="title white--text">Предпросмотр {{ uploadingImage && uploadingImage.title ? uploadingImage.title : '' }}</span>
                </v-card-title>
                <v-card-text
                    class="text-xs-center"
                >
                    <img src="" alt=""
                         width="500px"
                         ref="previewImage"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="preview = false">Отмена</v-btn>
                    <v-btn color="green darken-1" flat @click="uploadDocumentImage">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="view"
        >
            <v-card>
                <v-card-title class="title light-blue darken-3">
                    <span class="white--text">Просмотр {{ viewingImage && viewingImage.title  ? viewingImage.title : '' }}</span>
                </v-card-title>
                <v-card-text>
                    <img
                        :src="`${basePath}${images[viewingImage && viewingImage.field ? viewingImage.field : null]}`"
                        v-if="viewingImage"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="view = false">Закрыть</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="confirm"
                  max-width="500"
        >
            <v-card>
                <v-card-title class="subheading">
                    {{ confirmText }}
                </v-card-title>
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
                        @click="deleteImage"
                    >
                        Удалить
                    </v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>

    </v-flex>
</template>
<script>
    import CustomDocAdder from './CustomDocAdder'
    export default {
        name: 'DocPack',
        props: ['user'],
        data: () => ({
            imageToDelete: null,
            confirmText: '',
            confirm: false,
            viewingImage: null,
            view: false,
            uploadingImage: null,
            image: null,
            preview: false,
            imageFileReader: {},
            active: false,
            headers: [
                {
                    text: 'Наименование',
                    sortable: false,
                    value: null,
                    align: 'center'
                },
                {
                    text: 'Действия',
                    sortable: false,
                    value: null,
                    align: 'center'
                }
            ]

        }),
        computed: {
            docs() {
                return [
                    {field: 'passport', title: 'Паспорт'},
                    {field: 'inn', title: 'ИНН'},
                    {field: 'snils', title: 'СНИЛС'},
                    {field: 'contract', title: 'Трудовой договор'},
                    {field: 'secret', title: 'Коммерческая тайна'},
                    ...this.customDocs
                ]
            },
            customDocs () {
                return this.user.document_pack.custom_docs.map(item => ({...item, title: item.name, custom: true}))
            },
            basePath () {
                return this.$store.state.basePath
            },
            images () {
                return this.user.document_pack
            }
        },
        methods: {
            showSuccess (text) {
                this.$emit('updated', text)
            },
            deleteImage () {
                this.$store.dispatch('deleteDocumentImage', {
                    id: this.images.id,
                    field_name: this.imageToDelete.field
                })
                    .then(() => {
                        this.confirm = false
                        this.$emit('updated', `Изображение документа '${this.imageToDelete.title}' удалено`)
                    })
            },
            showDeleteConfirm (image) {
                this.imageToDelete = image
                this.confirmText = `Удалить изображение документа '${image.title}'?`
                this.confirm = true
            },
            showImage (image) {
                this.viewingImage = image
                this.view = true
            },
            reset () {
                this.preview = false
            },
            uploadDocumentImage () {
                let data = new FormData
                data.append('id', this.images.id)
                data.append('field_name', this.uploadingImage.field)
                data.append('image', this.image)
                this.$store.dispatch('uploadDocumentImage', data)
                    .then(() => this.reset())
            },
            showImageInput (image) {
                this.uploadingImage = image
                this.$refs.imageInput.click()
            },
            loadImage () {
                this.image = this.$refs.imageInput.files[0]
                this.imageFileReader.readAsDataURL(this.$refs.imageInput.files[0])
            }
        },
        created () {
            this.imageFileReader = new FileReader()
            this.imageFileReader.onload = (e)=> {
                this.$refs.previewImage.src = e.target.result
            }
        },
        watch: {
            image (value) {
                if (value) {
                    this.preview = true
                }
            }
        },
        components: {
            CustomDocAdder
        }
    }
</script>
<style scoped>
    .clickable {
        cursor: pointer;
        opacity: .6;
    }
    .clickable:hover {
        opacity: 1;
    }
</style>
