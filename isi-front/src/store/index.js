const Cookies = require('js-cookie')

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        authUser: null,
        accountingDate: null,
        users: [],
        groups: []
    },
    actions: {
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
                Vue.axios.post('/api/save_user', {...user})
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
                Vue.axios.post('/api/register', {...user})
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
            Vue.axios.post('/api/details')
                .then(res => commit('SET_AUTH_USER', res.data.success))
                .catch(e => commit('AUTH_LOGOUT'))
        },
        setAccountingDate ({commit}) {
            let savedDate = Cookies.get('accounting_date')
            if (savedDate) {
                commit('SET_ACCOUNTING_DATE', savedDate)
            } else {
                Vue.axios.post('/api/get_accounting_date')
                    .then(res => commit('SET_ACCOUNTING_DATE', res.data.date))
                    .catch(e => {
                        console.error(e)
                    })
            }
        },
        changeAccountingDate ({commit}, date) {
            Cookies.set('accounting_date', date)
            commit('SET_ACCOUNTING_DATE', date)
        }
    },
    mutations: {
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
        token: () => Cookies.get('isi-token') || null
    }
})
