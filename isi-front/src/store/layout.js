export default {
    state: {
        sidePanel: false,
        sidePanelMode: null
    },
    mutations: {
        SET_SIDE_PANEL_STATUS (state, data) {
            state.sidePanel = data.status
            state.sidePanelMode = data.mode
        }
    }
}
