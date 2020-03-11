export default {
    state: {
        sidePanel: true,
        sidePanelMode: 'events'
    },
    mutations: {
        SET_SIDE_PANEL_STATUS (state, data) {
            state.sidePanel = data.status
            state.sidePanelMode = data.mode
        }
    }
}
