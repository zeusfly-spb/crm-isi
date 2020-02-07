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
                        v-for="(name, index) in names"
                        :key="index"
                        align="center"
                        style="padding: 0!important; margin: 0!important; border: 1px solid grey"
                        :width="columnWidth"
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
        props: ['cabinets', 'columnWidth'],
        computed: {
            names () {
                return this.cabinets.map(item => item.name)
            }
        }
    }
</script>
