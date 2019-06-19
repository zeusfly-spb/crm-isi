<template>
    <div>
        <div v-for="(user, index) in users" :key="index">{{ user.full_name }}</div>
    </div>
</template>

<script>
    export default {
        name: 'GroupUsersColumn',
        props: ['users']
    }
</script>
