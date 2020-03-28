<template>
    <v-avatar
            size="36px"
            :title="user.full_name || ''"
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
            basePath () {
                return this.$store.state.basePath
            }
        }
    }
</script>