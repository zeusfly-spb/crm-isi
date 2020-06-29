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
        handleSqlEvent ({dispatch, commit}, event) {
            const insertLead = lead => {
                commit('ADD_LEAD', lead)
                dispatch('changeCount', {
                    status: 'wait',
                    value: 1
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
            /*
            Lead comments
             */
            const insertLeadComment = leadComment => {

            }

            const handleLead = event => {
                if (event.type === 'INSERT' && event.affectedRows[0].after) {
                    insertLead(event.affectedRows[0].after)
                }
                if (event.type === 'UPDATE' && event.affectedRows[0].after) {
                    console.dir(event.affectedRows[0].after)
                    updateLead(event.affectedRows[0].after)
                }
                if (event.type === 'DELETE' && event.affectedRows[0].before) {
                    deleteLead(event.affectedRows[0].before)
                }
            }
            const handleLeadComment = event => {
                if (event.type === 'INSERT' && event.affectedRows[0].after) {
                    insertLeadComment(event.affectedRows[0].after)
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
