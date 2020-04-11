import Vue from 'vue'

export default {
    state: {
        data: {
            switcherPanel: {
                maxAvaCount: 5,
                sortingParam: 'income',
                chiefFirst: false,
                reverseList: false
            },
            salaryPage: {
                visible: false,
                showPersonal: true,
                showOther: false,
                showTotal: false,
                showChief: false
            }
        }
    },
    actions: {
        updateSetting ({commit}, data) {
            return new Promise((resolve, reject) => {
                Vue.axios.post('/api/update_setting', {...data})
                    .then(res => {
                        commit('SET_SETTING', res.data)
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        }
    },
    mutations: {
        SET_MINI_MODE_VALUE (state, value) {
            localStorage.setItem('isi-miniMode', value)
        },
        SET_SETTING (state, setting) {
            state.data = setting.data
        }
    },
    getters: {
        miniMode: () => localStorage.getItem('isi-miniMode') || false
    }
}
