<template>
    <tr>
        <td>
            <v-icon
                    class="red--text delete"
                    title="Удалить заявку?"
                    @click="confirmToDelete(props.item)"
                    v-if="isSuperadmin"
            >
                clear
            </v-icon>
        </td>
        <td>{{ props.index + 1 }}</td>
        <td
                :id="`lead${props.item.id}`"
        >
            <v-icon
                    class="clickable"
                    title="Показать историю взаимодействия"
                    :color="props.item.customer ? 'green' : 'yellow darken-3'"
                    @click="showInteractions(props.item.id)"
                    @contextmenu.prevent="openMenu(props.item)"
            >
                contacts
            </v-icon>
            {{ props.item.name | upFirst }}
            <interactions-card
                    v-if="+interactionsOpenId === +props.item.id"
                    :lead="props.item"
                    :customer="props.item.customer"
                    @close="interactionsOpenId = null"
            />
            <lead-context-menu
                    v-if="+menuOpenId === +props.item.id"
                    :lead="props.item"
                    v-model="contextMenu"
                    :selector="`#lead${props.item.id}`"
            />
        </td>
        <td nowrap>
            <span v-if="props.item.phone[0] == '+'">{{ props.item.phone | externalPhone }}</span>
            <span v-else>{{ props.item.phone | phone }}</span>
            <caller :phone="props.item.phone" :lead="props.item"/>
        </td>
        <td>
            <template v-if="props.item.id === openLeadId">
                <lead-postpones
                        :lead="props.item"
                        @message="showSuccess"
                        :open="props.item.id === openLeadId"
                        @closed="openLeadId = null"
                />
            </template>
            <template v-else>
                            <span
                                    v-if="props.item.last_postpone"
                                    class="clickable"
                                    @click="showLead(props.item.id)"
                                    :class="{'today': props.item.last_postpone.date.split(' ')[0] === accountingDate, 'lost': props.item.last_postpone.date < accountingDate}"
                            >
                                {{ props.item.last_postpone.date | moment('DD MMMM YYYY г. HH:mm')}}
                            </span>
                <v-icon
                        v-else
                        class="clickable"
                        title="Добавить дату перезвона по заявке"
                        @click="showLead(props.item.id)"
                >
                    phone_forwarded
                </v-icon>
            </template>
        </td>
        <td>
            <span v-if="props.item.site">{{ props.item.site }}</span>
            <v-avatar
                    v-else
                    size="36px"
                    :title="props.item.user && props.item.user.full_name || ''"
            >
                <img :src="basePath + props.item.user.avatar" alt="Фото" v-if="props.item.user && props.item.user.avatar">
                <img :src="basePath + '/img/default.jpg'" alt="Без фото" v-if="props.item.user && !props.item.user.avatar">
            </v-avatar>
        </td>
        <td>
            <template v-if="leadCommentsId === props.item.id">
                <lead-comments
                        :lead="props.item"
                        @updated="showSuccess"
                        @close="leadCommentsId = null"
                />
            </template>
            <template v-else>
                        <span v-if="props.item.last_comment"
                              @click="leadCommentsId = props.item.id"
                              class="clickable"
                        >
                            {{ props.item.last_comment.text }}
                            <span class="green--text accent-4"
                                  v-if="props.item.comments.length > 1"
                            >
                                <strong>({{ props.item.comments.length }})</strong>
                            </span>
                        </span>
                <v-icon
                        v-else
                        color="green"
                        title="Добавить комментарий к заявке"
                        class="clickable"
                        @click="leadCommentsId = props.item.id"
                >
                    add_circle
                </v-icon>
            </template>
        </td>
        <td>{{ props.item.created_at | moment('DD MMMM YYYY г. HH:mm') }}</td>
        <td>
            <lead-status :lead="props.item"/>
        </td>
    </tr>

</template>
<script>
    import Caller from './Caller'
    import LeadComments from './LeadComments'
    import LeadStatus from './LeadStatus'
    export default {
        name: 'Lead',
        props: [
            'lead',
            'props',
            'interactionsOpenId',
            'menuOpenId',
            'openLeadId',
            'leadCommentsIdProp'
        ],
        data: () => ({

        }),
        computed: {
            leadCommentsId: {
                get () {
                    return this.leadCommentsIdProp
                },
                set (val) {
                    this.$emit('set-lead-comments-id', val)
                }
            },
            basePath () {
                return this.$store.state.basePath
            },
            accountingDate () {
                return this.$store.state.accountingDate
            },
            isSuperadmin () {
                return this.$store.getters.isSuperadmin
            }
        },
        methods: {
            showSuccess (text, color) {
                this.$emit('show-success', text, color)
            },
            openMenu (val) {
                this.$emit('open-menu', val)
            }
        },
        components: {
            Caller,
            LeadComments,
            LeadStatus
        }
    }
</script>