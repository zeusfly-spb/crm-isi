import Vue from 'vue'

export default {
    state: {
        services: [],
        subscriptions: [],
        subscriptionToDelete: null
    },
    actions: {
        deleteSubscription ({commit, dispatch}, subscription) {
            return new Promise ((resolve, reject) => {
                Vue.axios.post('/api/delete_subscription', {id: subscription.id})
                    .then(res => {
                        commit ('DELETE_SUBSCRIPTION', subscription.id)
                        let info = `Абонемент "${subscription.name}" удален`
                        dispatch('pushMessage', {
                            text: info,
                            color: 'green'
                        })
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })

        },
        createSubscription ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/create_subscription', {... data})
                    .then(res => {
                        commit('ADD_SUBSCRIPTION', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteService ({commit}, id) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/delete_service', {id: id})
                    .then(res => {
                        commit('DELETE_SERVICE', id)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        updateService ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_service', {... data})
                    .then(res => {
                        commit('UPDATE_SERVICE', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        createService ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/create_service', {... data})
                    .then(res => {
                        commit('ADD_SERVICE', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setCatalogs ({commit}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_catalogs')
                    .then(res => {
                        commit('SET_CATALOGS', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        }
    },
    mutations: {
        DELETE_SUBSCRIPTION (state, subscriptionId) {
            state.subscriptions = state.subscriptions.filter(item => item.id !== subscriptionId)
        },
        UNSET_SUBSCRIPTION_TO_DELETE (state) {
            state.subscriptionToDelete = null
        },
        SET_SUBSCRIPTION_TO_DELETE (state, subscription) {
            state.subscriptionToDelete = subscription
        },
        ADD_SUBSCRIPTION (state, subscription) {
            state.subscriptions.push(subscription)
        },
        DELETE_SERVICE (state, id) {
            state.services = state.services.filter(item => item.id !== id)
        },
        UPDATE_SERVICE (state, service) {
            state.services = state.services.map(item => item.id === service.id ? service : item)
        },
        ADD_SERVICE (state, service) {
            state.services.push(service)
        },
        SET_CATALOGS (state, data) {
            state.services = data.services
            state.subscriptions = data.subscriptions
        }
    }
}
