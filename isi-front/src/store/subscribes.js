import Vue from 'vue'

export default {
    state: {
        subscribes: []
    },
    actions: {
        setSubscribes ({commit, rootState, getters}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_subscribes', {
                    island_id: rootState.workingIslandId,
                    date: getters.eventsDate
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
