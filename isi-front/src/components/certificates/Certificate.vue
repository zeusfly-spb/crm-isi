<template>
    <tr>
        <td>
            {{ index + 1 }}
        </td>
        <td>
            {{ certificate.customer.full_name || '' }}
        </td>
        <td>
            <user-avatar
                    :user="certificate.user"
            />
        </td>
        <td>
            {{ certificate.start_date | moment('D MMMM YYYY г.') }}
        </td>
        <td
                align="center"
        >
            {{ certificate.duration }}
        </td>
        <td>
            {{ certificate.finish_date | moment('D MMMM YYYY г.') }}
        </td>
        <td>
            {{ certificate.writeoffs }}
        </td>
        <td>
            {{ certificate.comments }}
        </td>
    </tr>
</template>

<script>
    import UserAvatar from '../main/UserAvatar'

    export default {
        name: 'Certificate',
        props: ['index', 'certificate'],
        components: {
            UserAvatar
        }
    }
</script>

<style scoped>

</style>
