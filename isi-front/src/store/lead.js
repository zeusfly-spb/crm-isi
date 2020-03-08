import Vue from 'vue'

export default {
    state: {
        message: null
    },
    mutations: {
        SEND_LEAD_MESSAGE (state, message) {
            state.message = message
            setTimeout(() => state.message = null, 100)
        }
    }
}