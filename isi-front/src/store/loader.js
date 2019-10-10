import Vue from 'vue'

export default {
    state: {
        leads: [],
        beep: false,
        withDone: false
    },
    actions: {
        setDoneMode ({commit, dispatch}, doneMode) {
            return new Promise((resolve, reject) => {
                commit('SET_DONE_MODE', doneMode)
                dispatch('setLeadsOnTimer')
            })
        },
        deleteLeadPostpone ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_lead_postpone', {... data})
                    .then(res => {
                        commit('UPDATE_LEAD', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addLeadPostpone ({commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_lead_postpone', {
                    ... data,
                    user_id: rootState.authUser.id
                })
                    .then(res => {
                        commit('UPDATE_LEAD', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addLead ({commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_lead', {
                    ... data,
                    user_id: rootState.authUser.id
                })
                    .then(res => {
                        commit('ADD_LEAD', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteLeadComment ({commit}, commentId) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_lead_comment', {comment_id: commentId})
                    .then(res => {
                        commit('UPDATE_LEAD', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addLeadComment ({commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_lead_comment', {
                    ... data,
                    user_id: rootState.authUser.id
                })
                    .then(res => {
                        commit('UPDATE_LEAD', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        updateLeadStatus ({commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_lead_status', {
                    ... data,
                    user_id: rootState.authUser.id
                })
                    .then(res => {
                        commit('UPDATE_LEAD', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteLead ({commit}, leadId) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_lead', {lead_id: leadId})
                    .then(res => {
                        commit('DELETE_LEAD', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setLeadsOnTimer ({commit, rootState, state}) {
            return new Promise((resolve ,reject) => {
                Vue.axios.post('/api/get_leads', {
                    date: rootState.accountingDate,
                    with_done: state.withDone
                })
                    .then(res => {
                        commit('SET_LEADS', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setLeads ({commit, rootState, state}) {
            return new Promise((resolve ,reject) => {
                commit('ADD_TASK', 'leads')
                Vue.axios.post('/api/get_leads', {
                    date: rootState.accountingDate,
                    with_done: state.withDone
                })
                    .then(res => {
                        commit('SET_LEADS', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
                    .finally(() => commit('REMOVE_TASK', 'leads'))
            })
        },
        updateIslandChiefId ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_chief_id', {... data})
                    .then(res => {
                        commit('UPDATE_ISLAND', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteDocumentImage ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_image', {... data})
                    .then(res => {
                        commit('UPDATE_USER', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        updateUserDate ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_user_date', {... data})
                    .then(res => {
                        commit('UPDATE_USER', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        uploadDocumentImage ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/upload_image', data)
                    .then(res => {
                        commit('UPDATE_USER', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        loadDailyPage ({commit, rootState}) {
            return new Promise((resolve, reject) => {
                commit('ADD_TASK', 'daily')
                Vue.axios.post('/api/load_daily_page', {
                    island_id: rootState.workingIslandId,
                    date: rootState.accountingDate
                })
                    .then(res => {
                        commit('SET_DAILY_PAGE', res.data)
                        commit('REMOVE_TASK', 'daily')
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        }
    },
    mutations: {
        SET_DONE_MODE (state, done) {
            state.withDone = done
        },
        ADD_LEAD (state, lead) {
            state.leads.push(lead)
        },
        UPDATE_LEAD (state, lead) {
            state.leads = state.leads.map(item => +item.id === +lead.id ? lead : item)
        },
        DELETE_LEAD (state, data) {
            state.leads = state.leads.filter(item => +item.id !== +data.lead_id)
        },
        SET_LEADS (state, leads) {
            let prevCount = state.leads.filter(item => item.status === 'wait')
            state.leads = leads
            let postCount = state.leads.filter(item => item.status === 'wait')
            if (postCount > prevCount) {
                state.beep = true
                setTimeout(() => state.beep = false, 2000)
            }
        }
    },
    getters: {
        waitingLeadsCount: state => state.leads.filter(item => item.status === 'wait').length
    }
}
