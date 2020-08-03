<template>
    <span>
        {{ description }}
    </span>
</template>

<script>
    export default {
        name: 'ServiceDealUpdater',
        props: {
            deal: {
                type: Object,
                required: true
            }
        },
        computed: {
            description () {
                return this.deal.service.description
            }
        }
    }
</script>

<style scoped>

</style>
