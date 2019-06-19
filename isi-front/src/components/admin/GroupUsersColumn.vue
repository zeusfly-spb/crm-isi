<template>
    <div>
        <span v-for="(user, index) in users" :key="index">{{ user.full_name }}</span>
    </div>
</template>

<script>
    export default {
        name: 'GroupUsersColumn',
        props: ['users']
    }
</script>
