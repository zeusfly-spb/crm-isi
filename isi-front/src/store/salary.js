import Vue from 'vue'

export default {
    state: {
        monthData: null,
    },
    actions: {
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
        UPDATE_USER_RATE (state, data) {
            const updateValue = (user) => {
                let result = []
                for (let key in user) {
                    result[key] = key === data.field_name ? data.value : user[key]
                }
                return result
            }
            state.monthData.users = state.monthData.users.map(item => item.id === data.user.id ? updateValue(item) : item)
        },
        SET_MONTH_DATA (state, data) {
            state.monthData = data
        }
    },
    getters: {

    }
}
