<template>
    <v-flex>
        <v-avatar
                size="36px"
                :title="user && user.full_name || ''"
        >
            <img
                    :src="basePath + user.avatar"
                    alt="Фото"
                    v-if="user && user.avatar"
            />
            <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
        </v-avatar>
    </v-flex>
</template>
<script>
    export default {
        name: 'UserAvatar',
        props: ['user'],
        computed: {
            fullName () {
                return this.user && this.user.full_name
            },
            basePath () {
                return this.$store.state.basePath
            }
        }
    }
</script>