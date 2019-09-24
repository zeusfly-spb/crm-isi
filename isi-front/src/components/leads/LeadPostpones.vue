<template>
    <v-flex>
        <span
            v-if="!active && lastPostpone"
        >
            {{ lastPostpone.date | moment('DD MMMM YYYY г. HH:mm:ss') }}
        </span>
        <v-icon
            v-if="!active && !lastPostpone"
            @click="activate"
            :title="`Добавить дату перезвона по заявке с номера ${lead.phone}`"
        >
            phone_forwarded
        </v-icon>
    </v-flex>
</template>
<script>
    export default {
        name: 'LeadPostpones',
        props: ['lead'],
        data: () => ({
            active: false,
            newDate: null
        }),
        computed: {
            lastPostpone () {
                return this.lead.last_postpone
            },
            postpones () {
                return this.lead.postpones
            }
        },
        methods: {
            activate () {
                this.active = true
            }
        }
    }
</script>
<style scoped>
    .clickable {

    }
</style>
