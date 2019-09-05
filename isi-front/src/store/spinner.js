import Vue from 'vue'

export default {
    state: {
        currentPage: ''
    },
    actions: {
        setCurrentPage ({commit}, pageName) {
            commit('SET_CURRENT_PAGE', pageName)
        }
    },
    mutations: {
        SET_CURRENT_PAGE (state, pageName) {
            state.currentPage = pageName
        }
    },
    getters: {

    }
}
