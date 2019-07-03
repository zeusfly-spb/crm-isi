const Cookies = require('js-cookie')

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        basePath: '',
        authUser: null,
        accountingDate: null,
        users: [],
        groups: [],
        access: null,
        accessRequests: [],
        islands: [],
        insoles: [],
        customers: [],
        workingIslandId: 0,
        workdays: [],
        realDate: null,
        scanMode: {
            workdays: true,
            accesses: false
        },
        deals: [],
        startBalance: null
    },
    actions: {
        setStartBalance ({commit}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/start_balance', {
                    date: this.state.accountingDate,
                    island_id: this.state.workingIslandId
                })
                    .then(res => {
                        commit('SET_START_BALANCE', res.data.amount)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteCustomer ({commit}, customerId) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_customer', {customer_id: customerId})
                    .then(() => {
                        commit('DELETE_CUSTOMER', customerId)
                        resolve(customerId)
                    })
                    .catch(e => reject(e))
            })
        },
        addDeal ({commit}, deal) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_deal', {...deal})
                    .then(res => {
                        commit('ADD_DEAL', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setDeals ({commit}) {
            return new Promise((resolve,reject) => {
                Vue.axios.post('/api/get_deals', {
                    date: this.state.accountingDate,
                    island_id: this.state.workingIslandId
                })
                    .then(res => {
                        commit('SET_DEALS', res.data)
                    })
                    .catch(e => reject(e))
            })
        },
        startScanTimer ({dispatch}) {
            setInterval(() => {
                if (this.state.scanMode.workdays) {
                    dispatch('setWorkDays')
                }
                if (this.state.scanMode.accesses) {
                    dispatch('setAccesses')
                }
            }, 5000)
        },
        resumeUserDay ({commit}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/resume_day', {user_id: this.state.authUser.id})
                    .then(res => {
                        commit('UPDATE_WORK_DAY', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setRealDate ({commit}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_accounting_date')
                    .then(res => {
                        commit('SET_REAL_DATE', res.data.date)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        finishUserDay ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/finish_day', {
                    user_id: this.state.authUser.id,
                    working_hours: data.working_hours,
                    dinner_start: data.dinner_start,
                    dinner_finish: data.dinner_finish
                })
                    .then(res => {
                        commit('UPDATE_WORK_DAY', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        startUserDay ({commit}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/start_day', {user_id: this.state.authUser.id})
                    .then(res => {
                        commit('ADD_WORK_DAY', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        enterCRM ({dispatch}) {
            dispatch('setAccountingDate')
                .then(() => {
                    dispatch('setRealDate')
                    dispatch('setUsers')
                    dispatch('setGroups')
                    dispatch('setIslands')
                    dispatch('setWorkDays')
                    dispatch('startScanTimer')
                    dispatch('setDeals')
                    dispatch('setCustomers')
                    dispatch('setInsoles')
                })
        },
        setWorkDays ({commit}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_workdays', {
                    date: this.state.accountingDate,
                    island_id: this.state.workingIslandId
                })
                    .then(res => {
                        commit('SET_WORK_DAYS', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setWorkingIslandId ({commit, dispatch}, id) {
            commit('SET_WORKING_ISLAND_ID', id)
            dispatch('setAccountingDate')
                .then(() => {
                    dispatch('setWorkDays')
                    dispatch('setDeals')
                    dispatch('setStartBalance')
                })
        },
        deleteIsland ({commit}, islandId) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_island', {island_id: islandId})
                    .then(res => {
                        commit('DELETE_ISLAND', islandId)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addCustomerPhone ({commit}, params) {
          return new Promise((resolve, reject) => {
              Vue.axios.post('/api/add_phone', {... params})
                  .then(res => {
                      commit('UPDATE_CUSTOMER', res.data)
                      resolve(res)
                  })
                  .catch(e => reject(e))
          })
        },
        deleteCustomerPhone ({commit}, params) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_phone', {...params})
                    .then(res => {
                        commit('UPDATE_CUSTOMER', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        updateCustomer ({commit}, customer) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_customer', {...customer})
                    .then(res => {
                        commit('UPDATE_CUSTOMER', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addCustomer ({commit}, customer) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/create_customer', {...customer})
                    .then(res => {
                        commit('ADD_CUSTOMER', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setCustomers ({commit}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_customers')
                    .then(res => {
                        commit('SET_CUSTOMERS', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setInsoles ({commit}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_insoles')
                    .then(res => {
                        commit('SET_INSOLES', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteAccess ({commit}, accessId) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_access', {access_id: accessId})
                    .then((res) => {
                        commit('REMOVE_ACCESS_REQUEST', accessId)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setUserIsland ({commit}, islandId) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/set_user_island', {
                    user_id: this.state.authUser.id,
                    island_id: islandId
                })
                    .then(res => {
                        commit('SET_AUTH_USER_ISLAND', res.data.island_id)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addIsland ({commit}, island) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/create_island', {...island})
                    .then(res => {
                        commit('ADD_ISLAND', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setIslands ({commit}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_islands')
                    .then(res => {
                        commit('SET_ISLANDS', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setAccessRequests ({commit}) {
            Vue.axios.post('/api/get_accesses')
                .then(res => commit('SET_ACCESS_REQUESTS', res.data))
        },
        checkAccess: async function ({commit, dispatch}) {
            let exists = Cookies.get('isi-access')
            if (!exists) {
                commit('SET_ACCESS', 'none')
            } else {
                let res = await Vue.axios.post('/api/check_access_status', {device_id: exists})
                commit('SET_ACCESS', res.data.status)
                if (!this.state.authUser.is_superadmin && (this.state.authUser.island_id !== res.data.island_id)) {
                    dispatch('setUserIsland', res.data.island_id)
                }
            }
        },
        deleteGroup ({commit}, id) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_group', {id: id})
                    .then(res => {
                        if (res.data.result) {
                            commit('DELETE_GROUP', id)
                            resolve(res)
                        }
                        reject({error: 'Ошибка удаления группы'})
                    })
                    .catch(e => reject(e))
            })
        },
        updateGroup ({commit}, group) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_group', {...group})
                    .then(res => {
                        commit('UPDATE_GROUP', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addGroup ({commit}, group) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/create_group', {...group})
                    .then(res => {
                        commit('ADD_GROUP', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setGroups ({commit}) {
            Vue.axios.post('/api/get_groups')
                .then(res => commit('SET_GROUPS', res.data))
                .catch(e => console.error(e))
        },
        deleteUser ({commit}, id) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_user', {id: id})
                    .then(res => {
                        if (res.data.result) {
                            commit('DELETE_USER', id)
                            resolve(res)
                        }
                    })
                    .catch(e => reject(e))
            })
        },
        updateUser ({commit}, user) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/save_user', user)
                    .then(res => {
                        if (res.data.error) {
                            reject(res.data)
                        }
                        commit('UPDATE_USER', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        addUser ({commit}, user) {
            return new Promise ((resolve, reject) => {
                Vue.axios.post('/api/register', user)
                    .then(res => {
                        if (res.data.error) {
                            reject(res.data)
                        }
                        commit('ADD_USER', res.data.success.user)
                        resolve(res)
                    })
                    .catch(e => {
                        reject(e)
                    })
            })
        },
        setUsers ({commit}) {
             Vue.axios.post('/api/get_users')
                 .then(res => commit('SET_USERS', res.data))
        },
        logOut ({commit}) {
            commit('AUTH_LOGOUT')
        },
        logIn ({commit, dispatch}, query) {
            return new Promise ((resolve, reject) => {
                commit('SET_STATUS', 'request')
                Vue.axios.post('/api/login', {name: query.name, password: query.password})
                    .then(res => {
                        let token = res.data.success.token
                        Cookies.set('isi-token', token)
                        Vue.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
                        dispatch('setAuthUser')
                        resolve (res)
                    })
                    .catch(e => {
                        commit('AUTH_LOGOUT')
                        reject (e)
                    })
            })
        },
        setAuthUser ({commit}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/details')
                    .then(res => {
                        commit('SET_AUTH_USER', res.data.success)
                        resolve(res)
                    })
                    .catch(e => {
                        commit('AUTH_LOGOUT')
                        reject(e)
                    })
            })

        },
        setAccountingDate ({commit, dispatch}) {
            return new Promise((resolve, reject) => {
                // Verify that current date changed
                let now = new Date().toISOString().split('T')[0]
                let savedRealDate = Cookies.get('saved_real')
                if (!savedRealDate) {
                    Cookies.set('saved_real', now)
                } else if (savedRealDate < now) {
                    Cookies.set('saved_real', now)
                    Cookies.set('accounting_date', now)
                }
                //
                let savedDate = Cookies.get('accounting_date')
                if (savedDate) {
                    commit('SET_ACCOUNTING_DATE', savedDate)
                    dispatch('setStartBalance')
                    resolve(savedDate)
                } else {
                    Vue.axios.post('/api/get_accounting_date')
                        .then(res => {
                            commit('SET_ACCOUNTING_DATE', res.data.date)
                            dispatch('setStartBalance')
                            resolve(res)
                        })
                        .catch(e => {
                            console.error(e)
                            reject(e)
                        })
                }
            })
        },
        changeAccountingDate ({commit, dispatch}, date) {
            Cookies.set('accounting_date', date)
            commit('SET_ACCOUNTING_DATE', date)
            dispatch('setDeals')
            dispatch('setWorkDays')
            dispatch('setStartBalance')
        }
    },
    mutations: {
        SET_START_BALANCE (state, balance) {
            state.startBalance = balance
        },
        DELETE_CUSTOMER (state, customerId) {
            state.customers = state.customers.filter(item => item.id !== customerId)
        },
        ADD_DEAL (state, deal) {
            state.deals.push(deal)
        },
        SET_DEALS (state, deals) {
            state.deals = deals
        },
        SET_SCAN_MODE (state, mode) {
            state.scanMode = mode
        },
        SET_REAL_DATE (state, date) {
          state.realDate = new Date(date).toISOString().split('T')[0]
        },
        UPDATE_WORK_DAY (state, workday) {
            state.workdays = state.workdays.map(item => item.id === workday.id ? workday : item)
        },
        ADD_WORK_DAY (state, workday) {
            state.workdays.push(workday)
        },
        SET_WORK_DAYS (state, workdays) {
            state.workdays = workdays
        },
        SET_OWN_ISLAND_AS_WORKING (state) {
            state.workingIslandId = state.authUser.island_id
        },
        SET_WORKING_ISLAND_ID (state, id) {
            state.workingIslandId = id
        },
        DELETE_ISLAND (state, islandId) {
            state.islands = state.islands.filter(island => island.id !== islandId)
        },
        UPDATE_CUSTOMER (state, customer) {
            state.customers = state.customers.map(item => +item.id === +customer.id ? customer : item)
        },
        ADD_CUSTOMER (state, customer) {
            state.customers.push(customer)
        },
        SET_CUSTOMERS (state, customers) {
            state.customers = customers
        },
        SET_INSOLES (state, insoles) {
            state.insoles = insoles
        },
        REMOVE_ACCESS_REQUEST (state, accessId) {
            state.accessRequests = state.accessRequests.filter(item => item.id !== accessId)
        },
        SET_AUTH_USER_ISLAND (state, islandId) {
            state.authUser = {... state.authUser, island_id: islandId}
        },
        ADD_ISLAND(state, island) {
            state.islands.push(island)
        },
        SET_ISLANDS (state, islands) {
            state.islands = islands
        },
        SET_ACCESS_REQUESTS (state, accesses) {
            state.accessRequests = accesses
        },
        SET_DEVICE_ID (state, deviceId) {
            console.log('Setting cookie ' + deviceId)
            Cookies.set('isi-access', deviceId)
        },
        SET_ACCESS (state, access) {
            state.access = access
        },
        SET_BASE_PATH (state, path) {
            state.basePath = path
        },
        DELETE_GROUP (state, id) {
            state.groups = state.groups.filter(group => group.id !== id)
        },
        UPDATE_GROUP (state, group) {
            state.groups = state.groups.map(item => item.id === group.id ? group : item)
        },
        ADD_GROUP (state, group) {
            state.groups.push(group)
        },
        SET_GROUPS (state, groups) {
            state.groups = groups
        },
        DELETE_USER (state, id) {
            state.users = state.users.filter(user => user.id !== id)
        },
        UPDATE_USER (state, user) {
            state.users = state.users.map(item => item.id === user.id ? user : item)
        },
        ADD_USER (state, user) {
            state.users.push(user)
        },
        SET_USERS (state, users) {
            state.users = users
        },
        SET_ACCOUNTING_DATE (state, date) {
            state.accountingDate = date
        },
        SET_STATUS (state, status) {
            state.status = status
        },
        AUTH_LOGOUT (state) {
            Cookies.remove('accounting_date')
            Cookies.remove('isi-token')
            delete Vue.axios.defaults.headers.common['Authorization']
            state.authUser = null
            state.status = 'logout'
        },
        SET_AUTH_USER (state, user) {
            state.authUser = user
            state.status = 'success'
        }
    },
    getters: {
        isAuth: state => !!state.authUser,
        token: () => Cookies.get('isi-token') || null,
        isAllowed: state => !!state.authUser && (state.authUser.is_superadmin || state.status === 'allowed'),
        isSuperadmin: state => !!state.authUser && state.authUser.is_superadmin,
        isDayOpen: state => {
            let currentDate = new Date(state.realDate).toISOString().split('T')[0]
            let today = state.accountingDate === currentDate
            let usersWorkDay = state.workdays.find(item => item.user_id === state.authUser.id)
            return !!usersWorkDay && !!usersWorkDay.time_start && !usersWorkDay.time_finish && today
        },
        currentWorkDay: state => {
            return state.authUser && state.workdays.find(item => item.user_id === state.authUser.id)
        },
        isDayClosed: state => {
            let currentWorkDay =  state.authUser && state.workdays.find(item => item.user_id === state.authUser.id)
            return !!currentWorkDay && currentWorkDay.time_start && !!currentWorkDay && !!currentWorkDay.time_finish
        }
    }
})
