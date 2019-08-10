import Vue from 'vue'

export default {
    state: {
        monthData: null,
    },
    actions: {
        addUserPrize ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_user_prize', {...data})
                    .then(res => {
                        commit('ADD_USER_PRIZE', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        updateUserRate ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_user_rate', {...data})
                    .then(res => {
                        commit('UPDATE_USER_RATE', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
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
        ADD_USER_PRIZE (state, prize) {
            let targetUser = state.monthData.users.find(user => +user.id === +prize.user_id)
            if (targetUser) {
                targetUser.monthPrizes.push(prize)
            }
        },
        UPDATE_USER_RATE (state, data) {
            let target = state.monthData.users.find(user => +user.id === +data.user.id)
            target[data.field_name] = data.user[data.field_name]
        },
        SET_MONTH_DATA (state, data) {
            state.monthData = data
        }
    },
    getters: {

    }
}
