<template>
    <td
        style="border: 1px solid black; padding: 0"
    >
        <v-card
            style="width: 30em"
        >
            <v-card-title>
                <v-avatar
                    size="36px"
                    class="align-center"
                >
                    <img :src="basePath + user.avatar" alt="Фото" v-if="user.avatar">
                    <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-else>
                </v-avatar>
                <div class="pl-2">
                    <strong>{{ user.full_name }}</strong>
                </div>
            </v-card-title>
            <v-card-text
                class="p-0"
            >
                <table>
                    <tr>
                        <td class="info-tab">
                            Наименование
                        </td>
                        <td class="info-tab">
                            Количество
                        </td>
                        <td class="info-tab">
                            Сумма
                        </td>
                    </tr>
                    <tr>
                        <td class="info-tab">
                            Часы
                        </td>
                        <td class="info-tab">
                            <strong>{{ totalHours }}</strong>
                        </td>
                        <td class="info-tab">
                            <strong>{{  }}</strong>
                        </td>
                    </tr>
                </table>
            </v-card-text>

        </v-card>
    </td>
</template>
<script>
    export default {
        name: 'TotalField',
        props: ['user'],
        computed: {
            workdays () {
                return this.user && this.user.monthWorkdays || []
            },
            totalHours () {
                const add = (a, b) => a + +b.working_hours
                return this.workdays.reduce(add, 0)
            },
            totalHourAmount () {
                let existsIslandIds = [... new Set(this.workdays.map(item => item.island_id))]
            },
            basePath () {
                return this.$store.state.basePath
            }
        }
    }
</script>
