<template>
    <v-flex
        class="p-0 m-0"
    >
         <span
             class="text-center body-2"
         >
            Оповещения
        </span>
        <div>
            <v-switch
                class="switch left"
                v-model="on"
            />
        </div>
    </v-flex>
</template>

<script>
    export default {
        name: 'IslandNotifyControl',
        props: {
            island: Object
        },
        data: () => ({
            on: false
        }),
        computed: {
            eventReminder: {
                get () {
                    return this.island.options && this.island.options.EventReminder || null
                },
                set (val) {
                    this.$store.dispatch('setIslandOption', {
                        island_id: this.island.id,
                        key: 'EventReminder',
                        value: val
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .switch {
        margin-top: .7em!important;
        padding: 0!important;
    }
</style>
