import Vue from 'vue'

export default {
    state: {
        leads: []
    },
    actions: {
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
        updateLeadStatus ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_lead_status', {... data})
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
        setLeadsOnTimer ({commit, rootState}) {
            return new Promise((resolve ,reject) => {
                Vue.axios.post('/api/get_leads', {date: rootState.accountingDate})
                    .then(res => {
                        commit('SET_LEADS', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setLeads ({commit, rootState}) {
            return new Promise((resolve ,reject) => {
                commit('ADD_TASK', 'leads')
                Vue.axios.post('/api/get_leads', {date: rootState.accountingDate})
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
                        resolve(res)
                    })
                    .catch(e => reject(e))
                    .finally(() => commit('REMOVE_TASK', 'daily'))
            })
        }
    },
    mutations: {
        UPDATE_LEAD (state, lead) {
            state.leads = state.leads.map(item => +item.id === +lead.id ? lead : item)
        },
        DELETE_LEAD (state, data) {
            state.leads = state.leads.filter(item => +item.id !== +data.lead_id)
        },
        SET_LEADS (state, leads) {
            state.leads = leads
        },
        SET_DAILY_PAGE (rootState, data) {
            rootState.workdays = data.workdays
            rootState.deals = data.deals
            rootState.expenses = data.expenses
            rootState.handover = data.handover
        }
    },
    getters: {
        waitingLeadsCount: state => state.leads.filter(item => item.status === 'wait').length
    }
}
