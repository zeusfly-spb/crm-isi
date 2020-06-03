import Vue from 'vue'

export default {
    state: {
        attemptToAddNotifyTemplate: false,
        notifyTemplates: [],
        services: [],
        subscriptions: [],
        subscriptionToDelete: null,
        subscriptionToEdit: null
    },
    actions: {
        createNotifyTemplate ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/create_notify_template', {... data})
                    .then(res => {
                        commit('ADD_NOTIFY_TEMPLATE', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        updateSubscription ({commit, dispatch}, subscription) {
            return new Promise ((resolve, reject) => {
                Vue.axios.post('/api/update_subscription', {...subscription})
                    .then(res => {
                        commit('UPDATE_SUBSCRIPTION', res.data)
                        let info = `Абонемент "${subscription.name || ''}" изменен`
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        deleteSubscription ({commit, dispatch}, subscription) {
            return new Promise ((resolve, reject) => {
                Vue.axios.post('/api/delete_subscription', {subscription_id: subscription.id})
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
        createSubscription ({commit, dispatch}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/create_subscription', {... data})
                    .then(res => {
                        commit('ADD_SUBSCRIPTION', res.data)
                        let info = `Добавлен абонемент "${res.data.name || ''}"`
                        dispatch('pushMessage', {
                            text: info,
                            color: 'green'
                        })
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
        SET_ATTEMPT_TO_ADD_NOTIFY_TEMPLATE (state, val) {
            state.attemptToAddNotifyTemplate = val
        },
        ADD_NOTIFY_TEMPLATE (state, template) {
            state.notifyTemplates.push(template)
        },
        UPDATE_SUBSCRIPTION (state, subscription) {
            state.subscriptions = state.subscriptions.map(item => +item.id === +subscription.id ? subscription : item)
        },
        UNSET_SUBSCRIPTION_TO_EDIT (state) {
            state.subscriptionToEdit = null
        },
        SET_SUBSCRIPTION_TO_EDIT (state, subscription) {
            state.subscriptionToEdit = subscription
        },
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
            state.notifyTemplates = data.notify_templates
        }
    },
    getters: {
        allServices: state => state.services
    }
}
