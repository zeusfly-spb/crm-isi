import Vue from 'vue'

export default {
    actions: {
        updateIsland ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_island', {...data})
                    .then(res => {
                        commit('UPDATE_ISLAND', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        }
    }
}
