<template>
    <v-flex>
        <v-data-table
            :items="[names]"
            hide-headers
            hide-actions
        >
            <template v-slot:items="props">
                <tr>
                    <td
                        v-for="(cabinet, index) in cabinets"
                        :key="index"
                        align="center"
                        style="padding: 0!important; margin: 0!important; border: 1px solid grey"
                        :width="columnWidth"
                        @click="fieldClicked({cabinet: cabinet, hour: hour})"
                    >
                    </td>
                </tr>
            </template>
        </v-data-table>
    </v-flex>
</template>
<script>
    export default {
        name: 'CabinetsModePeriod',
        props: ['cabinets', 'columnWidth', 'hour'],
        computed: {
            names () {
                return this.cabinets.map(item => item.name)
            }
        },
        methods: {
            fieldClicked ({cabinet, hour}) {
               
            }
        }
    }
</script>
