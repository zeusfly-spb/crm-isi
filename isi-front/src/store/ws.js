import Vue from 'vue'

const isJson = str => {
    try {
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
}

export default {
    state: {
        wsOutbox: []
    },
    actions: {
        handleWsFrame ({dispatch}, frame) {
            const insertLead = lead => {
                dispatch('changeCount', {
                    status: lead.status,
                    value: 1
                })
                    .then(() => {
                        lead.status === 'wait' ? commit('BEEP') : null
                        lead.status === getters.currentLeadStatus ? commit('ADD_LEAD', lead) : null
                    })
            }
            return new Promise((resolve, reject) => {
                try {
                    if (!isJson(frame)) {
                        return
                    }
                    let obj = JSON.parse(frame)
                    switch (obj.type) {
                        case 'add_lead':
                            insertLead(obj.entity)
                            console.log('Inserted lead')
                            break
                        default: break
                    }
                } catch (e) {
                    reject(e)
                }
            })
        },
        popFrame ({state, commit}) {
            return new Promise((resolve, reject) => {
                try {
                    let lastFrame = state.wsOutbox[state.wsOutbox.length - 1]
                    commit('POP_WS_OUTBOX')
                    resolve(lastFrame)
                } catch (e) {
                    reject(e)
                }
            })
        },
        pushFrame ({commit}, frame) {
            commit('PUSH_WS_OUTBOX', frame)
        },
        handleSqlEvent ({dispatch, getters, commit}, event) {
            const insertLead = lead => {
                dispatch('changeCount', {
                    status: lead.status,
                    value: 1
                })
                    .then(() => {
                        lead.status === 'wait' ? commit('BEEP') : null
                        lead.status === getters.currentLeadStatus ? commit('ADD_LEAD', lead) : null
                    })
            }
            const deleteLead = lead => {
                dispatch('changeCount', {
                    status: lead.status,
                    value: -1
                })
                    .then(() => lead.status === getters.currentLeadStatus ? commit('DELETE_LEAD', lead) : null)
            }
            const updateLead = lead => lead.status === getters.currentLeadStatus ? commit('UPDATE_LEAD', lead) : null
            const changeLeadStatus = data => {
                dispatch('changeCount', {
                    status: data.before.status,
                    value: -1
                })
                dispatch('changeCount', {
                    status: data.after.status,
                    value: 1
                })
                data.before.status ===  getters.currentLeadStatus ? commit('DELETE_LEAD', data.before) : null
                data.after.status ===  getters.currentLeadStatus ? commit('ADD_LEAD', data.after) : null
            }

            /**
             *
             * @param event
             */

            const handleLead = event => {
                if (event.type === 'INSERT' && event.affectedRows[0].after) {
                    insertLead(event.affectedRows[0].after)
                }
                if (event.type === 'UPDATE' && event.affectedRows[0].after) {
                    updateLead(event.affectedRows[0].after)
                    if (event.affectedRows[0].before.status !== event.affectedRows[0].after.status) {
                        changeLeadStatus({
                            before: event.affectedRows[0].before,
                            after: event.affectedRows[0].after,
                        })
                    }
                }
                if (event.type === 'DELETE' && event.affectedRows[0].before) {
                    deleteLead(event.affectedRows[0].before)
                }
            }

            const parseEvent = event => {
                switch (event.table) {
                    case 'leads':
                        handleLead(event)
                        break
                }
            }

            if (event.data && isJson(event.data)) {
                parseEvent(JSON.parse(event.data))
            }
        }
    },
    mutations: {
        PUSH_WS_OUTBOX (state, data) {
            state.wsOutbox.push(data)
        },
        POP_WS_OUTBOX(state) {
            state.wsOutbox.pop()
        }
    }
}
