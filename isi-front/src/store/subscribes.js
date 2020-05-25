import Vue from 'vue'

export default {
    state: {
        commentsOpenId: null,
        eventsOpenId: null,
        subscribesLoading: false,
        subscribes: []
    },
    actions: {
        addSubscribeComment ({commit, rootState}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/add_subscribe_comment', {
                    ... data,
                    user_id: rootState.authUser.id
                })
                    .then(res => {
                        commit('UPDATE_SUBSCRIBE', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        },
        setSubscribes ({commit, rootState, getters}) {
            commit('SET_SUBSCRIBES_LOADING', true)
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_subscribes', {
                    island_id: rootState.workingIslandId,
                    date: getters.eventsDate
                })
                    .then(res => {
                        commit('SET_SUBSCRIBES', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
                    .finally(() => commit('SET_SUBSCRIBES_LOADING', false))
            })
        }
    },
    mutations: {
        UPDATE_SUBSCRIBE (state, subscribe) {
            state.subscribes = state.subscribes.map(item => +item.id === +subscribe.id ? subscribe : item)
        },
        SET_SUBSCRIBE_COMMENTS_OPEN_ID (state, subscribeId) {
            state.commentsOpenId = subscribeId
        },
        SET_SUBSCRIBES_LOADING (state, val) {
            state.subscribesLoading = val
        },
        SET_SUBSCRIBES (state, subscribes) {
            state.subscribes = subscribes
        }
    }
}
