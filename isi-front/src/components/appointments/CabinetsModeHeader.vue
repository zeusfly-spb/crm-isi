<template>
    <v-flex>
        <v-data-table
            :items="[names]"
            hide-headers
            hide-actions
        >
            <template v-slot:items="props">
                <tr
                    ref="mainTr"
                >
                    <td
                        v-for="(name, index) in names"
                        :key="index"
                        align="center"
                        style="padding: 0!important; margin: 0!important; height: 1.5em; border: 1px solid grey"
                        :width="columnWidth"
                    >
                        <strong>{{ name }}</strong>
                    </td>
                </tr>
            </template>
        </v-data-table>
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
        }
    }
</script>
