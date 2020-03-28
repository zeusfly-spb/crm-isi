import Vue from 'vue'
export default {
    actions: {
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