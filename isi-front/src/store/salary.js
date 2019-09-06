import Vue from 'vue'

export default {
    state: {
        monthData: null,
    },
    actions: {
        deleteUserPrize ({commit}, prizeId) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_user_prize', {id: prizeId})
                    .then(res => {
                        commit('DELETE_USER_PRIZE', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteUserForfeit ({commit}, forfeitId) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_user_forfeit', {id: forfeitId})
                    .then(res => {
                        commit('DELETE_USER_FORFEIT', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addUserPrepay ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_user_prepay', {...data})
                    .then(res => {
                        commit('ADD_USER_PREPAY', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addUserSick ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_user_sick', {...data})
                    .then(res => {
                        commit('ADD_USER_SICK', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addUserForfeit ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_user_forfeit', {...data})
                    .then(res => {
                        commit('ADD_USER_FORFEIT', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
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
            commit('SET_LOADING_ON')
            commit('ADD_TASK', 'salary')
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_month_data', {
                    island_id: rootState.workingIslandId,
                    date: rootState.accountingDate
                })
                    .then(res => {
                        commit('SET_MONTH_DATA', res.data)
                        commit('SET_LOADING_OFF')
                        resolve(res)
                    })
                    .catch(e => reject(e))
                    .finally(() => commit('REMOVE_TASK', 'salary'))
            })
        }
    },
    mutations: {
        DELETE_USER_PRIZE (state, data) {
            let user = state.monthData.users.find(item => +item.id === +data.user_id)
            user.monthPrizes = user.monthPrizes.filter(item => +item.id !== +data.prize_id)
        },
        DELETE_USER_FORFEIT (state, data) {
            let user = state.monthData.users.find(item => +item.id === +data.user_id)
            user.monthForfeits = user.monthForfeits.filter(item => +item.id !== +data.forfeit_id)
        },
        ADD_USER_PREPAY (state, prepay) {
            let targetUser = state.monthData.users.find(user => +user.id === +prepay.user_id)
            if (targetUser) {
                targetUser.monthPrepays.push(prepay)
            }
        },
        ADD_USER_SICK (state, sick) {
            let targetUser = state.monthData.users.find(user => +user.id === +sick.user_id)
            if (targetUser) {
                targetUser.monthSicks.push(sick)
            }
        },
        ADD_USER_FORFEIT (state, forfeit) {
            let targetUser = state.monthData.users.find(user => +user.id === +forfeit.user_id)
            if (targetUser) {
                targetUser.monthForfeits.push(forfeit)
            }
        },
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