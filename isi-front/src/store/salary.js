import Vue from 'vue'

export default {
    state: {
        monthData: null,
        mustUpdate: false,
        statData: null
    },
    actions: {
        appendSalaryCharges ({state, rootState}) {
            state.monthData.users = state.monthData.users.map(user => ({
                ... user,
                controlled_islands: rootState.islands.filter(island => island.chief_id === user.id)
            }))
        },
        updateUserRates ({commit, dispatch}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_user_rates', {... data})
                    .then(res => {
                        commit('UPDATE_MONTH_USER', res.data)
                        dispatch('appendSalaryCharges')
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteUserPrepay ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_user_prepay', {... data})
                    .then(res => {
                        commit('DELETE_USER_PREPAY', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteUserVacation ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_user_vacation', {... data})
                    .then(res => {
                        commit('DELETE_USER_VACATION', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addUserVacation ({commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_user_vacation', {
                    ... data,
                    date: rootState.accountingDate
                })
                    .then(res => {
                        commit('ADD_USER_VACATION', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteUserSick ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_user_sick', {... data})
                    .then(res => {
                        commit('DELETE_USER_SICK', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteUserPrize ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_user_prize', {... data})
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
        addUserPrepay ({commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_user_prepay', {
                    ...data,
                    date: rootState.accountingDate
                })
                    .then(res => {
                        commit('ADD_USER_PREPAY', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addUserSick ({commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_user_sick', {
                    ...data,
                    date: rootState.accountingDate
                })
                    .then(res => {
                        commit('ADD_USER_SICK', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addUserForfeit ({commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_user_forfeit', {
                    ...data,
                    date: rootState.accountingDate
                })
                    .then(res => {
                        commit('ADD_USER_FORFEIT', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addUserPrize ({commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_user_prize', {
                    ...data,
                    date: rootState.accountingDate
                })
                    .then(res => {
                        commit('ADD_USER_PRIZE', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        updateUserRate ({commit, dispatch}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_user_rate', {...data})
                    .then(res => {
                        commit('UPDATE_USER_RATE', res.data)
                        dispatch('appendSalaryCharges')
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setMonthData ({commit, rootState, dispatch}) {
            commit('ADD_TASK', 'salary')
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_month_data', {
                    island_id: rootState.workingIslandId,
                    date: rootState.accountingDate
                })
                    .then(res => {
                        commit('SET_MONTH_DATA', JSON.parse(JSON.stringify(res.data)))
                        dispatch('appendSalaryCharges')
                        if (!rootState.workingIslandId) {
                            commit('SET_STAT_DATA', res.data)
                        }
                        resolve(res)
                    })
                    .catch(e => reject(e))
                    .finally(() => commit('REMOVE_TASK', 'salary'))
            })
        }
    },
    mutations: {
        SET_STAT_DATA (state, data) {
            state.statData = data
        },
        UPDATE_MONTH_USER (state, user) {
            let firstDate = state.monthData.dates[0]
            let lastDate = state.monthData.dates[state.monthData.dates.length - 1]
            const getDate = (timestamp) => timestamp.split(' ')[0] || null
            user.dates = state.monthData.dates
            user.monthDeals = user.deals.filter(deal => getDate(deal.created_at) >= firstDate &&  getDate(deal.created_at) <= lastDate) || []
            user.monthWorkdays = user.workdays.filter(workday => workday.date >= firstDate && workday.date <= lastDate) || []
            user.monthPrizes = user.prizes.filter(prize => getDate(prize.created_at) >= firstDate && getDate(prize.created_at) <= lastDate) || []
            user.monthForfeits = user.forfeits.filter(forfeit => getDate(forfeit.created_at) >= firstDate && getDate(forfeit.created_at) <= lastDate) || []
            user.monthSicks = user.sicks.filter(sick => getDate(sick.created_at) >= firstDate && getDate(sick.created_at) <= lastDate) || []
            user.monthPrepays = user.prepays.filter(prepay => getDate(prepay.created_at) >= firstDate && getDate(prepay.created_at) <= lastDate) || []
            user.monthVacations = user.vacations.filter(vacation => getDate(vacation.created_at) >= firstDate && getDate(vacation.created_at) <= lastDate) || []
            state.monthData.users = state.monthData.users.map(item => +item.id === +user.id ? user : item)
        },
        DELETE_USER_PREPAY (state, data) {
            let user = state.monthData.users.find(item => +item.id === +data.user_id)
            user.monthPrepays = user.monthPrepays.filter(item => +item.id !== +data.prepay_id)
        },
        DELETE_USER_VACATION (state, data) {
            let user = state.monthData.users.find(item => +item.id === +data.user_id)
            user.monthVacations = user.monthVacations.filter(item => +item.id !== data.vacation_id)
        },
        ADD_USER_VACATION (state, vacation) {
            let targetUser = state.monthData.users.find(user => +user.id === +vacation.user_id)
            if (targetUser) {
                targetUser.monthVacations.push(vacation)
            }
        },
        DELETE_USER_SICK (state, data) {
            let user = state.monthData.users.find(item => +item.id === +data.user_id)
            user.monthSicks = user.monthSicks.filter(item => +item.id !== +data.sick_id)
        },
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
            let firstDate = data.dates[0]
            let lastDate = data.dates[data.dates.length - 1]
            const getDate = (timestamp) => timestamp.split(' ')[0] || null
            const addMonthCharges = rawData => {
                rawData.users = rawData.users.map(user => ({...user,
                    dates: data.dates,
                    monthDeals: user.deals.filter(deal => getDate(deal.created_at) >= firstDate &&  getDate(deal.created_at) <= lastDate) || [],
                    monthWorkdays: user.workdays.filter(workday => workday.date >= firstDate && workday.date <= lastDate) || [],
                    monthPrizes: user.prizes.filter(prize => getDate(prize.created_at) >= firstDate && getDate(prize.created_at) <= lastDate) || [],
                    monthForfeits: user.forfeits.filter(forfeit => getDate(forfeit.created_at) >= firstDate && getDate(forfeit.created_at) <= lastDate) || [],
                    monthSicks: user.sicks.filter(sick => getDate(sick.created_at) >= firstDate && getDate(sick.created_at) <= lastDate) || [],
                    monthPrepays: user.prepays.filter(prepay => getDate(prepay.created_at) >= firstDate && getDate(prepay.created_at) <= lastDate) || [],
                    monthVacations: user.vacations.filter(vacation => getDate(vacation.created_at) >= firstDate && getDate(vacation.created_at) <= lastDate) || []
                }))
                return rawData
            }
            state.monthData = addMonthCharges(data)
            state.mustUpdate = true
            setTimeout(() => state.mustUpdate = false, 300)
        }
    },
    getters: {

    }
}
