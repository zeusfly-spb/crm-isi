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
            {{ subscribe.subscription.name }}
        </td>
        <td>
            {{ subscribe.start_date |  moment('D MMMM YYYY г.') }}
        </td>
        <td>
            {{ subscribe.finish_date |  moment('D MMMM YYYY г.') }}
        </td>
        <td>
            <span>
                Оплачено: <strong>{{ eventsCount.paid }}</strong>
                Назначено: <strong>{{ eventsCount.appointed }}</strong>
                Выполнено: <strong>{{ eventsCount.completed }}</strong>
            </span>
        </td>
        <td>
            <span>{{ subscribe.last_comment && subscribe.last_comment.text || 'нет комментариев'}}</span>
        </td>
    </tr>
</template>

<script>
    import UserAvatar from '../main/UserAvatar'
    export default {
        name: 'Subscribe',
        props: ['index', 'subscribe'],
        computed: {
            eventsCount () {
                return {
                    paid: this.subscribe.subscription.supply_amount || 0,
                    appointed: this.events.length || 0,
                    completed: this.events.filter(item => item.status === 'completed').length || 0
                }
            },
            commentsOpenId () {
                return this.$store.state.subscribes.eventsOpenId
            },
            eventsOpenId () {
                return this.$store.state.subscribes.eventsOpenId
            },
            events () {
                return this.subscribe && this.subscribe.events || []
            }
        },
        components: {
            UserAvatar
        }
    }
</script>

<style scoped>

</style>
