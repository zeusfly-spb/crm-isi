import Vue from 'vue'

export default {
    state: {
        reserves: [],
        stockActions: []
    },
    actions: {
        setStockActions ({commit, rootState}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_stock_actions', {
                    date: rootState.accountingDate,
                    island_id: rootState.workingIslandId
                })
                    .then(res => {
                        commit('SET_STOCK_ACTIONS', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
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
        SET_STOCK_ACTIONS (state, stockActions) {
            state.stockActions = stockActions
        },
        SET_RESERVES (state, reserves) {
            state.reserves = reserves
        }
    },
    getters: {
        currentReserves: state => {
            let result = []
            state.reserves.forEach(item => {
                let expenseTarget = state.stockActions.find(action => action.type === 'expense' && action.product_id === item.product_id && action.type_id === item.type_id && action.size_id === item.size_id)
                let expense = expenseTarget && expenseTarget.count || 0
                let receiptTarget = state.stockActions.find(action => action.type === 'receipt' && action.product_id === item.product_id && action.type_id === item.type_id && action.size_id === item.size_id)
                let receipt = receiptTarget && receiptTarget.count || 0
                let clone = JSON.parse(JSON.stringify(item))
                clone.count = clone.count - expense + receipt
                result.push(clone)
            })
            return result
        }
    }
}
