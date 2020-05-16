import Vue from 'vue'

export default {
    state: {
        subscribes: []
    },
    actions: {
        setSubscribes ({commit, rootState}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_subscribes', {
                    island_id: rootState.workingIslandId,
                    date: rootState.accountingDate
                })
                    .then(res => {
                        commit('SET_SUBSCRIBES', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        }
    },
    mutations: {
        SET_SUBSCRIBES (state, subscribes) {
            state.subscribes = subscribes
        }
    }
}
