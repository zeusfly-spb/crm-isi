import Vue from 'vue'

export default {
    state: {
    },
    actions: {
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
        SET_DAILY_PAGE (rootState, data) {
            rootState.workdays = data.workdays
            rootState.deals = data.deals
            rootState.expenses = data.expenses
            rootState.handover = data.handover
        }
    },
    getters: {

    }
}
