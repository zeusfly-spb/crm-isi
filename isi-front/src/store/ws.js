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
            const month = date => date.split(' ')[0].split('-')[1]
            const targetIslandId = () => getters.callCenter && getters.inspectingIslandId || getters.workingIslandId
            /**
             * Frame handlers
             */
            const insertExpense = expense => commit('ADD_EXPENSE', expense)
            const insertAppointment = event => commit('ADD_APPOINTMENT', event)

            const updateDeal = deal => commit('UPDATE_DEAL', deal)
            const deleteDeal = deal => commit('DELETE_DEAL', deal.id)
            const insertDeal = deal => commit('ADD_DEAL', deal)

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
                dispatch('changeCount', {
                    status: oldStatus,
                    value: -1
                })
                dispatch('changeCount', {
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
                    .filter(item => item.last_postpone && item.last_postpone.date && item.last_postpone.date.split(' ')[0] === getters.realDate)
                commit('SET_CALL_TODAY_LEADS', data)
            }

            const mustHandle = obj => {
                let result = true
                switch (obj.type.split('_')[1]) {
                    case 'expense':
                        getters.currentPage !== 'daily' ? result = false : null
                        break
                    case 'deal':
                        getters.accountingDate !== dealDate(obj.model) ? result = false : null
                        getters.workingIslandId !== 0 && obj.model.island_id !== getters.workingIslandId ? result = false : null
                        getters.currentPage !== 'daily' ? result = false : null
                        break
                    case 'appointment':
                        month(getters.eventsDate) !== month(obj.model.date) ? result = false : null
                        getters.currentPage !== 'appointments' || obj.model.island_id !== targetIslandId() ? result = false : null
                        break
                }
                return result
            }

            return new Promise((resolve, reject) => {
                try {
                    if (!isJson(frame.data)) {
                        return
                    }
                    let obj = JSON.parse(frame.data)
                    if (!mustHandle(obj)) {
                        return
                    }
                    switch (obj.type) {
                        case 'add_expense':
                            insertExpense(obj.model)
                            break
                        case 'add_appointment':
                            insertAppointment(obj.model)
                            break
                        case 'update_deal':
                            updateDeal(obj.model)
                            break
                        case 'delete_deal':
                            deleteDeal(obj.model)
                            break
                        case 'add_deal':
                            insertDeal(obj.model)
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
                    resolve(frame)
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
