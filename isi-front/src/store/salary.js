import Vue from 'vue'

export default {
    state: {
        monthData: null,
    },
    actions: {
        setMonthData ({commit, rootState}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_month_data', {
                    island_id: rootState.workingIslandId,
                    date: rootState.accountingDate
                })
                    .then(res => {
                        commit('SET_MONTH_DATA', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        }
    },
    mutations: {
        SET_MONTH_DATA (state, data) {
            state.monthData = data
        }
    },
    getters: {

    }
}
