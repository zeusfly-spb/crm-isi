<template>
    <div>
        <div v-for="(user, index) in users" :key="index">{{ user.full_name }}</div>
        <div v-if="!users.length" class="grey--text">-</div>
    </div>
</template>
<script>
    export default {
        name: 'IslandUsersColumn',
        props: ['users']
    }
</script>
