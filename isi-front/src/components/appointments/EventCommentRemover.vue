<template>
    <span>
        <v-icon
            color="red"
            class="clickable"
            @click="showConfirm"
        >
            close
        </v-icon>
        <v-dialog
            max-width="600px"
            v-model="confirm"
        >
            <v-card
                class="round-corner"
            >
                <v-card-title
                        class="red darken-3"
                >
                    <span
                        class="title white--text"
                    >
                        Подтвержение
                    </span>
                </v-card-title>
                <v-card-text>
                    <span
                        class="title"
                    >
                        Удалить комментарий "<span class="comment-text">{{ comment.text }}</span>"?
                    </span>
                </v-card-text>
                <v-card-actions>
                     <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="hideConfirm">Отмена</v-btn>
                    <v-btn color="red darken-1" flat @click="">Удалить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </span>
</template>
<script>
    export default {
        name: 'EventCommentRemover',
        props: ['event', 'comment'],
        data: () => ({
            confirm: false
        }),
        methods: {
            hideConfirm () {
                this.confirm = false
            },
            showConfirm () {
                this.confirm = true
            }
        }
    }
</script>
<style scoped>
    .comment-text {

    }
</style>