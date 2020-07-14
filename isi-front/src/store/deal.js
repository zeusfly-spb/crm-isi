import Vue from 'vue'
export default {
    actions: {
        updateDealPrice ({commit, dispatch}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_deal_price', {... data})
                    .then(res => {
                        // commit('UPDATE_DEAL', res.data)
                        dispatch('pushFrame', {
                            type: 'update_deal',
                            model: res.data
                        })
                        resolve(res)
                    })
                    .catch(e => reject(e))

            })
        },
        updateDealCustomerId ({commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_deal_customer', {...data})
                    .then(res => {
                        commit('UPDATE_DEAL', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        }
    }
}
