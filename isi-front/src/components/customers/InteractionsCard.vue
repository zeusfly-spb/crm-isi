<template>
    <v-flex>
        <v-dialog
            v-model="active"
            max-width="1000px"
        >
            <v-card class="round-corner">
                <v-card-title
                    class="light-blue darken-3"
                >
                    <v-icon
                        :color="customer ? 'green' : 'yellow darken-3'"
                        class="pr-2"
                    >
                        contacts
                    </v-icon>
                    <span class="title white--text">
                        История взаимодействия
                        <span v-if="lead && !customer">по заявке с номера {{ lead.phone  | phone}}</span>
                        <span v-else>с клиентом {{ customer.full_name }}</span>
                    </span>
                    <v-spacer/>
                    <v-icon
                        color="white"
                        class="clickable"
                        title="Закрыть"
                        @click="active=false"
                    >
                        close
                    </v-icon>
                </v-card-title>
                <v-card-text>
                    <div
                        v-if="leads.length"
                    >
                        <strong>Заявка</strong>
                        <v-data-table
                            :headers="leadHeaders"
                            :items="leads"
                            hide-actions
                            hide-headers
                        >
                            <template v-slot:items="props">
                                <td align="left">{{ props.item.name }}</td>
                                <td align="left">{{ props.item.phone | phone }}</td>
                                <td align="right">{{ props.item.created_at | moment('DD MMMM YYYY г. HH:mm') }}</td>
                            </template>
                        </v-data-table>
                    </div>
                    <div
                        v-if="comments.length"
                    >
                        <strong>Комментарии ({{ comments.length }})</strong>
                        <v-data-table
                            :items="comments"
                            hide-actions
                            hide-headers
                        >
                            <template v-slot:items="props">
                                <td align="left">
                                    <v-avatar
                                        size="36px"
                                        :title="props.item.user && props.item.user.full_name || ''"
                                    >
                                        <img :src="basePath + props.item.user.avatar" alt="Фото" v-if="props.item.user && props.item.user.avatar">
                                        <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-if="props.item.user && !props.item.user.avatar">
                                        <img :src="basePath + '/img/www.png'" alt="Без фото" v-if="!props.item.user">
                                    </v-avatar>
                                </td>
                                <td align="left">{{ props.item.text }}</td>
                                <td align="right">{{ props.item.created_at | moment('DD MMMM YYYY г. HH:mm') }}</td>
                            </template>
                        </v-data-table>
                    </div>
                    <div
                        v-if="calls.length"
                    >
                        <strong>Исходящие звонки ({{ calls.length }})</strong>
                        <v-data-table
                            :headers="callsHeaders"
                            :items="calls"
                            hide-actions
                            hide-headers
                        >
                            <template v-slot:items="props">
                                <td align="left">
                                    <v-avatar
                                        size="36px"
                                        :title="props.item.user && props.item.user.full_name || ''"
                                    >
                                        <img :src="basePath + props.item.user.avatar" alt="Фото" v-if="props.item.user && props.item.user.avatar">
                                        <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-if="props.item.user && !props.item.user.avatar">
                                        <img :src="basePath + '/img/www.png'" alt="Без фото" v-if="!props.item.user">
                                    </v-avatar>
                                </td>
                                <td align="right">{{ props.item.timestamp | moment('DD MMMM YYYY г. HH:mm') }}</td>
                            </template>
                        </v-data-table>
                    </div>
                    <div
                        v-if="customer"
                    >
                        <strong>Клиент</strong>
                        <v-data-table
                            :headers="customerHeaders"
                            :items="[customer]"
                            hide-headers
                            hide-actions
                        >
                            <template v-slot:items="props">
                                <td align="left">
                                    <span class="title green--text ">{{ props.item.full_name }}</span>
                                    <v-btn icon>
                                        <v-icon
                                            color="green"
                                            :disabled="edit"
                                        >
                                            edit
                                        </v-icon>
                                    </v-btn>

                                </td>
                                <td align="left">{{ props.item.birth_date | moment('DD MMMM YYYY г.')}}</td>
                                <td align="right">{{ props.item.address }}</td>
                            </template>
                        </v-data-table>
                    </div>
                    <div
                        v-if="deals.length"
                    >
                        <strong>Сделки ({{ deals.length }})</strong>
                        <v-data-table
                            :headers="dealsHeaders"
                            :items="[...deals, {id: null}]"
                            hide-actions
                            hide-headers
                        >
                            <template v-slot:items="props">
                                <tr v-if="props.item.id">
                                    <td align="left">
                                        <v-avatar
                                            size="36px"
                                            :title="props.item.user && props.item.user.full_name || ''"
                                            class="mr-1"
                                        >
                                            <img :src="basePath + props.item.user.avatar" alt="Фото" v-if="props.item.user && props.item.user.avatar">
                                            <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-if="props.item.user && !props.item.user.avatar">
                                            <img :src="basePath + '/img/www.png'" alt="Без фото" v-if="!props.item.user">
                                        </v-avatar>
                                        {{ props.item.action.text }}
                                    </td>
                                    <td align="left">{{ props.item.insole.name }}</td>
                                    <td align="right">{{ props.item.income | pretty }} &#8381;</td>
                                    <td align="right">{{ props.item.created_at | moment('DD MMMM YYYY г. HH:mm') }}</td>
                                </tr>
                                <tr v-else>
                                    <td colspan="2"></td>
                                    <td align="right"><strong>ИТОГО: {{ deals.reduce((a, b) => a + +b.income, 0) | pretty }} &#8381;</strong></td>
                                    <td></td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

    </v-flex>
