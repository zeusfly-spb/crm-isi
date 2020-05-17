const Cookies = require('js-cookie')
import Vue from 'vue'

export default {
    state: {
        counts: null,
        leadStatus: 'wait',
        leads: [],
        beep: false,
        withDone: false,
        savedPage: null
    },
    actions: {
        loadStockPage ({commit, rootState}) {
            commit('ADD_TASK', 'stock')
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/load_stock_page', {
                    date: rootState.accountingDate,
                    island_id: rootState.workingIslandId
                })
                    .then(res => {
                        commit('SET_RESERVES', res.data.reserves)
                        commit('SET_STOCK_ACTIONS', res.data.stock_actions)
                        commit('SET_STOCK_OPTIONS', res.data.stock_options)
                        commit('REMOVE_TASK', 'stock')
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        priorPrepare ({commit, dispatch}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/prior_prepare')
                    .then(res => {
                        let tempTime = new Date()
                        let localTimeOffset = tempTime.getTimezoneOffset() * 60000
                        let now = new Date(tempTime.getTime() - localTimeOffset)
                            .toISOString()
                            .split('T')[0]
                        let savedRealDate = Cookies.get('saved_real')
                        if (!savedRealDate) {
                            Cookies.set('saved_real', now)
                        } else if (savedRealDate < now) {
                            Cookies.set('saved_real', now)
                            Cookies.set('accounting_date', now)
                        }
                        let savedDate = Cookies.get('accounting_date')
                        if (savedDate) {
                            commit('SET_ACCOUNTING_DATE', savedDate)
                            commit('SET_APPOINTMENT_DATE', savedDate)
                        } else {
                            commit('SET_APPOINTMENT_DATE', res.data.date)
                            commit('SET_ACCOUNTING_DATE', res.data.date)
                        }
                        dispatch('setStartBalance')
                        commit('SET_REAL_DATE', res.data.date)
                        if (res.data.setting) {
                            commit('SET_SETTING', res.data.setting)
                        }
                        commit('SET_ISLANDS', res.data.islands)
                        commit('APPEND_USER_ISLANDS')
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setSavedPage ({commit}) {
            let savedPage = Cookies.get('saved-page') || null
            commit('CHANGE_SAVED_PAGE', savedPage)
        },
        changeSavedPage ({commit}, page) {
            Cookies.set('saved-page', page)
            commit('CHANGE_SAVED_PAGE', page)
        },
        updateAccessIsland ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_access_island', {... data})
                    .then(res => {
                        commit('UPDATE_ACCESS_REQUEST', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        updateIslandUsers ({commit, dispatch}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_island_users', {... data})
                    .then(res => {
                        commit('UPDATE_ISLAND', res.data.island)
                        if (res.data.users.length) {
                            res.data.users.forEach(item => commit('UPDATE_USER', item))
                        } else {
                            dispatch('setUsers')
                        }
                        resolve (res)
                    })
                    .catch(e => reject(e))
            })
        },
        updateUserIslands ({commit, dispatch}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_user_islands', {... data})
                    .then(res => {
                        commit('UPDATE_USER', res.data.user)
                        if (res.data.islands.length) {
                            res.data.islands.forEach(item => commit('UPDATE_ISLAND', item))
                        } else {
                            dispatch('setIslands')
                        }
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addLeadCall ({commit, rootState}, leadId) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_lead_call', {
                    user_id: rootState.authUser.id,
                    lead_id: leadId
                })
                    .then(res => {
                        commit('UPDATE_LEAD', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteCustomImage ({commit}, id) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_custom_image', {id: id})
                    .then(res => {
                        commit('UPDATE_USER', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        uploadCustomImage ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/upload_custom_image', data)
                    .then(res => {
                        commit('UPDATE_USER', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteCustomDoc ({commit}, id) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_custom_doc', {id: id})
                    .then(res => {
                        commit('UPDATE_USER', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addCustomDoc ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_custom_doc', {... data})
                    .then(res => {
                        commit('UPDATE_USER', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setDoneMode ({commit, dispatch, rootState}, doneMode) {
            commit('SET_DONE_MODE', doneMode)
            commit('SET_SCAN_MODE', {...rootState.scanMode, leads: false})
            if (doneMode) {
                dispatch('setLeads')
                    .then(() => commit('SET_SCAN_MODE', {...rootState.scanMode, leads: true}))
            } else {
                dispatch('setLeadsOnTimer')
                    .then(() => commit('SET_SCAN_MODE', {...rootState.scanMode, leads: true}))
            }
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
                        // commit('ADD_LEAD', res.data)
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
        setLeadsOnTimer ({commit, rootState, state, getters}) {
            return new Promise((resolve ,reject) => {
                Vue.axios.post('/api/get_leads', {
                    date: rootState.accountingDate,
                    with_done: state.withDone,
                    page: getters.paginator_page,
                    per_page: getters.paginator_per_page,
                    status: state.leadStatus
                })
                    .then(res => {
                        res.data.counts ? commit('SET_COUNTS', res.data.counts) : null
                        res.data.paginator_data ? commit('SYNC_PAGINATION', res.data.paginator_data) : null
                        commit('SET_LEADS', res.data.leads)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setLeads ({commit, dispatch}) {
            commit('ADD_TASK', 'leads')
            dispatch('setLeadsOnTimer')
                .finally(() => commit('REMOVE_TASK', 'leads'))

        },
        updateIslandChiefId ({commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_chief_id', {... data, date: rootState.accountingDate})
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
        SET_COUNTS (state, counts) {
            state.counts = counts
        },
        CHANGE_LEAD_STATUS (state, status) {
            state.leadStatus = status
        },
        CHANGE_SAVED_PAGE (state, page) {
            state.savedPage = page
        },
        SET_DONE_MODE (state, done) {
            state.withDone = done
        },
        ADD_LEAD (state, lead) {
            state.leads.unshift(lead)
        },
        UPDATE_LEAD (state, lead) {
            state.leads = state.leads.map(item => +item.id === +lead.id ? lead : item)
        },
        DELETE_LEAD (state, data) {
            state.leads = state.leads.filter(item => +item.id !== +data.id)
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
