<template>
    <v-avatar
            size="36px"
            :title="userFullName || ''"
    >
        <img :src="basePath + user.avatar" alt="Фото" v-if="user.avatar">
        <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
    </v-avatar>
</template>
<script>
    export default {
        name: 'UserAvatar',
        props: ['user'],
        computed: {
            userFullName () {
                if (this.user && this.user.id === 1) {
                    return 'Администратор'
                }
                return this.user && this.user.full_name || ''
            },
            basePath () {
                return this.$store.state.basePath
            }
        }
    }
</script>