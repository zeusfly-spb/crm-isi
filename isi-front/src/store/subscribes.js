import Vue from 'vue'

export default {
    state: {
        commentsUpdating: false,
        commentsOpenId: null,
        eventsOpenId: null,
        subscribesLoading: false,
        subscribes: []
    },
    actions: {
        deleteSubscribeComment ({commit, dispatch}, data) {
            return new Promise((resolve, reject) => {
                commit('SET_DESCRIBE_COMMENTS_UPDATING', true)
                Vue.axios.post('/api/delete_subscribe_comment', {... data})
                    .then(res => {
                        commit('UPDATE_SUBSCRIBE', res.data)
                        dispatch('pushMessage', {
                            text: 'Комментарий абонемента удален',
                            color: 'green'
                        })
                        resolve(res)
                    })
                    .catch(e => reject(e))
                    .finally(() => commit('SET_DESCRIBE_COMMENTS_UPDATING', false))
            })
        },
        addSubscribeComment ({commit, dispatch, rootState}, data) {
            return new Promise((resolve, reject) => {
                commit('SET_DESCRIBE_COMMENTS_UPDATING', true)
                Vue.axios.post('/api/add_subscribe_comment', {
                    ... data,
                    user_id: rootState.authUser.id
                })
                    .then(res => {
                        commit('UPDATE_SUBSCRIBE', res.data)
                        dispatch('pushMessage', {
                            text: 'К абонементу добавлен комментарий',
                            color: 'green'
                        })
                        resolve(res)
                    })
                    .catch(e => reject(e))
                    .finally(() => commit('SET_DESCRIBE_COMMENTS_UPDATING', false))
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
        SET_SUBSCRIBE_EVENTS_OPEN_ID (state, val) {
            state.eventsOpenId = val
        },
        SET_DESCRIBE_COMMENTS_UPDATING (state, val) {
            state.commentsUpdating = val
        },
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
    },
    getters: {
        eventsOpenSubscribe: state => {
            const attachScale = subscribe => {
                if (!subscribe) {
                    return subscribe
                }
                let scale = new Array(subscribe.nominal)
                subscribe.events.length ? subscribe.events.forEach((item, index) => {
                    scale[index] = item
                }) : null
                return {... subscribe, scale: scale}
            }
            let base = !state.eventsOpenId ? null
                : !state.subscribes.length ? null
                : state.subscribes.find(item => +item.id === +state.eventsOpenId)
            return attachScale(base)
        }
    }
}