</template>
<script>
    export default {
        name: 'InteractionsCard',
        props: ['lead', 'customer'],
        data: () => ({
            edit: false,
            active: true,
            leadHeaders: [
                {text: 'Имя', align: 'left', sortable: false},
                {text: 'Номер телефона', align: 'center', sortable: false},
                {text: 'Дата / Время', align: 'right', sortable: false}
            ],
            commentsHeaders: [
                {text: 'Сотрудник', align: 'left', sortable: false},
                {text: 'Текст', align: 'center', sortable: false},
                {text: 'Дата / Время', align: 'right', sortable: false},
            ],
            callsHeaders: [
                {text: 'Сотрудник', align: 'left'},
                {text: 'Дата / Время', align: 'right'}
            ],
            customerHeaders: [
                {text: 'ФИО', align: 'left'},
                {text: 'Дата рождения', align: 'left'},
                {text: 'Адрес', align: 'left'}
            ],
            dealsHeaders: [
                {text: 'Сотрудник / Вид сделки', align: 'left'},
                {text: 'Наименование', align: 'center'},
                {text: 'Цена', align: 'left'},
                {text: 'Дата / Время', align: 'right'}
            ]
        }),
        computed: {
            users () {
                return this.$store.state.users
            },
            basePath () {
                return this.$store.state.basePath
            },
            comments () {
                return this.lead && this.lead.comments && this.lead.comments.reverse() || []
            },
            leads () {
                return this.lead ? [this.lead] : []
            },
            calls () {
                let base = this.lead && this.lead.calls || []
                base = base.map(item => ({...item, user: this.users.find(user => +user.id === +item.user_id) || null}))
                return base.reverse()
            },
            deals () {
                let base = this.customer && this.customer.deals || []
                base = base.map(item => ({...item, user: this.users.find(user => +user.id === +item.user_id) || null}))
                return  base.reverse() || []
            }
        },
        watch: {
            active (val) {
                if (!val) {
                    this.$emit('close')
                }
            }
        }
    }
</script>
<style scoped>
.round-corner {
    border-radius: 5px;
}
.clickable {
    cursor: pointer;
    opacity: .8;
}
.clickable:hover {
    opacity: 1;
}
</style>
