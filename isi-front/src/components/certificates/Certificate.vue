<template>
    <tr>
        <td>{{ index + 1 }}</td>
        <td>{{ certificate.customer_id }}</td>
        <td>{{ certificate.user_id }}</td>
        <td>{{ certificate.start_date }}</td>
        <td>{{ certificate.duration }}</td>
        <td>{{ certificate.writeoffs }}</td>
        <td>{{ certificate.comments }}</td>
    </tr>
</template>

<script>
    export default {
        name: 'Certificate',
        props: ['index', 'certificate']
    }
</script>

<style scoped>

</style>
