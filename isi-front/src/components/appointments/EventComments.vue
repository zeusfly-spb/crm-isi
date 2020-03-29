<template>
    <div>
       <span
           v-if="lastComment"
           :class="{'system': lastComment && lastComment.user_id === 0}"
       >
           {{ lastComment.text }}
       </span>
    </div>
</template>
<script>
    export default {
        name: 'EventComments',
        props: ['event'],
        computed: {
            lastComment () {
                return this.event && this.event.last_comment || ''
            },
            comments: {
                get () {
                    return this.event && this.event.comments.reverse()
                }
            }
        }
    }
</script>
<style scoped>
    .system {
        color: #00695C;
    }
</style>