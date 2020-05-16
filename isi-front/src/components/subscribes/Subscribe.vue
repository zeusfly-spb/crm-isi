<template>
    <tr>
        <td>
            {{ index + 1 }}
        </td>
        <td>
            {{ subscribe.customer.full_name }}
        </td>
        <td>
            <user-avatar
                :user="subscribe.user"
            />
            <span>
                {{ subscribe.user.is_superadmin ? 'Суперадмин' : subscribe.user.full_name }}
            </span>
        </td>
        <td>
            {{ subscribe.start_date |  moment('D MMMM YYYY г.') }}
        </td>
        <td>
            {{ subscribe.subscription.name }}
        </td>
    </tr>
</template>

<script>
    import UserAvatar from '../main/UserAvatar'
    export default {
        name: 'Subscribe',
        props: ['index', 'subscribe'],
        components: {
            UserAvatar
        }
    }
</script>

<style scoped>

</style>
