<template>
    <v-flex
        style="width: 100%; display: flex;"
        ref="mainTr"
    >
    <div
        v-for="(name, index) in names"
        :style="{'width': `${columnWidth}px`}"
        class="cabinets-header"
        :key="index"
    >
        <strong>{{ name }}</strong>
    </div>

    </v-flex>
</template>
<script>
    export default {
        name: 'CabinetsModeHeader',
        props: ['cabinets'],
        data: () => ({
            fullWidth: null
        }),
        computed: {

            columnWidth () {
                return this.fullWidth && this.fullWidth / this.cabinets.length || null
            },
            names () {
                return this.cabinets.map(item => item.name)
            }
        },
        mounted () {
            this.fullWidth = this.$refs.mainTr.offsetWidth
            this.$emit('computed', this.columnWidth)
        },
        updated () {
            this.fullWidth = this.$refs.mainTr.offsetWidth
            this.$emit('computed', this.columnWidth)
        }
    }
</script>
<style>
    .cabinets-header {
        text-align: center;
        padding: 0!important;
        margin: 0!important;
        height: 1.5em!important;
        border: 1px solid grey;
        overflow: hidden;
    }
</style>
