import Vue from 'vue'

export default {
    state: {
        services: [],
        subscriptions: []
    },
    actions: {
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
