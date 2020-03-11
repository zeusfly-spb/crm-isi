export default {
    state: {
        sidePanel: false
    },
    mutations: {
        SET_SIDE_PANEL_STATUS (state, status) {
            state.sidePanel = status
        }
    }
}
