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
        >
            <v-menu
                    v-model="contextMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    lazy
                    offset-y
                    full-width
                    min-width="290px"
            >
                <template v-slot:activator="{ on }">
                    <v-icon
                            class="clickable"
                            title="Показать историю взаимодействия"
                            :color="props.item.customer ? 'green' : 'yellow darken-3'"
                            @click="showInteractions(props.item.id)"
                            @contextmenu.prevent="openMenu(props.item)"
                    >
                        contacts
                    </v-icon>
                </template>
                <lead-context-menu-entry
                        :lead="props.item"
                />
            </v-menu>
            {{ props.item.name | upFirst }}
            <interactions-card
                    v-if="+interactionsOpenId === +props.item.id"
                    :lead="props.item"
                    :customer="props.item.customer"
                    @close="interactionsOpenId = null"
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
                        @message="message"
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
    import LeadPostpones from './LeadPostpones'
    import InteractionsCard from '../customers/InteractionsCard'
    import LeadContextMenuEntry from './LeadContextMenuEntry'
    export default {
        name: 'Lead',
        props: [
            'lead',
            'props',
            'interactionsOpenIdProp',
            'menuOpenIdProp',
            'openLeadId',
            'leadCommentsIdProp'
        ],
        data: () => ({

        }),
        computed: {
            menuOpenId: {
                get () {
                    return this.menuOpenIdProp
                },
                set (val) {
                    this.$emit('set-menu-open-id', val)
                }
            },
            contextMenu: {
                get () {
                    return this.props.item.id === this.menuOpenId
                },
                set (val) {
                    this.$emit('set-menu-open-id', val)
                }
            },
            interactionsOpenId: {
                get () {
                    return this.interactionsOpenIdProp
                },
                set (val) {
                    this.$emit('set-interactions-open-id', val)
                }
            },
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
            confirmToDelete (lead) {
                this.$emit('confirm-to-delete', lead)
            },
            showInteractions (id) {
                this.$emit('show-iterations', id)
            },
            message (a, b) {
                console.log('getting message')
                console.log(a, b)
            },
            showLead (id) {
                this.$emit('show-lead', id)
            },
            showSuccess (text, color) {
                console.log('emitting show success')
                this.$emit('show-success', text, color)
            },
            openMenu (val) {
                this.$emit('open-menu', val)
            }
        },
        components: {
            Caller,
            LeadComments,
            LeadStatus,
            LeadPostpones,
            InteractionsCard,
            LeadContextMenuEntry
        }
    }
</script>
<style scoped>
    .clickable {
        cursor: pointer;
        opacity: .8;
    }
    .clickable:hover {
        opacity: 1;
    }
    .delete {
        cursor: pointer;
        opacity: .6;
    }
    .delete:hover {
        opacity: 1;
    }
    .today {
        color: #2a9055;
        font-weight: bold;
    }
    .lost {
        color: red;
        font-weight: bold;
    }
</style>