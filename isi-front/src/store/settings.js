import Vue from 'vue'

export default {
    state: {
        data: {
            switcherPanel: {
                maxAvaCount: 5
            }
        }
    },
    actions: {
        setSetting ({commit}) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/get_setting')
                    .then(res => {
                        commit('SET_SETTING', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        }
    },
    mutations: {
        SET_SETTING (state, setting) {
            state.data = setting.data
        }
    },
    getters: {

    }
}
