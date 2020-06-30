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
    actions: {
        handleSqlEvent ({dispatch, getters, commit}, event) {
            const insertLead = lead => {
                commit('ADD_LEAD', lead)
                dispatch('changeCount', {
                    status: lead.status,
                    value: 1
                })
                    .then(() => {
                        if (lead.status === 'wait') {
                            commit('BEEP')
                        }
                    })

            }
            const deleteLead = lead => {
                commit('DELETE_LEAD', lead)
                dispatch('changeCount', {
                    status: lead.status,
                    value: -1
                })
            }
            const updateLead = lead => commit('UPDATE_LEAD', lead)
            const changeLeadStatus = data => {
                dispatch('changeCount', {
                    status: data.before.status,
                    value: -1
                })
                dispatch('changeCount', {
                    status: data.after.status,
                    value: 1
                })
                if (getters.currentLeadStatus === data.before.status) {
                    commit('DELETE_LEAD', data.before)
                }
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
    }
}
