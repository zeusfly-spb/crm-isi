import Vue from 'vue'

export default {
    state: {
        subscribesLoading: false,
        subscribes: []
    },
    actions: {
        setSubscribes ({commit, rootState, getters}) {
            commit('SET_SUBSCRIBES_LOADING', true)
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
                    .finally(() => commit('SET_SUBSCRIBES_LOADING', false))
            })
        }
    },
    mutations: {
        SET_SUBSCRIBES_LOADING (state, val) {
            state.subscribesLoading = val
        },
        SET_SUBSCRIBES (state, subscribes) {
            state.subscribes = subscribes
        }
    }
}
