const Cookies = require('js-cookie')

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        authUser: null,
        accountingDate: null,
        users: []
    },
    actions: {
        updateUser ({commit}, user) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/save_user', {...user})
                    .then(res => {
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
                        commit('ADD_USER', res.data.success.user)
                        resolve(res)
                    })
                    .catch(e => {
                        console.error(e.data)
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
