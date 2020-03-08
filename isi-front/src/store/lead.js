import Vue from 'vue'

export default {
    state: {
        openLeadId: null,
        interactionsOpenId: null,
        message: null,
        menuOpenId: null
    },
    mutations: {
        SET_OPEN_LEAD_ID (state, id) {
            state.openLeadId = id
        },
        SET_LEAD_MENU_OPEN_ID (state, id) {
            state.menuOpenId = id
        },
        SET_INTERACTIONS_OPEN_ID (state, id) {
            state.interactionsOpenId = id
        },
        SEND_LEAD_MESSAGE (state, message) {
            state.message = message
            setTimeout(() => state.message = null, 100)
        }
    }
}