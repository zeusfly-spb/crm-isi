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
            <span
                class="clickable"
                @click="openEvents"
            >
                Оплачено: <strong>{{ eventsCount.paid }}</strong>
                Назначено: <strong>{{ eventsCount.appointed }}</strong>
                Выполнено: <strong>{{ eventsCount.completed }}</strong>
            </span>
        </td>
        <td>
            <span
                v-if="subscribe.last_comment"
                class="last-comment clickable"
                title="Открыть панель комментариев"
                @click="openComments"
            >
                {{ subscribe.last_comment.text || ''}}
                <span
                    v-if="commentsCount > 1"
                    class="green--text"
                >
                    <strong>({{ commentsCount }})</strong>
                </span>
            </span>
            <v-icon
                v-else
                color="green"
                class="clickable"
                title="Добавить комментарий"
                @click="openComments"
            >
                add_circle_outline
            </v-icon>
        </td>
    </tr>
</template>

<script>
    import UserAvatar from '../main/UserAvatar'
    export default {
        name: 'Subscribe',
        props: ['index', 'subscribe'],
        computed: {
            commentsCount () {
                let comments = this.subscribe && this.subscribe.comments ? Object.values(this.subscribe.comments) : []
                return comments.length
            },
            eventsCount () {
                return {
                    paid: this.subscribe.subscription.supply_amount || 0,
                    appointed: this.events.length || 0,
                    completed: this.events.filter(item => item.status === 'completed').length || 0
                }
            },
            commentsOpenId () {
                return this.$store.state.subscribes.commentsOpenId
            },
            eventsOpenId () {
                return this.$store.state.subscribes.eventsOpenId
            },
            events () {
                return this.subscribe && this.subscribe.events || []
            }
        },
        methods: {
            openEvents () {
                this.$store.commit('SET_SUBSCRIBE_EVENTS_OPEN_ID', this.subscribe.id)
            },
            openComments () {
                this.$store.commit('SET_SUBSCRIBE_COMMENTS_OPEN_ID', this.subscribe.id)
            }
        },
        components: {
            UserAvatar
        }
    }
</script>

<style scoped>
    .last-comment:hover {
        color: #03A9F4;
    }

</style>
