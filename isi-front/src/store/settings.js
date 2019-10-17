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

    },
    mutations: {
        SET_SETTING (state, setting) {
            state.data = setting.data
        }
    },
    getters: {

    }
}
