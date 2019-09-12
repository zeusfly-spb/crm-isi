<template>
    <v-flex>
        <v-icon
            class="clickable"
            :title="`Пакет документов сотрудника ${user.full_name}`"
            @click="active = true"
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
                    <v-data-table
                        :headers="headers"
                        :items="docs"
                        hide-actions
                        hide-headers
                    >
                        <template v-slot:items="props">
                            <td>{{ props.item.title }}</td>
                            <td align="right">
                                <v-icon
                                    class="mr-3 clickable"
                                    :title="`Посмотреть изображение документа '${props.item.title}'`"
                                    v-if="images[props.item.field]"
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
                                    v-if="images[props.item.field]"
                                    class="clickable"
                                    :title="`Удалить изображение документа '${props.item.title}'`"
                                    color="red darken-4"
                                    @click=""
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
    </v-flex>
</template>
<script>
    export default {
        name: 'DocPack',
        props: ['user'],
        data: () => ({
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
            ],
            docs: [
                {field: 'passport', title: 'Паспорт'},
                {field: 'inn', title: 'ИНН'},
                {field: 'snils', title: 'СНИЛС'},
                {field: 'contract', title: 'Трудовой договор'},
                {field: 'secret', title: 'Коммерческая тайна'},
            ]
        }),
        computed: {
            basePath () {
                return this.$store.state.basePath
            },
            images () {
                return this.user.document_pack
            }
        },
        methods: {
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
