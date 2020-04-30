<template>
    <v-avatar
            :size="size"
            :title="user && user.full_name || ''"
    >
        <img
                :src="basePath + user.avatar"
                alt="Фото"
                v-if="user && user.avatar"
        />
        <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
    </v-avatar>
</template>
<script>
    export default {
        name: 'UserAvatar',
        props: {
            user: Object,
            mini: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            size () {
                return `${this.mini ? 18 : 36}px`
            },
            fullName () {
                return this.user && this.user.full_name
            },
            basePath () {
                return this.$store.state.basePath
            }
        }
    }
</script>
