import Vue from 'vue'

export default {
    actions: {
        cabinetsReduced (islandId) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/island_cabinets_reduced', {
                    island_id: islandId
                })
                    .then(res => resolve(res.data))
                    .catch(e => reject(e))
            })
        },
        firstCabinetCreated (islandId) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/island_first_cabinet', {
                    island_id: islandId
                })
                    .then(res => resolve(res.data))
                    .catch(e => reject(e))
            })
        },
        updateIslandChiefs ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_island_chiefs', {... data})
                    .then(res => {
                        commit('UPDATE_ISLAND', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
                    .finally(() => commit('APPEND_USER_ISLANDS'))
            })
        },
        updateIsland ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_island', {...data})
                    .then(res => {
                        commit('UPDATE_ISLAND', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
                    .finally(() => commit('APPEND_USER_ISLANDS'))
            })
        }
    }
}
