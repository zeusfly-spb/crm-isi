import Vue from 'vue'

export default {
    state: {
        reserves: []
    },
    actions: {
        setReserves ({commit, rootState}) {
            return new Promise ((resolve, reject) => {
                Vue.axios.post('/api/get_reserves', {
                    date: rootState.accountingDate,
                    island_id: rootState.workingIslandId
                })
                    .then(res => {
                        commit('SET_RESERVES', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        }
    },
    mutations: {
        SET_RESERVES (state, reserves) {
            state.reserves = reserves
        }
    }
}
