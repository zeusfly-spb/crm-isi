export default {
    state: {
        sidePanel: false,
        sidePanelMode: null
    },
    mutations: {
        SET_SIDE_PANEL_STATUS (state, data) {
            if (data.status) {
                state.sidePanel = data.status
                state.sidePanelMode = data.mode
            } else {
                setTimeout (() => {
                    state.sidePanel = data.status
                    state.sidePanelMode = data.mode
                }, 3000)
            }
        }
    }
}
