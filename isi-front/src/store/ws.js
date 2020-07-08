import Vue from 'vue'

const isJson = str => {
    try {
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
}

export default {
    state: {
        wsOutbox: []
    },
    actions: {
        handleFrame ({dispatch, getters, commit}, frame) {
            const dealDate = deal => deal.created_at.split(' ')[0]
            const displayed = lead => {
                return getters.currentLeads.map(item => +item.id).includes(lead.id)
            }
            /**
             * Frame handlers
             */
            const updateDeal = deal => {
                getters.currentPage === 'daily' ? commit('UPDATE_DEAL', deal) : null
            }
            const deleteDeal = deal => {
                getters.currentPage === 'daily' ? commit('DELETE_DEAL', deal.id) : null
            }
            const insertDeal = deal => {
                getters.currentPage === 'daily' ? commit('ADD_DEAL', deal) : null
            }

            const insertLead = lead => {
                dispatch('changeCount', {
                    status: lead.status,
                    value: 1
                })
                    .then(() => {
                        lead.status === 'wait' ? commit('BEEP') : null
                        lead.status === getters.currentLeadStatus ? commit('ADD_LEAD', lead) : null
                    })
            }
            const deleteLead = lead => {
                dispatch('changeCount', {
                    status: lead.status,
                    value: -1
                })
                    .then(() => displayed(lead) ? commit('DELETE_LEAD', lead) : null)
            }
            const changeLeadStatus = lead => {
                let oldStatus = lead.old_status
                delete lead.old_status
                dispatch('change_count', {
                    status: oldStatus,
                    value: -1
                })
                dispatch('change_count', {
                    status: lead.status,
                    value: 1
                })
                getters.currentLeadStatus === oldStatus && displayed(lead) ? commit('DELETE_LEAD', lead) : null
                getters.currentLeadStatus === lead.status ? commit('ADD_LEAD', lead) : null
            }
            const updateLead = lead => displayed(lead) ? commit('UPDATE_LEAD', lead) : null

            const refreshCallToday = lead => {
                if (!getters.callTodayLeads.map(item => +item.id).includes(+lead.id)) {
                    return
                }
                let data = JSON.parse(JSON.stringify(getters.callTodayLeads))
                data = data.map(item => +item.id === +lead.id ? lead : item)
                    .filter(item => item.last_postpone.date.split(' ')[0] === getters.realDate)
                commit('SET_CALL_TODAY_LEADS', data)
            }

            return new Promise((resolve, reject) => {
                try {
                    if (!isJson(frame.data)) {
                        return
                    }
                    let obj = JSON.parse(frame.data)
                    switch (obj.type) {
                        case 'update_deal':
                            getters.accountingDate === dealDate(obj.model) ? updateDeal(obj.model) : null
                            break
                        case 'delete_deal':
                            getters.accountingDate === dealDate(obj.model) ? deleteDeal(obj.model) : null
                            break
                        case 'add_deal':
                            getters.accountingDate === dealDate(obj.model) ? insertDeal(obj.model) : null
                            break
                        case 'add_lead':
                            insertLead(obj.model)
                            break
                        case 'delete_lead':
                            deleteLead(obj.model)
                            break
                        case 'change_lead_status':
                            changeLeadStatus(obj.model)
                            refreshCallToday(obj.model)
                            break
                        case 'add_lead_call':
                            updateLead(obj.model)
                            refreshCallToday(obj.model)
                            break
                        case 'add_lead_comment':
                            updateLead(obj.model)
                            refreshCallToday(obj.model)
                            break
                        case 'delete_lead_comment':
                            updateLead(obj.model)
                            refreshCallToday(obj.model)
                            break
                        case 'add_lead_postpone':
                            updateLead(obj.model)
                            refreshCallToday(obj.model)
                            break
                        case 'delete_lead_postpone':
                            updateLead(obj.model)
                            refreshCallToday(obj.model)
                            break
                        default: break
                    }
                } catch (e) {
                    reject(e)
                }
            })
        },
        popFrame ({state, commit}) {
            return new Promise((resolve, reject) => {
                try {
                    let lastFrame = state.wsOutbox[state.wsOutbox.length - 1]
                    commit('POP_WS_OUTBOX')
                    resolve(lastFrame)
                } catch (e) {
                    reject(e)
                }
            })
        },
        pushFrame ({commit}, frame) {
            commit('PUSH_WS_OUTBOX', frame)
        },
        handleSqlEvent ({dispatch, getters, commit}, event) {
            const insertLead = lead => {
                dispatch('changeCount', {
                    status: lead.status,
                    value: 1
                })
                    .then(() => {
                        lead.status === 'wait' ? commit('BEEP') : null
                        lead.status === getters.currentLeadStatus ? commit('ADD_LEAD', lead) : null
                    })
            }
            const deleteLead = lead => {
                dispatch('changeCount', {
                    status: lead.status,
                    value: -1
                })
                    .then(() => lead.status === getters.currentLeadStatus ? commit('DELETE_LEAD', lead) : null)
            }
            const updateLead = lead => lead.status === getters.currentLeadStatus ? commit('UPDATE_LEAD', lead) : null
            const changeLeadStatus = data => {
                dispatch('changeCount', {
                    status: data.before.status,
                    value: -1
                })
                dispatch('changeCount', {
                    status: data.after.status,
                    value: 1
                })
                data.before.status ===  getters.currentLeadStatus ? commit('DELETE_LEAD', data.before) : null
                data.after.status ===  getters.currentLeadStatus ? commit('ADD_LEAD', data.after) : null
            }

            /**
             *
             * @param event
             */

            const handleLead = event => {
                if (event.type === 'INSERT' && event.affectedRows[0].after) {
                    insertLead(event.affectedRows[0].after)
                }
                if (event.type === 'UPDATE' && event.affectedRows[0].after) {
                    updateLead(event.affectedRows[0].after)
                    if (event.affectedRows[0].before.status !== event.affectedRows[0].after.status) {
                        changeLeadStatus({
                            before: event.affectedRows[0].before,
                            after: event.affectedRows[0].after,
                        })
                    }
                }
                if (event.type === 'DELETE' && event.affectedRows[0].before) {
                    deleteLead(event.affectedRows[0].before)
                }
            }

            const parseEvent = event => {
                switch (event.table) {
                    case 'leads':
                        handleLead(event)
                        break
                }
            }

            if (event.data && isJson(event.data)) {
                parseEvent(JSON.parse(event.data))
            }
        }
    },
    mutations: {
        PUSH_WS_OUTBOX (state, data) {
            state.wsOutbox.push(data)
        },
        POP_WS_OUTBOX(state) {
            state.wsOutbox.pop()
        }
    }
}
